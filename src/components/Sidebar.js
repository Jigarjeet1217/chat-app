import React, { useRef, useState, useEffect } from 'react';
import { Divider } from 'rsuite';
import CreateNewRoomBtnModal from './CreateNewRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle';
import ChatRoomList from './rooms/ChatRoomList';

const Sidebar = () => {
  const topHeight = useRef();
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (topHeight.current) {
      setHeight(topHeight.current.scrollHeight);
    }
  }, [topHeight]);

  return (
    <div className="h-100 pt-2 mr-2">
      <div ref={topHeight}>
        <DashboardToggle />
        <CreateNewRoomBtnModal />
        <Divider>Join Conversation</Divider>
      </div>
      <ChatRoomList aboveHeight={height} />
    </div>
  );
};

export default Sidebar;
