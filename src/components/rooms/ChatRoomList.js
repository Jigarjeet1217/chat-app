import React from 'react';
import { Nav } from 'rsuite';
import RoomItems from './RoomItems';

const ChatRoomList = ({ aboveHeight }) => {
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100vh - ${aboveHeight + 30}px)`,
      }}
    >
      <Nav.Item>
        <RoomItems />
      </Nav.Item>
    </Nav>
  );
};

export default ChatRoomList;
