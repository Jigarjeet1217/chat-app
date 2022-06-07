import React, { memo, useState } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
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

const flex = {
  display: 'flex',
  justifyContent: 'start',
  alignItems: 'end',
  borderRadius: '5px',
  marginBottom: '5px',
};

const MessageItem = ({ message, handleAdmins, handleLike, handleDelete }) => {
  const { author, createdAt, text, likes, file, likeCount } = message;
  const isAdmin = useContextSelector(CurrentRoomContext, v => v.isAdmin);
  const areAdmins = useContextSelector(CurrentRoomContext, v => v.areAdmins);
  const [isHovered, setIsHovered] = useState(false);
  const isMobile = useMediaQuery('(max-width:400px)');

  const isAuthorAdmin = areAdmins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;
  const isLiked = likes && Object.keys(likes).includes(auth.currentUser.uid);

  return (
    <li className="d-flex align-items-center justify-content-between mb-3 p-2 pb-0">
      <div className="d-flex align-items-center justify-content-center w-50 h-50  ml-2 pt-2">
        <PresenceDot uid={author.uid} style={{ alignSelf: 'end' }} />
        <ProfileAvatar
          src={author.avatar}
          name={author.name}
          className="w-35 h-35 font-normal "
          style={{ zIndex: 9 }}
        />
      </div>
      <div
        style={{
          width: isMobile ? 'calc(100% - 40px)' : 'calc(100% - 70px)',
          borderRadius: '5px',
          padding: '10px',
        }}
        className="msg-bg mr-2 cursor-pointer"
        onMouseOver={() => setIsHovered(true)}
        onFocus={() => setIsHovered(true)}
        onMouseOut={() => setIsHovered(false)}
        onBlur={() => setIsHovered(false)}
      >
        <div style={flex}>
          <ProfileModal
            profile={author}
            appearance="link"
            className="text-black p-0"
          >
            {canGrantAccess && (
              <Button
                block
                color="blue"
                onClick={() => handleAdmins(author.uid)}
              >
                {isAuthorAdmin
                  ? 'Remove admin permissions'
                  : 'Promote to Admin'}
              </Button>
            )}
          </ProfileModal>
          <div style={{ fontSize: '12px' }}>
            <TimeAgo
              datetime={createdAt}
              className="font-normal text-black-45 ml-2"
            />
          </div>
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
        {text && (
          <span className="word-break-all" style={{ fontWeight: '400' }}>
            {text}
          </span>
        )}
        {file && renderFiles(file)}
      </div>
    </li>
  );
};

export default memo(MessageItem);
