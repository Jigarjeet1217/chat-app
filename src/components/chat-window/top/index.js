import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { ButtonToolbar, Icon } from 'rsuite';
import { useContextSelector } from 'use-context-selector';
import { CurrentRoomContext } from '../../../context/current-room.context';
import { useMediaQuery } from '../../../misc/custom-hooks';
import EditRoomDrawer from './EditRoomDrawer';
import RoomInfoBtnModal from './RoomInfoBtnModal';

const Top = () => {
  const name = useContextSelector(CurrentRoomContext, v => v.name);
  const isAdmin = useContextSelector(CurrentRoomContext, v => v.isAdmin);
  const description = useContextSelector(
    CurrentRoomContext,
    v => v.description
  );
  const isMobile = useMediaQuery('(max-width:992px)');

  return (
    <>
      <div
        className="d-flex justify-content-between align-items-center"
        style={{
          marginTop: '5px',
          padding: '10px',
        }}
      >
        <h3 className="d-flex align-items-center align-items-center text-disappear">
          <Icon
            componentClass={Link}
            to="/"
            size="2x"
            icon="arrow-circle-left"
            className={
              isMobile
                ? 'd-inline-block p-0 mb-2 text-blue link-unstyled'
                : 'd-none'
            }
            style={{
              marginTop: '10px',
              marginRight: '10px',
            }}
          />
          <span className="text-disappear">{name}</span>
        </h3>
        <ButtonToolbar className="ws-nowrap">
          {isAdmin && <EditRoomDrawer />}
        </ButtonToolbar>
      </div>
      <div className="d-flex justify-content-between align-items-center">
        <span> </span>
        <RoomInfoBtnModal name={name} description={description} />
      </div>
    </>
  );
};

export default memo(Top);
