import React, { memo } from 'react';
import { Button } from 'rsuite';
import TimeAgo from 'timeago-react';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { auth } from '../../../misc/firebase';
import PresenceDot from '../../PresenceDot';
import ProfileAvatar from '../../ProfileAvatar';
import ProfileModal from './ProfileModal';

const MessageItem = ({ message, handleAdmins }) => {
  const { author, createdAt, text } = message;
  const isAdmin = useContextSelector(CurrentRoomContext, v => v.isAdmin);
  const areAdmins = useContextSelector(CurrentRoomContext, v => v.areAdmins);

  const isAuthorAdmin = areAdmins.includes(author.uid);
  const isAuthor = auth.currentUser.uid === author.uid;
  const canGrantAccess = isAdmin && !isAuthor;

  return (
    <li className="padded mb-1">
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
      </div>
      <div>
        <span className="word-break-all">{text}</span>
      </div>
    </li>
  );
};

export default memo(MessageItem);
