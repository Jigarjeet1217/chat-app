import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/Profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const onSave = async newData => {
    try {
      const nicknameRef = database.ref(`/profiles/${profile.uid}`);
      const update = { ...profile, nickname: newData };
      await nicknameRef.set(update);
      Alert.success('Nickname has been  updated', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  return (
    <>
      <Drawer.Header>
        <Drawer.Title>Dashboard</Drawer.Title>
      </Drawer.Header>

      <Drawer.Body>
        <h3>Hey, {profile.nickname}</h3>
        <Divider />
        <EditableInput
          initialValue={profile.nickname}
          onSave={onSave}
          name="nickname"
          label={<h6 className="mb-2">Nickname</h6>}
        />
      </Drawer.Body>

      <Drawer.Footer>
        <Button block color="red" onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
