import React from 'react';
import ThrowRock from './ThrowRock';
import WindowHistory from './WindowHistory';
import RockHistory from './RockHistory';

export default () => {
  return (
    <div>
      <ThrowRock />
      <RockHistory />
      <hr />
      <WindowHistory />
    </div>
  );
};
