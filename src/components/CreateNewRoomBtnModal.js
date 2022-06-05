import React, { useState, useCallback, useRef } from 'react';
import {
  Alert,
  Button,
  ControlLabel,
  Form,
  FormControl,
  FormGroup,
  Icon,
  Modal,
  Schema,
} from 'rsuite';
import firebase from 'firebase/compat/app';
import { useModalState } from '../misc/custom-hooks';
import { auth, database } from '../misc/firebase';

const { Header, Title, Body, Footer } = Modal;
const { StringType } = Schema.Types;
const model = Schema.Model({
  name: StringType().isRequired('Chat room name is required.'),
  description: StringType().isRequired('Description is required.'),
});
const initVal = { name: '', description: '' };

const CreateNewRoomBtnModal = () => {
  const { isOpen, open, close } = useModalState();
  const [formValue, setFormValue] = useState(initVal);
  const [isLoading, setIsLoading] = useState(false);
  const formRef = useRef();
  const onFormChange = useCallback(value => {
    setFormValue(value);
  }, []);
  const onSubmit = async () => {
    if (!formRef.current.check()) {
      return;
    }

    const newRoomData = {
      ...formValue,
      createdAt: firebase.database.ServerValue.TIMESTAMP,
      admins: {
        [auth.currentUser.uid]: true,
      },
    };
    setIsLoading(true);
    try {
      await database.ref('rooms').push(newRoomData);
      Alert.info(`${formValue.name} has been created`);
      setIsLoading(false);
      setFormValue(initVal);
      close();
    } catch (error) {
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <div className="mt-2">
      <Button block color="green" onClick={open}>
        <Icon icon="creative" /> Create new chat room
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Header>
          <Title>New Chat Room</Title>
        </Header>
        <Body>
          <Form
            ref={formRef}
            fluid
            formValue={formValue}
            onChange={onFormChange}
            model={model}
          >
            <FormGroup>
              <ControlLabel>Room Name</ControlLabel>
              <FormControl name="name" placeholder="Enter chart room name..." />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Description</ControlLabel>
              <FormControl
                componentClass="textarea"
                rows={5}
                name="description"
                placeholder="Enter room description..."
              />
            </FormGroup>
          </Form>
        </Body>
        <Footer>
          <Button
            block
            appearance="primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            Create new Chat Room
          </Button>
        </Footer>
      </Modal>
    </div>
  );
};

export default CreateNewRoomBtnModal;
