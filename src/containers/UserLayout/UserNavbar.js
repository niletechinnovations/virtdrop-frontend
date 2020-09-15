import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { Navbar, Collapse, Nav, NavItem} from 'reactstrap';

import './UserNavbar.css';


class UserNavbar extends Component {

  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: true,
      activeTab: '1',
      isLoggedOut: false,
    };
  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        isOpen: true,
        activeTab: tab,
      });
    }
  }
  logoutUser() {
    localStorage.clear();
      this.setState({isLoggedOut:true});
  };

  render() {

    return (
      <div className="user-navbar">
        <Navbar className="" expand="md">
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar className="user-widget-list">
          {/* { localStorage.getItem( 'isOrganization' ) === "true" && <> */}
            <NavItem>
              <Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "organization" ? "/user/dashboard" : "/user/va-dashboard" )} className="nav-link">
                <span className="icon-orders"><img src="/images/dashboard.svg" height="24" alt="Dashboard" /></span>
                <span className="value-orders">Dashboard</span>
              </Link>
            </NavItem>
            { (localStorage.getItem( 'role' ).toLowerCase() === "organization") && 
            <NavItem>
              <Link to="/user/virdrop-va" className="nav-link">
                <span className="icon-orders"><img src="/images/user.svg" height="24" alt="My Listing" /></span>
                <span className="value-orders">Your Virtdrop VA</span>
              </Link>
            </NavItem>
            }
            { (localStorage.getItem( 'role' ).toLowerCase() === "organization") && 
            <NavItem>
              <Link to="/user/manage-request" className="nav-link">
                <span className="icon-orders"><img src="/images/timezone.svg" height="24" alt="Inquiries" /></span>
                <span className="value-orders">Manage Request</span>
              </Link>
            </NavItem>
            }
            <NavItem>
              <Link to={ (localStorage.getItem( 'role' ).toLowerCase() === "organization" ? "/user/task" : "/user/va-task" )} className="nav-link">
                <span className="icon-orders"><img src="/images/task.svg" height="24" alt="Task Management" /></span>
                <span className="value-orders">Task Management</span>
              </Link>
            </NavItem>
            { (localStorage.getItem( 'role' ).toLowerCase() === "va_member") &&  
            <NavItem>
              <Link to="/user/va-timesheet" className="nav-link">
                <span className="icon-orders"><img src="/images/timezone.svg" height="24" alt="Inquiries" /></span>
                <span className="value-orders">Manage Timesheet</span>
              </Link>
            </NavItem>
            }
                  
            { (localStorage.getItem( 'role' ).toLowerCase() === "organization") && 
            <NavItem>
              <Link to={ "/user/billing" } className="nav-link">
                <span className="icon-orders"><img src="/images/billing.svg" height="24" alt="Billing" /></span>
                <span className="value-orders">Billing</span>
              </Link>
            </NavItem>
            }
            
          { localStorage.getItem( 'isOrganization' )=== "true" && <>  
            <NavItem>
              <Link to="/user/my-profile" className="nav-link">
                <span className="icon-orders"><img src="/images/account.svg" height="24" alt="Account Settings" /></span>
                <span className="value-orders">Account Settings</span>
              </Link>
            </NavItem>
          </>
          } 
          
          {  localStorage.getItem( 'isOrganization' )=== "false" && <>  
            <NavItem>
              <Link to="/user/va-profile" className="nav-link">
                <span className="icon-orders"><img src="/images/account.svg" height="24" alt="Account Settings" /></span>
                <span className="value-orders">Account Settings</span>
              </Link>
            </NavItem>
            </>
            }

          </Nav>
          </Collapse>
        </Navbar>
    </div>
    );
  }
}

export default UserNavbar;
