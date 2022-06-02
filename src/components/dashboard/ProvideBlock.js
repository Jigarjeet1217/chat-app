import React, { useState } from 'react';
import { Alert, Button, Icon, Tag } from 'rsuite';
import firebase from 'firebase/compat/app';
import { auth } from '../../misc/firebase';

const ProvideBlock = () => {
  const [isConnected, setIsConnected] = useState({
    'google.com': auth.currentUser.providerData.some(
      user => user.providerId === 'google.com'
    ),
    'facebook.com': auth.currentUser.providerData.some(
      user => user.providerId === 'facebook.com'
    ),
  });

  const updateIsConnected = (providerId, active) => {
    setIsConnected(p => {
      return {
        ...p,
        [providerId]: active,
      };
    });
  };
  const unlink = async providerId => {
    try {
      if (auth.currentUser.providerData.length === 1) {
        throw new Error(`You cannot disconnect from ${providerId} `);
      }
      await auth.currentUser.unlink(providerId);
      Alert.info(`Disconnected from ${providerId}`, 4000);
      updateIsConnected(providerId, false);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  const unlinkFacebook = () => {
    unlink('facebook.com');
  };

  const unlinkGoogle = () => {
    unlink('google.com');
  };

  const link = async providerObj => {
    try {
      await auth.currentUser.linkWithPopup(providerObj);
      Alert.info(`Connected to ${providerObj.providerId}`);
      updateIsConnected(providerObj.providerId, true);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };

  const linkFacebook = async () => {
    await link(new firebase.auth.FacebookAuthProvider());
  };

  const linkGoogle = async () => {
    await link(new firebase.auth.GoogleAuthProvider());
  };

  return (
    <div>
      {isConnected['google.com'] && (
        <Tag closable color="green" onClose={unlinkGoogle}>
          <Icon icon="google" /> Connected
        </Tag>
      )}
      {isConnected['facebook.com'] && (
        <Tag closable color="blue" onClose={unlinkFacebook}>
          <Icon icon="facebook" /> Connected
        </Tag>
      )}
      <div className="mt-2">
        {!isConnected['google.com'] && (
          <Button color="green" block onClick={linkGoogle}>
            <Icon icon="google" /> Link to Google
          </Button>
        )}
        {!isConnected['facebook.com'] && (
          <Button color="blue" block onClick={linkFacebook}>
            <Icon icon="facebook" /> Link to Facebook
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProvideBlock;
