import React from 'react';
import TimeAgo from 'timeago-react';
import ProfileAvatar from '../ProfileAvatar';

const RoomItems = ({ room }) => {
  const { createdAt, lastMessage, name } = room;
  return (
    <div>
      <div className="d-flex align-items-center justify-content-between">
        <h3 className="text-disappear">{name}</h3>
        <TimeAgo
          datetime={
            lastMessage ? new Date(lastMessage.createdAt) : new Date(createdAt)
          }
          className="font-normal text-black-45"
        />
      </div>
      <div className="d-flex align-items-center text-black-70">
        {lastMessage ? (
          <>
            <div className="d-flex align-items-center">
              <ProfileAvatar
                src={lastMessage.author.avatar}
                name={lastMessage.author.nickname || lastMessage.author.name}
                size="sm"
              />
            </div>
            <div className="text-disappear ml-2">
              <div className="italic">{lastMessage.author.nickname}</div>
              <span>{lastMessage.text || lastMessage.file.name}</span>
            </div>
          </>
        ) : (
          <span>No message yet...</span>
        )}
      </div>
    </div>
  );
};

export default RoomItems;
