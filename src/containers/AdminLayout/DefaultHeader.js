import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav } from 'reactstrap';
import PropTypes from 'prop-types';

import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import logo from './../../assets/images/logo.png';
import sygnet from './../../assets/images/logo-icon.png';
import UserAvtar from '../UserLayout/UserAvtar'


const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultHeader extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <AppSidebarToggler className="d-lg-none" display="md" mobile />
        <AppNavbarBrand
          full={{ src: logo, width: 88, height: 40, alt: 'TexQue Logo' }}
          minimized={{ src: sygnet, width: 30, height: 30, alt: 'TexQue Logo' }}
        />
        <AppSidebarToggler className="d-md-down-none" display="lg" />

        
        <Nav className="ml-auto" navbar>
          <UncontrolledDropdown nav direction="down">
            <DropdownToggle nav>
              <div className="admin-avatar"><UserAvtar /></div>
              <span className="admin-profile-username">
                {localStorage.getItem( 'userName' )} <span className="caret"></span>
              </span>
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem header tag="div" className="text-center"><strong>My Account</strong></DropdownItem>
              <DropdownItem><Link to="/admin/dashboard" className="profileDropDownLink"><i className="fa fa-dashboard"></i> Dashboard</Link></DropdownItem>
              <DropdownItem><Link to="/admin/change-password" className="profileDropDownLink"><i className="fa fa-lock"></i> Change Password</Link></DropdownItem>
              <DropdownItem onClick={e => this.props.onLogout(e)}><i className="fa fa-sign-out"></i> Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Nav>
        
      </React.Fragment>
    );
  }
}

DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
