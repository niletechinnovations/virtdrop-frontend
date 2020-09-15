import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import commonService from './core/services/commonService';

import './App.css';
import Loader from './views/Loader/Loader';
import PageNotFound from './views/Pages/404/PageNotFound';

// Containers
const FrontEndLayout = React.lazy(() => import('./containers/FrontEndLayout/FrontEndLayout'));
const CommonLayout = React.lazy(() => import('./containers/CommonLayout/CommonLayout'));
const UserLayout = React.lazy(() => import('./containers/UserLayout/UserLayout'));
const AdminLayout = React.lazy(() => import('./containers/AdminLayout/AdminLayout'));

const loading = () => <Loader />;

class App extends Component {
  render(){
    return (
      <Router>
          <React.Suspense fallback={loading()}>
            <Switch>
              <PrivateRoute path="/admin" name="Admin" component={AdminLayout} /> */}
              <Route path="/common" name="Common" component={CommonLayout} />
              <ProtectedRoute path="/user" name="User" component={UserLayout} />
              <Route path="/" name="Home" component={FrontEndLayout} />
              <Route name="Page not found" component={PageNotFound} />
            </Switch>
          </React.Suspense>
      </Router>
    );
  }
}

const PrivateRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      const role = localStorage.getItem("role");
      return commonService.getAuth() && ( role === "admin" || role === "recruitmentAdmin" || role === "recruitmentTeam" || role === "marketingTeam" ) ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: routeProps.location }
        }}/>
      );
    }}/>
  );
};

const ProtectedRoute = ({ component, ...rest }) => {
  return (
    <Route {...rest} render={routeProps => {
      return commonService.getAuth() && localStorage.getItem("role") !== "" ? (
        renderMergedProps(component, routeProps, rest)
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: routeProps.location }
        }}/>
      );
    }}/>
  );
};

const renderMergedProps = (component, ...rest) => {
  const finalProps = Object.assign({}, ...rest);
  return (
    React.createElement(component, finalProps)
  );
}

export default App;
