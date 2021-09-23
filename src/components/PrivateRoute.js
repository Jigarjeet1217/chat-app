import React from 'react';
import { Redirect, Route } from 'react-router';

const PrivateRoute = ({ children, ...restProp }) => {
  // Check for profile (loggged or not)
  const profile = false;

  if (!profile) {
    return <Redirect to="/signin" />;
  }

  return <Route {...restProp}>{children}</Route>;
};

export default PrivateRoute;
