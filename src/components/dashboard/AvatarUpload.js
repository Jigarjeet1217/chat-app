import React, { useState, useRef } from 'react';
import { Alert, Button, Modal } from 'rsuite';
import AvatarEditor from 'react-avatar-editor';
import { useModalState } from '../../misc/custom-hooks';
import { storage, database } from '../../misc/firebase';
import { useProfile } from '../../context/Profile.context';
import ProfileAvatar from '../ProfileAvatar';

const fileTypes = '.png,.jpeg,.jpg';
const acceptFileTypes = ['image/png', 'image/jpg', 'image/jpeg'];

const AvatarUpload = () => {
  const { isOpen, close, open } = useModalState();
  const [img, setImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const avatarRef = useRef();
  const { profile } = useProfile();

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

  const getBlob = async canvas => {
    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('File processing error.'));
        }
      });
    });
  };

  const onUploadClick = async () => {
    const canvas = avatarRef.current.getImageScaledToCanvas();
    try {
      setIsLoading(true);
      const blob = await getBlob(canvas);
      const avatarFileRef = storage
        .ref(`/profile/${profile.uid}`)
        .child('avatar');

      const uploadAvatar = await avatarFileRef.put(blob, {
        cacheControl: `public, max-age=${3600 * 24 * 3}`,
      });

      const downloadUrl = await uploadAvatar.ref.getDownloadURL();
      const userAvatarRef = database
        .ref(`/profiles/${profile.uid}`)
        .child('avatar');
      userAvatarRef.set(downloadUrl);
      setIsLoading(false);
      Alert.info('Avatar has been uploaded', 4000);
    } catch (e) {
      setIsLoading(false);
      Alert.error(e.message, 4000);
    }
  };

  return (
    <div className="mt-3 text-center">
      <ProfileAvatar src={profile.avatar} name={profile.name} />
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
                  ref={avatarRef}
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
            <Button
              appearance="ghost"
              onClick={onUploadClick}
              disabled={isLoading}
            >
              Upload new avatar
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
};

export default AvatarUpload;
