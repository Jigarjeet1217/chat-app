import React, { useState, useCallback } from 'react';
import { Alert, Icon, Input, InputGroup } from 'rsuite';
import firebase from 'firebase/compat/app';
import { useParams } from 'react-router-dom';
import { useProfile } from '../../../context/Profile.context';
import { database } from '../../../misc/firebase';

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
    updates[`/rooms/${chatId}/lastmessage`] = {
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

  return (
    <div>
      <InputGroup>
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
