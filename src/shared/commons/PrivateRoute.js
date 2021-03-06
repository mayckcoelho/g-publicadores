import React from "react";
import { Route, Redirect } from "react-router-dom";
import consts from "../../consts";

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={(props) => {
      if (localStorage.getItem(consts.USER_TOKEN)) {
        return <Component {...props} />;
      } else {
        localStorage.clear();
        return (
          <Redirect
            to={{
              pathname: "/login",
              state: { from: props.location },
            }}
          />
        );
      }
    }}
  />
);

export default PrivateRoute;
