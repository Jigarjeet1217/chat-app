import React, { memo, useState } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import DynamicFunctionality from './DynamicFunctionality';
import ImageBtnModal from './ImageBtnModal';
import ProfileModal from './ProfileModal';

const renderFiles = file => {
  if (file.contentType.includes('image')) {
    return (
      <div className="height-220">
        <ImageBtnModal src={file.url} name={file.name} />
      </div>
    );
  }

  if (file.contentType.includes('audio')) {
    return (
      // eslint-disable-next-line jsx-a11y/media-has-caption
      <audio controls>
        <source src={file.url} type="audio/mp3" />
        Your browser does not support the audio element.
      </audio>
    );
  }

  return (
    // eslint-disable-next-line react/jsx-no-target-blank
    <a href={file.url} target="_blank" rel="noopener nonreferrer" download>
      Download {file.name}
    </a>
  );
};

const MessageItem = ({ message, handleAdmins, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, file, likeCount } = message;
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
            onClick={() => handleDelete(message.id, file)}
          />
        )}
      </div>
      <div>
        {text && <span className="word-break-all">{text}</span>}
        {file && renderFiles(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
