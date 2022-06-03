import React from 'react';
import TimeAgo from 'timeago-react';

const RoomItems = ({ room }) => {
  const { name, createdAt } = room;
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo
          datetime={new Date(createdAt)}
          className="font-normal text-black-45"
        />
      </div>
      <div className="d-flex align-items-center text-black-70">
        <span>No message yet...</span>
      </div>
    </div>
  );
};

export default RoomItems;
