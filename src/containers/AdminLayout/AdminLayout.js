import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import * as router from 'react-router-dom';
import { Container } from 'reactstrap';
import './App.scss';

import {
  AppAside,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppBreadcrumb2 as AppBreadcrumb,
  AppSidebarNav2 as AppSidebarNav,
} from '@coreui/react';
// sidebar nav config

import adminNavigation from './_adminNav';
import recruitmentAdminNavigation from './_recruitmentAdminNav';
import recruitmentTeamNavigation from './_recruitmentTeamNav';
import marketingTeamNavigation from './_marketingTeamNav';
import accountingAdminNavigation from './_accountingAdminNav';
import teamLeadNavigation from './_teamLeadNav';

// routes config
import adminRoutes from '../../routes/adminRoutes';
import './AdminLayout.css';
//import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';

class AdminLayout extends Component {

loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  signOut(e) {
    e.preventDefault();
    localStorage.clear();
    this.props.history.push('/login')
  }

  render() {
    return (
      <div className="app dashboard-template">
        <AppHeader fixed>
          <Suspense  fallback={this.loading()}>
            <DefaultHeader onLogout={e=>this.signOut(e)}/>
          </Suspense>
        </AppHeader>
        <div className="app-body admin-panel">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            <Suspense>
            { (localStorage.getItem( 'role' ).toLowerCase() === "admin" ) && 
            <AppSidebarNav navConfig={adminNavigation} {...this.props} router={router}/>
            }
            { (localStorage.getItem( 'role' )=== "recruitmentAdmin" ) && 
              <AppSidebarNav navConfig={recruitmentAdminNavigation} {...this.props} router={router}/>  
            }
            { (localStorage.getItem( 'role' ) === "recruitmentTeam" ) && 
              <AppSidebarNav navConfig={recruitmentTeamNavigation} {...this.props} router={router}/>  
            }
            { (localStorage.getItem( 'role' ) === "marketingTeam" ) && 
              <AppSidebarNav navConfig={marketingTeamNavigation} {...this.props} router={router}/>  
            }
            { (localStorage.getItem( 'role' )=== "accountingAdmin" ) && 
              <AppSidebarNav navConfig={accountingAdminNavigation} {...this.props} router={router}/>  
            }
            { (localStorage.getItem( 'role' )=== "teamLead" ) && 
              <AppSidebarNav navConfig={teamLeadNavigation} {...this.props} router={router}/>  
            }
            </Suspense>
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={adminRoutes} router={router}/>
            <Container fluid>
              <ToastContainer />
              <Suspense fallback={this.loading()}>
                <Switch>
                  {adminRoutes.map((route, idx) => {
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
                  <Redirect from="/admin" to="/admin/dashboard" />
                </Switch>
              </Suspense>
            </Container>
          </main>
          <AppAside fixed>
            <Suspense fallback={this.loading()}>
              {/* <DefaultAside /> */}
            </Suspense>
          </AppAside>
        </div>
        <AppFooter>
          <Suspense fallback={this.loading()}>
            <DefaultFooter />
          </Suspense>
        </AppFooter>
      </div>
    );
  }
}

export default AdminLayout;
