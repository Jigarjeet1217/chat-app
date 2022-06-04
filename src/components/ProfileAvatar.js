import React from 'react';
import { Avatar } from 'rsuite';
import { getNameInitials } from '../misc/helpers';

const ProfileAvatar = ({ name, size, ...avatarProps }) => {
  return (
    <div>
      <Avatar
        circle
        className={!size ? 'width-200 height-200 img-fullsize font-huge' : ''}
        {...avatarProps}
      >
        {getNameInitials(name)}
      </Avatar>
    </div>
  );
};

export default ProfileAvatar;
