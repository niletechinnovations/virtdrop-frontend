import React, { Component, Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

// routes config
import commonRoutes from '../../routes/commonRoutes';
import FrontEndFooter from '../FrontEndLayout/FrontEndFooter';
// import FrontEndHeader from '../FrontEndLayout/FrontEndHeader';
import CommonFrontEndHeader from './CommonFrontEndHeader';
import './CommonLayout.css';

class CommonLayout extends Component {

  loading = () => <div className="animated fadeIn pt-1 text-center">Loyading...</div>

   render() {
    return (
      <div className="app">
        <div className="flyout">   
       <CommonFrontEndHeader />        
            <main>                
              <Suspense fallback={this.loading()}>
                <Switch>
                  {commonRoutes.map((route, idx) => {
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
                  <Redirect from="/common" to="/" />
                </Switch>
              </Suspense>
            </main>     
            <FrontEndFooter />       
        </div>
      </div>
    );
  }
}

export default CommonLayout;
