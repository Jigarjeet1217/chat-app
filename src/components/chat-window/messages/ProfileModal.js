import React from 'react';
import { Button, Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import ProfileAvatar from '../../ProfileAvatar';

const { Header, Title, Body, Footer } = Modal;

const ProfileModal = ({ profile, children, ...btnProps }) => {
  const { isOpen, open, close } = useModalState();
  const shortName = profile.name.split(' ')[0];
  const { name, avatar, createdAt } = profile;
  return (
    <>
      <Button {...btnProps} onClick={open} onMouseOver={open}>
        {shortName}
      </Button>
      <Modal show={isOpen} onHide={close}>
        <Header>
          <Title>{shortName} profile</Title>
        </Header>
        <Body className="text-center">
          <ProfileAvatar src={avatar} name={name} />
          <h4 className="mt-2">{name}</h4>
          <p>Member since {new Date(createdAt).toLocaleDateString()}</p>
        </Body>
        <Footer>
          {children}
          <Button block onClick={close}>
            Close
          </Button>
        </Footer>
      </Modal>
    </>
  );
};

export default ProfileModal;
