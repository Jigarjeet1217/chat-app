import React from 'react';
import { Loader } from 'rsuite';
import { useParams } from 'react-router-dom';
import ChatTop from '../../components/chat-window/top';
import ChatBottom from '../../components/chat-window/bottom';
import Messages from '../../components/chat-window/messages';
import { useRooms } from '../../context/rooms.context';
import { CurrentRoomContextProvider } from '../../context/current-room.context';
import { auth } from '../../misc/firebase';

const Chat = () => {
  const { chatId } = useParams();
  const rooms = useRooms();

  if (!rooms) {
    <Loader center vertical size="md" speed="slow" content="Loading" />;
  }

  const currentRoom = rooms.filter(room => room.id === chatId);

  if (currentRoom.length === 0) {
    return (
      <h6 className="text-center  mt-page">Chat ID {chatId} not found.</h6>
    );
  }
  const { name, description, admins } = currentRoom[0];

  const areAdmins = admins ? Object.keys(admins) : [];
  const isAdmin = areAdmins.includes(auth.currentUser.uid);

  const currentRoomData = { name, description, isAdmin, areAdmins };

  return (
    <CurrentRoomContextProvider data={currentRoomData}>
      <div className="chat-top">
        <ChatTop />
      </div>
      <div className="chat-middle">
        <Messages />
      </div>
      <div className="chat-bottom">
        <ChatBottom />
      </div>
    </CurrentRoomContextProvider>
  );
};

export default Chat;
