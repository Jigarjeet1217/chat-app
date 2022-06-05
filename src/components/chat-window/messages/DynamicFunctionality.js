import React from 'react';
import { Badge, Whisper, IconButton, Tooltip, Icon } from 'rsuite';

const ConditionalBadge = ({ condition, children }) => {
  return condition ? <Badge content={condition}>{children}</Badge> : children;
};

const DynamicFunctionality = ({
  isVisible,
  icon,
  tooltip,
  badge,
  onClick,
  ...props
}) => {
  return (
    <div
      className="ml-2"
      style={{ visibility: isVisible ? 'visible' : 'hidden' }}
    >
      <ConditionalBadge condition={badge}>
        <Whisper
          placement="top"
          delay={0}
          delayHide={0}
          delayShow={0}
          trigger="hover"
          speaker={<Tooltip>{tooltip}</Tooltip>}
        >
          <IconButton
            {...props}
            onClick={onClick}
            circle
            size="xs"
            icon={<Icon icon={icon} />}
          />
        </Whisper>
      </ConditionalBadge>
    </div>
  );
};

export default DynamicFunctionality;
