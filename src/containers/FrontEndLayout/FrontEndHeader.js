import React from 'react';
import {Link} from 'react-router-dom';
// import logo from './../../assets/images/logo.png';
import logo from './../../assets/images/virtlogo-2.png';
import { Collapse, Navbar, NavbarToggler, Nav, NavItem, Dropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap';
 
import commonService from '../../core/services/commonService';

import './FrontEndHeader.css';
import UserAvtar from '../UserLayout/UserAvtar'

class FrontEndHeader extends React.Component {
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
          <div className="user-name"><span><UserAvtar /></span>Hi, {localStorage.getItem( 'userName' )}!</div>
        </DropdownToggle>
        <DropdownMenu>
          { (localStorage.getItem( 'role' ).toLowerCase() === "admin" || localStorage.getItem( 'role' ) === "recruitmentAdmin" || localStorage.getItem( 'role' ) === "recruitmentTeam" || localStorage.getItem( 'role' ) === "marketingTeam" || localStorage.getItem( 'role' ) === "accountingAdmin" || localStorage.getItem( 'role' ) === "teamLead"  ) && 
            <DropdownItem><Link to={ `/admin/dashboard` } ><i className="fa fa-dashboard"></i> Dashboard</Link></DropdownItem>
          }
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() === "va_member" ) && 
          <DropdownItem><Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "va_member") ? `/user/va-dashboard` : `/user/dashboard` } ><i className="fa fa-dashboard"></i> Dashboard</Link></DropdownItem>
          }
          { localStorage.getItem( 'role' ).toLowerCase() === "va_member" && 
            <DropdownItem><Link to={ `/user/va-task` } ><i className="fa fa-tasks"></i> Manage Task</Link></DropdownItem>
          }
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() === "va_member" ) && 
            <DropdownItem><Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "organization") ? `/user/my-profile` : `/user/va-profile` } ><i className="fa fa-user"></i> My Profile</Link></DropdownItem>
          }
          { localStorage.getItem( 'role' ).toLowerCase() === "organization"  && 
            <DropdownItem><Link to="/user/manage-request"><i className="fa fa-list-ul"></i> Manage Request</Link></DropdownItem>
          }
          { (localStorage.getItem( 'role' ).toLowerCase() === "organization" || localStorage.getItem( 'role' ).toLowerCase() === "va_member" ) && 
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
        <NavItem className="pr-0">
          {/* <a href="http://landing.virtdrop.com/" className="apply-btn">Apply as VA</a> */}
          <Link className="apply-btn" to="/be-a-virdrop-va">Apply as VA</Link>
        </NavItem>
        <NavItem>
          <Link className="Sell-btn" to="/booking">Hire an Assistant <i className="fa fa-angle-right"></i></Link>
        </NavItem>
      </>
    }

    return (
      
      <header className="header">
        <div className="top-header">
          <div className="container">
            <div className="row">
              <div className="col-md-3">
                <div className="header-contact-card">
                  <div className="header-contact-icon">
                    <img src="/images/mail.svg" alt="" />
                  </div>
                  <div className="header-contact-content">
                    <p>Email Address</p>
                    <h2><a href="mailto:support@virtdrop.com">support@virtdrop.com</a></h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="header-contact-card">
                  <div className="header-contact-icon">
                    <img src="/images/phone.svg" alt="phone" />
                  </div>
                  <div className="header-contact-content">
                    <p>Phone Number</p>
                    <h2><a href="tel:212-518-3183">212-518-3183</a></h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="header-contact-card">
                  <div className="header-contact-icon">
                    <img src="/images/location.svg" alt="Location" />
                  </div>
                  <div className="header-contact-content">
                    <p>Office Address</p>
                    <h2>576 Fifth Avenue, New York</h2>
                  </div>
                </div>
              </div>

              <div className="col-md-3">
                <div className="header-social">
                  <ul>
                    <li><a href="https://www.facebook.com/virtdrop" target="_blank" rel="noopener noreferrer"><i className="fa fa-facebook"></i></a></li>
                    <li><a href="https://twitter.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-twitter"></i></a></li>
                    <li><a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-linkedin"></i></a></li>
                    <li><a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer"><i className="fa fa-instagram"></i></a></li>
                  </ul>
                </div>
              </div>
				    </div>
				
		    	</div>
        </div>
        <div className="bottom-header">
          <div className="container">
            <div className="header-navigation">
              <Navbar expand="lg">
                <div className="navbar-brand">
                  {/* <Link to="/"><img src={logo} height="60" alt="Logo" /></Link> */}
                  <a href= "https://www.virtdrop.com" ><img src={logo} height="40" alt="Logo" /></a>
                </div>
                <NavbarToggler onClick={this.onToggle} data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation" />
                <Collapse isOpen={this.state.toggleActive} navbar className="justify-content-end" id="navbarSupportedContent">
                  <Nav className="navbar-nav" navbar>
                    {/* <NavItem>
                      <Link to="/how-it-works">How it Works?</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/services">Services</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/pricing">Pricing</Link>
                    </NavItem>
                    <NavItem>
                      <Link to="/contact-us">Contact Us</Link>
                    </NavItem> */}

                    <NavItem>
                      <a href= "https://www.virtdrop.com">Home</a>
                    </NavItem>
                    <NavItem>
                      <a href= "https://www.virtdrop.com/how-it-works/">How it Works?</a>
                    </NavItem>
                    <NavItem>
                      <a href= "https://www.virtdrop.com/our-services/">Our Services</a>
                    </NavItem>
                    <NavItem>
                      <a href= "https://www.virtdrop.com/pricing/">Pricing</a>
                    </NavItem>
                    <NavItem>
                      <a href= "https://www.virtdrop.com/blog/">Blog</a>
                    </NavItem>
                    <NavItem>
                      <a href="https://www.virtdrop.com/faq/">FAQ</a>
                    </NavItem>
                    <NavItem>
                      <a href= "https://www.virtdrop.com/contact-us/">Contact Us</a>
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

export default FrontEndHeader;