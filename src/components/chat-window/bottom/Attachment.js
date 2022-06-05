import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Alert, Button, Icon, InputGroup, Modal, Uploader } from 'rsuite';
import { useModalState } from '../../../misc/custom-hooks';
import { storage } from '../../../misc/firebase';

const maxFileSize = 5 * 1024 * 1024;
const count = 20;
const { Header, Title, Body, Footer } = Modal;
const Attachment = ({ uploadFiles }) => {
  const { isOpen, close, open } = useModalState();
  const [fileList, setFileList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { chatId } = useParams();

  const onChange = fileArr => {
    const filtered = fileArr
      .filter(f => f.blobFile.size <= maxFileSize)
      .slice(0, count);
    setFileList(filtered);
  };

  const onUpload = async () => {
    try {
      setIsLoading(true);
      const promises = fileList.map(file => {
        return storage
          .ref(`/chat/${chatId}/`)
          .child(Date.now() + file.name)
          .put(file.blobFile, { cacheControl: 'public,max-age= 3*3600*24' });
      });

      const uploadSnapShots = await Promise.all(promises);

      const shapePromises = uploadSnapShots.map(async snap => {
        return {
          contentType: snap.metadata.contentType,
          name: snap.metadata.name,
          url: await snap.ref.getDownloadURL(),
        };
      });

      const files = await Promise.all(shapePromises);
      await uploadFiles(files);
      setFileList([]);
      setIsLoading(false);
      close();
    } catch (error) {
      setFileList([]);
      setIsLoading(false);
      Alert.error(error.message, 4000);
    }
  };
  return (
    <div>
      <InputGroup>
        <InputGroup.Button onClick={open}>
          <Icon icon="attachment" />
        </InputGroup.Button>
      </InputGroup>
      <Modal show={isOpen} onHide={close}>
        <Header>
          <Title>Upload Files</Title>
        </Header>
        <Body>
          <div className="text-right mt-2 mb-2">
            <small style={{ color: 'blue' }}>
              *At a time you can upload maximum of {count} files
            </small>
          </div>
          <Uploader
            autoUpload={false}
            action=""
            onChange={onChange}
            fileList={fileList}
            multiple
            listType="picture-text"
            className="w-100"
            disabled={isLoading}
          />
        </Body>
        <Footer>
          <Button block onClick={onUpload} disabled={fileList.length === 0}>
            Send to chat
          </Button>
          <div className="text-right mt-2">
            <small style={{ color: 'red' }}>
              * only files less than 5mb are allowed
            </small>
          </div>
        </Footer>
      </Modal>
    </div>
  );
};

export default Attachment;
