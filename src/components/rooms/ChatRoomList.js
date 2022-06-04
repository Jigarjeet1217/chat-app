import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Loader, Nav } from 'rsuite';
import { useRooms } from '../../context/rooms.context';
import RoomItems from './RoomItems';

const ChatRoomList = ({ aboveHeight }) => {
  const rooms = useRooms();
  const location = useLocation();
  return (
    <Nav
      appearance="subtle"
      vertical
      reversed
      className="overflow-y-scroll custom-scroll"
      style={{
        height: `calc(100vh - ${aboveHeight + 30}px)`,
      }}
      activeKey={location.pathname}
    >
      {!rooms && (
        <Loader center vertical speed="slow" content="Loading" size="md" />
      )}
      {rooms &&
        rooms.length > 0 &&
        rooms.map(room => {
          return (
            <Nav.Item
              id={room.id}
              componentClass={Link}
              to={`/chat/${room.id}`}
              eventKey={`/chat/${room.id}`}
            >
              <RoomItems room={room} />
            </Nav.Item>
          );
        })}
    </Nav>
  );
};

export default ChatRoomList;
