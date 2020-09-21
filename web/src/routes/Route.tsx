import React from 'react';
import {
  RouteProps as ReactRouteProps,
  Route as ReactRoute,
  Redirect,
} from 'react-router-dom';

import { useAuth } from '../context/AuthContext';

interface RouteProps extends ReactRouteProps {
  isPrivated?: boolean;
  // Recebe um componente
  component: React.ComponentType;
}

const Route: React.FC<RouteProps> = ({
  isPrivated = false,
  component: Component,
  ...rest
}) => {
  const { user } = useAuth();

  return (
    <ReactRoute
      {...rest}
      render={({ location }) => {
        return isPrivated === !!user ? (
          <Component />
        ) : (
          <Redirect
            to={{
              pathname: isPrivated ? '/' : '/dashboard',
              state: { from: location },
            }}
          />
        );
      }}
    />
  );
};

export default Route;
