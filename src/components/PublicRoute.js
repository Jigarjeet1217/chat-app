import React from 'react';
import { Redirect, Route } from 'react-router';
import { Container, Loader } from 'rsuite';
import { useProfile } from '../context/Profile.context';

const PublicRoute = ({ children, ...restProp }) => {
  const { profile, isLoading } = useProfile();

  if (isLoading && !profile) {
    return (
      <Container>
        <Loader center vertical size="md" speed="slow" content="Loading" />
      </Container>
    );
  }

  if (profile && !isLoading) {
    return <Redirect to="/" />;
  }

  return <Route {...restProp}>{children}</Route>;
};

export default PublicRoute;
