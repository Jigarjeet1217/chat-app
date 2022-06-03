import React, { memo } from 'react';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';

const Top = () => {
  const name = useContextSelector(CurrentRoomContext, v => v.name);

  return <div>{name}</div>;
};

export default memo(Top);
