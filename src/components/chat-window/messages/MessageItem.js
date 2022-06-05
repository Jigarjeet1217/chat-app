import React, { memo, useState } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import DynamicFunctionality from './DynamicFunctionality';
import ProfileModal from './ProfileModal';

const MessageItem = ({ message, handleAdmins, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, likeCount } = message;
  const isAdmin = useContextSelector(CurrentRoomContext, v => v.isAdmin);
  const areAdmins = useContextSelector(CurrentRoomContext, v => v.areAdmins);
  const [isHovered, setIsHovered] = useState(false);

  const isAuthorAdmin = areAdmins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li
      className={`padded mb-1 cursor-pointer ${
        isHovered ? 'bg-black-02' : ''
      } `}
      onMouseOver={() => setIsHovered(true)}
      onFocus={() => setIsHovered(true)}
      onMouseOut={() => setIsHovered(false)}
      onBlur={() => setIsHovered(false)}
    >
      <div className="d-flex align-items-center font-bolder mb-1">
        <PresenceDot uid={author.uid} />
        <ProfileAvatar
          src={author.avatar}
          name={author.nickname}
          className="ml-1"
          size="sm"
        />
        <ProfileModal
          profile={author}
          appearance="link"
          className="p-0 ml-1 text-black"
        >
          {canGrantAccess && (
            <Button block color="blue" onClick={() => handleAdmins(author.uid)}>
              {isAuthorAdmin ? 'Remove admin permissions' : 'Promote to Admin'}
            </Button>
          )}
        </ProfileModal>
        <TimeAgo
          datetime={createdAt}
          className="font-normal text-black-45 ml-2"
        />
        <DynamicFunctionality
          {...(isLiked ? { color: 'red' } : {})}
          isVisible={isHovered}
          icon="heart"
          tooltip="Like this nessage"
          badge={likeCount}
          onClick={() => handleLike(message.id)}
        />
        {isAuthor && (
          <DynamicFunctionality
            isVisible={isHovered}
            icon="close"
            tooltip="Delete this nessage"
            onClick={() => handleDelete(message.id)}
          />
        )}
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
