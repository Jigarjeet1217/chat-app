import React from 'react';
import { Modal } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';

const { Header, Title, Footer, Body } = Modal;
const ImageBtnModal = ({ src, name }) => {
  const { isOpen, open, close } = useModalState();
  return (
    <>
      <input
        type="image"
        src={src}
        alt={name}
        className="mw-100 mh-100"
        onClick={open}
        style={{ borderRadius: '5px' }}
      />
      <Modal show={isOpen} onHide={close}>
        <Header>
          <Title>{name}</Title>
        </Header>
        <Body>
          <div>
            <img
              src={src}
              height="100%"
              width="100%"
              alt={name}
              style={{ borderRadius: '5px' }}
            />
          </div>
        </Body>
        <Footer>
          <a href={src} target="_blank" rel="noopener noreferrer">
            View Original
          </a>
        </Footer>
      </Modal>
    </>
  );
};

export default ImageBtnModal;
