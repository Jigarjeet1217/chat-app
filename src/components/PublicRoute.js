import React from 'react';
import { Redirect, Route } from 'react-router';

const PublicRoute = ({ children, ...restProp }) => {
  // Check for profile (loggged or not)
  const profile = false;

  if (profile) {
    return <Redirect to="/" />;
  }

  return <Route {...restProp}>{children}</Route>;
};

export default PublicRoute;
