import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'rsuite';
import { auth, database } from '../../../misc/firebase';
import { transformToArray } from '../../../misc/helpers';
import MessageItem from './MessageItem';

const Messages = () => {
  const { chatId } = useParams();
  const [messages, setMessages] = useState(null);

  const isChatEmpty = messages && messages.length === 0;
  const canShowMessages = messages && messages.length > 0;

  useEffect(() => {
    const messageRef = database.ref('/messages');
    messageRef
      .orderByChild('roomId')
      .equalTo(chatId)
      .on('value', snap => {
        const data = transformToArray(snap.val());
        setMessages(data);
      });

    return () => {
      messageRef.off('value');
    };
  }, [chatId]);

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
      const messageRef = database.ref(`/messages/${msgId}`);
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
    async msgId => {
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
        Alert.error(error.message, 4000);
      }
    },
    [chatId, messages]
  );

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No message yet</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem
            key={msg.id}
            message={msg}
            handleAdmins={handleAdmins}
            handleLike={handleLike}
            handleDelete={handleDelete}
          />
        ))}
    </ul>
  );
};

export default Messages;
