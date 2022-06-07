import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button } from 'rsuite';
import { auth, database, storage } from '../../../misc/firebase';
import { transformToArray, groupBy } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const pageSize = 15;
let messageRef = database.ref('/messages');

function shouldScrollToBottom(node, threshold = 30) {
  const percentage =
    (100 * node.scrollTop) / (node.scrollHeight - node.clientHeight) || 0;

  return percentage > threshold;
}

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);
  const [limit, setLimit] = useState(pageSize);
  const selfRef = useRef();

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  const loadMessages = useCallback(
    limitToLast => {
      const node = selfRef.current;
      messageRef.off();

      messageRef
        .orderByChild('roomId')
        .equalTo(chatId)
        .limitToLast(limitToLast || pageSize)
        .on('value', snap => {
          const data = transformToArray(snap.val());
          setMessages(data);

          if (shouldScrollToBottom(node)) {
            node.scrollTop = node.scrollHeight;
          }
        });

      setLimit(p => p + pageSize);
    },
    [chatId]
  );

  const onLoadMore = useCallback(() => {
    const node = selfRef.current;
    const oldHeight = node.scrollHeight;

    loadMessages(limit);

    setTimeout(() => {
      const newHeight = node.scrollHeight;
      node.scrollTop = newHeight - oldHeight;
    }, 500);
  }, [loadMessages, limit]);

  useEffect(() => {
    const node = selfRef.current;

    loadMessages();

    setTimeout(() => {
      node.scrollTop = node.scrollHeight;
    }, 500);

    return () => {
      messageRef.off('value');
    };
  }, [loadMessages]);

  const handleAdmins = useCallback(
    async uid => {
      const adminRef = database.ref(`/rooms/${chatId}/admins`);
      let msg;

      await adminRef.transaction(admin => {
        if (admin) {
          if (admin && admin[uid]) {
            admin[uid] = null;
            msg = 'Admin permissions removed';
          } else {
            admin[uid] = true;
            msg = 'Granted admin permissions';
          }
        }
        return admin;
      });

      Alert.info(msg, 4000);
    },
    [chatId]
  );

  const handleLike = useCallback(
    async msgId => {
      const { uid } = auth.currentUser;
      messageRef = database.ref(`/messages/${msgId}`);
      let msg;

      await messageRef.transaction(m => {
        if (m) {
          if (m.likes && m.likes[uid]) {
            m.likeCount -= 1;
            m.likes[uid] = null;
            msg = 'Like Removed';
          } else {
            m.likeCount += 1;
            if (!m.likes) {
              m.likes = {};
            }
            m.likes[uid] = true;
            msg = 'Like Added';
          }
        }
        return m;
      });

      Alert.info(msg, 4000);
    },
    [chatId]
  );

  const handleDelete = useCallback(
    async (msgId, file) => {
      // eslint-disable-next-line no-alert
      if (!window.confirm('Are you sure you want to delete this message?')) {
        return;
      }

      const isLast = messages[messages.length - 1].id === msgId;
      const updates = {};
      updates[`/messages/${msgId}`] = null;

      if (isLast && messages.length > 1) {
        updates[`/rooms/${chatId}/lastMessage`] = {
          ...messages[messages.length - 2],
          msgId: messages[messages.length - 2].id,
        };
      }

      if (isLast && messages.length === 1) {
        updates[`/rooms/${chatId}/lastMessage`] = null;
      }

      try {
        await database.ref().update(updates);
        Alert.success('Message has been deleted', 4000);
      } catch (error) {
        // eslint-disable-next-line consistent-return
        return Alert.error(error.message, 4000);
      }

      if (file) {
        try {
          const fileRef = storage.refFromURL(file.url);
          await fileRef.delete();
        } catch (error) {
          Alert.error(error.message, 4000);
        }
      }
    },
    [chatId, messages]
  );
  const renderMessages = () => {
    const groups = groupBy(messages, item =>
      new Date(item.createdAt).toDateString()
    );

    const items = [];
    Object.keys(groups).forEach(date => {
      items.push(
        <li key={date} className="text-center padded">
          {date}
        </li>
      );
      const msgs = groups[date].map(msg => {
        return (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmins={handleAdmins}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        );
      });

      items.push(...msgs);
    });
    return items;
  };
  return (
    <ul ref={selfRef} className="msg-list custom-scroll">
      {messages && messages.length >= pageSize && (
        <li className="text-center mt-2 mb-2">
          <Button onClick={onLoadMore} color="green">
            Load More
          </Button>
        </li>
      )}
      {isChatEmpty && (
        <li
          style={{
            fontSize: '40px',
            fontWeight: 100,
            textAlign: 'center',
            marginTop: '150px',
          }}
        >
          No message yet...
        </li>
      )}
      {canShowMessages && renderMessages()}
    </ul>
  );
};

export default Messages;
