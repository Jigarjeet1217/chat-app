import React, { useState, useCallback } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/compat/app';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../context/Profile.context';
import { database } from '../../../misc/firebase';
import Attachment from './Attachment';
import Audio from './Audio';

const assembleMessage = (profile, chatId) => {
  return {
    roomId: chatId,
    author: {
      name: profile.name,
      uid: profile.uid,
      createdAt: profile.createdAt,
      ...(profile.avatar ? { avatar: profile.avatar } : {}),
    },
    createdAt: firebase.database.ServerValue.TIMESTAMP,
    likeCount: 0,
  };
};

const Bottom = () => {
  const [input, setInput] = useState('');
  const [isLoading, setisLoading] = useState(false);
  const { chatId } = useParams();
  const { profile } = useProfile();
  const onInputChange = useCallback(value => {
    setInput(value);
  }, []);

  const onSendClick = async () => {
    if (input.trim() === '') {
      return;
    }
    const messageData = assembleMessage(profile, chatId);
    messageData.text = input;
    const updates = {};

    const messageId = database.ref('messages').push().key;
    updates[`/messages/${messageId}`] = messageData;
    updates[`/rooms/${chatId}/lastMessage`] = {
      ...messageData,
      msgId: messageId,
    };
    setisLoading(true);
    try {
      await database.ref().update(updates);
      setisLoading(false);
      setInput('');
    } catch (error) {
      setisLoading(false);
      Alert.error(error.message, 4000);
    }
  };

  const onKeyDown = async e => {
    if (e.keyCode === 13) {
      e.preventDefault();
      await onSendClick();
    }
  };

  const uploadFiles = useCallback(
    async files => {
      setisLoading(true);
      const updates = {};

      files.forEach(file => {
        const msgData = assembleMessage(profile, chatId);
        msgData.file = file;
        const messageId = database.ref('messages').push().key;
        updates[`/messages/${messageId}`] = msgData;
      });

      const lastMsgId = Object.keys(updates).pop();

      updates[`/rooms/${chatId}/lastMessage`] = {
        ...updates[lastMsgId],
        msgId: lastMsgId,
      };

      try {
        await database.ref().update(updates);
        setisLoading(true);
      } catch (error) {
        setisLoading(true);
        Alert.error(error.message, 4000);
      }
    },
    [chatId, profile]
  );

  return (
    <div>
      <InputGroup>
        <Attachment uploadFiles={uploadFiles} />
        <Audio uploadFiles={uploadFiles} />
        <Input
          placeholder="Write a new message here..."
          value={input}
          onChange={onInputChange}
          onKeyDown={onKeyDown}
        />
        <InputGroup.Button
          color="blue"
          appearance="primary"
          onClick={onSendClick}
          disabled={isLoading}
        >
          <Icon icon="send" />
        </InputGroup.Button>
      </InputGroup>
    </div>
  );
};

export default Bottom;
