import React from 'react';
import { Alert, Button, Divider, Drawer } from 'rsuite';
import { useProfile } from '../../context/Profile.context';
import { database } from '../../misc/firebase';
import EditableInput from '../EditableInput';
import ProvideBlock from './ProvideBlock';
import AvatarUpload from './AvatarUpload';
import { getuserUpdates } from '../../misc/helpers';

const Dashboard = ({ onSignOut }) => {
  const { profile } = useProfile();
  const onSave = async newData => {
    try {
      const updates = await getuserUpdates(
        profile.uid,
        'name',
        newData,
        database
      );

      await database.ref().update(updates);
      Alert.success('Nickname has been  updated', 4000);
    } catch (error) {
      Alert.error(error.message, 4000);
    }
  };
  return (
    <>
      <Drawer.Body style={{ marginTop: 0, marginBottom: 0, height: 'auto' }}>
        <h3 style={{ marginTop: '20px' }}>
          Hey, <span>{profile.name}</span>
        </h3>
        <ProvideBlock />
        <Divider />
        <EditableInput
          initialValue={profile.name}
          onSave={onSave}
          name="name"
          label={<h6 className="mb-2">Name</h6>}
        />
        <AvatarUpload />
      </Drawer.Body>

      <Drawer.Footer className="pt-2">
        <Button block color="red" onClick={onSignOut}>
          Sign Out
        </Button>
      </Drawer.Footer>
    </>
  );
};

export default Dashboard;
