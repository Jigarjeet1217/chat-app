import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

const { Header, Title, Body, Footer } = Modal;
const RoomInfoBtnModal = ({ name, description }) => {
  const { isOpen, open, close } = useModalState();
  return (
    <div>
      <Button appearance="link" className="px-0" onClick={open}>
        Room Information
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Header>
          <Title>About {name}</Title>
        </Header>
        <Body>
          <h6 className="mb-1">Description</h6>
          <p>{description}</p>
        </Body>
        <Footer>
          <Button block onClick={close} appearance="primary">
            Close
          </Button>
        </Footer>
      </Modal>
    </div>
  );
};

export default RoomInfoBtnModal;
