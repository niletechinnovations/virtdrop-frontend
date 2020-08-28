import React from 'react';
import {Link} from 'react-router-dom';
import logo from './../../assets/images/logo.png';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';

import commonService from '../../core/services/commonService';
//import UserAvtar from '../UserLayout/UserAvtar'

class UserPanelHeader extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        collapseID: false,
        isLoggedOut: false,
        toggleActive: false,
        dropdownOpen: false,
        setDropdownOpen: false
      }
      this.onToggle = this.onToggle.bind(this);
      this.toggleUserMenu = this.toggleUserMenu.bind(this);
  
    }
    onToggle() {
      this.setState({ toggleActive: !this.state.toggleActive });
    }
    
  
  logoutUser() {
    localStorage.clear();
    this.setState({isLoggedOut:true});
  };

  toggleUserMenu = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  }
  

  render(){
   
    let  headerItem = '';
    if(commonService.getAuth()) {
      headerItem = <>
      <Dropdown nav isOpen={this.state.dropdownOpen} toggle={this.toggleUserMenu} className="user-menu">
        <DropdownToggle nav caret>
            {/* 
            <div className="user-name"><span><UserAvtar /></span>Hi, {localStorage.getItem( 'userName' )}!</div>
            */}
            <img src="/images/profile.png" alt="user" className="profile-pic" /> &nbsp;
            <b>{localStorage.getItem( 'userName' )}</b>
        </DropdownToggle>
        <DropdownMenu>
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() === "admin" ) && 
          <DropdownItem><Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "admin") ? `/admin/dashboard` : `/user/dashboard` } ><i className="fa fa-dashboard"></i> Dashboard</Link></DropdownItem>
          }
          { localStorage.getItem( 'role' ).toLowerCase() === "va_member" && 
            <DropdownItem><Link to={ `/user/va-dashboard` } ><i className="fa fa-dashboard"></i> Dashboard</Link></DropdownItem>
          }
          { localStorage.getItem( 'role' ).toLowerCase() === "va_member" && 
            <DropdownItem><Link to={ `/user/va-task` } ><i className="fa fa-tasks"></i> Manage Task</Link></DropdownItem>
          }
          { localStorage.getItem( 'role' ).toLowerCase() === "organization" && 
            <DropdownItem><Link to={ `/user/manage-request` } ><i className="fa fa-list-ul"></i> Manage Request</Link></DropdownItem>
          }
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() !== "admin" ) && 
            <DropdownItem><Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "organization") ? `/user/my-profile` : `/user/va-profile` } ><i className="fa fa-user"></i> Manage Profile</Link></DropdownItem>
          }
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() !== "admin" ) && 
            <DropdownItem><Link to="/user/change-password"><i className="fa fa-key"></i> Change Password</Link></DropdownItem>
          }
          <DropdownItem><Link to= "/" onClick={() => this.logoutUser()}><i className="fa fa-sign-out"></i> Log Out</Link></DropdownItem>
        </DropdownMenu>
      </Dropdown>
      
      </>
      }
      else {
      headerItem = <>
        <NavItem>
          <Link to="/login">Login/Register</Link>
        </NavItem>
        <NavItem>
          <Link className="Sell-btn" to="/register">Hire an Assistant <i className="fa fa-angle-right"></i></Link>
        </NavItem>
      </>
    }

    

    return (
      
      <header className="header">
        <div className="container-fluid">
          <div className="">
            <div className="header-navigation">
              <Navbar expand="lg" className="static-top">
                <Link to="/" className="navbar-brand"><img src={logo} height="40" alt="Logo" /></Link>
                <NavbarToggler onClick={this.onToggle} data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" />
                <Collapse isOpen={this.state.toggleActive} navbar className="justify-content-end" id="navbarSupportedContent">
                  <Nav className="navbar-nav mr-auto" navbar>
                    <NavItem>
                        <form className="search-input">
                          <div className="input-group">
                            <i className="fa fa-search"></i>
                            <input type="text" className="form-control" placeholder="Search..." />
                          </div>
                        </form>
                    </NavItem>
                  </Nav>  

                  <Nav className="navbar-nav" navbar>
                    {headerItem}
                  </Nav>
                </Collapse>
              </Navbar>
            </div>
          </div>  
        </div>
      </header>  
    )
  };
}

export default UserPanelHeader;