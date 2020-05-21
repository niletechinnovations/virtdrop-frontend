import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';
import { ToastContainer } from 'react-toastify';
// routes config
import userRoutes from '../../routes/userRoutes';

import UserPanelHeader from '../UserLayout/UserPanelHeader';
import UserNavbar from './UserNavbar';

import './UserLayout.css';


class UserLayout extends Component {
  
  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    localStorage.clear();
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app user-layout">
          <UserPanelHeader />
          <div className="page-wrapper">
            <div className="dashboard-memu">
              <UserNavbar />
            </div>
            <Container>
              <ToastContainer />
              <Suspense fallback={this.loading()}>
                <Switch>
                  {userRoutes.map((route, idx) => {
                    return route.component ? (
                      <Route
                        key={idx}
                        path={route.path}
                        exact={route.exact}
                        name={route.name}
                        render={props => (
                          <route.component {...props} />
                        )} />
                    ) : (null);
                  })}
                  <Redirect from="/user" to="/user/dashboard" />
                </Switch>
              </Suspense>
              
            </Container>
          </div>
        </div>
    );
  }
}

export default UserLayout;
