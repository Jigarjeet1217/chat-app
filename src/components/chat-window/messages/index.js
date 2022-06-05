import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Alert } from 'rsuite';
import { database } from '../../../misc/firebase';
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

  return (
    <ul className="msg-list custom-scroll">
      {isChatEmpty && <li>No message yet</li>}
      {canShowMessages &&
        messages.map(msg => (
          <MessageItem key={msg.id} message={msg} handleAdmins={handleAdmins} />
        ))}
    </ul>
  );
};

export default Messages;
