import React from 'react';
import CreateNewRoomBtnModal from './CreateNewRoomBtnModal';
import DashboardToggle from './dashboard/DashboardToggle';

const Sidebar = () => {
  return (
    <div className="h-100 pt-2">
      <div>
        <DashboardToggle />
        <CreateNewRoomBtnModal />
      </div>
    </div>
  );
};

export default Sidebar;
