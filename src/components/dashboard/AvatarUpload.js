import React, { useState } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';

const fileTypes = '.png,.jpeg,.jpg';
const acceptFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const AvatarUpload = () => {
  const { isOpen, close, open } = useModalState();
  const [img, setImg] = useState(null);
  const onFileChange = e => {
    const { files } = e.target;
    if (files.length === 1) {
      const file = files[0];
      if (acceptFileTypes.includes(file.type)) {
        setImg(file);
        open();
      } else {
        Alert.warning(`Wrong file type ${file.type}`, 4000);
      }
    }
  };
  return (
    <div className="mt-3 text-center">
      <div>
        <label
          htmlFor="avatar_upload"
          className="d-block cursor-pointer padded"
        >
          Select New Avatar
          <input
            id="avatar_upload"
            type="file"
            className="d-none"
            accept={fileTypes}
            onChange={onFileChange}
          />
        </label>
        <Modal show={isOpen} onHide={close}>
          <Modal.Title>Adjust and upload new avatar</Modal.Title>
          <Modal.Body>
            <div className="d-flex justify-content-center align-items-center h-100">
              {img && (
                <AvatarEditor
                  image={img}
                  width={200}
                  height={200}
                  border={0}
                  borderRadius={100}
                  rotate={0}
                />
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button appearance="ghost">Upload new avatar</Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUpload;
