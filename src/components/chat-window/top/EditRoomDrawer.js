import React from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Drawer } from 'rsuite';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { useMediaQuery, useModalState } from '../../../misc/custom-hooks';
import { database } from '../../../misc/firebase';
import EditableInput from '../../EditableInput';

const { Header, Footer, Body, Title } = Drawer;
const EditRoomDrawer = () => {
  const { isOpen, open, close } = useModalState();
  const name = useContextSelector(CurrentRoomContext, v => v.name);
  const description = useContextSelector(
    CurrentRoomContext,
    v => v.description
  );
  const { chatId } = useParams();
  const isMobile = useMediaQuery('(max-width:992px)');

  const updateData = (key, value) => {
    database
      .ref(`rooms/${chatId}`)
      .child(key)
      .set(value)
      .then(() => {
        Alert.success('Updated Successfully', 4000);
      })
      .catch(err => {
        Alert.error(err.message, 4000);
      });
  };

  const onNameSave = value => {
    updateData('name', value);
  };

  const onDescriptionSave = value => {
    updateData('description', value);
  };

  return (
    <div>
      <Button className="br-circle" size="sm" color="red" onClick={open}>
        A
      </Button>
      <Drawer full={isMobile} show={isOpen} onHide={close}>
        <Header>
          <Title>Edit Room</Title>
        </Header>
        <Body>
          <EditableInput
            initialValue={name}
            label={<h6 className="mb-2">Name</h6>}
            emptyMsg="Name can not be empty"
            onSave={onNameSave}
          />
          <EditableInput
            wrapperClass="mt-3"
            initialValue={description}
            componentClass="textarea"
            label={<h6 className="mb-2">Description</h6>}
            emptyMsg="Description can not be empty"
            onSave={onDescriptionSave}
          />
        </Body>
        <Footer>
          <Button block onClick={close}>
            Close
          </Button>
        </Footer>
      </Drawer>
    </div>
  );
};

export default EditRoomDrawer;
