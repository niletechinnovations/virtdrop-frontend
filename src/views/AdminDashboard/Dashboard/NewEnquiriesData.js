import React, { Component } from 'react';
import {Link} from 'react-router-dom';

class NewEnquiriesData extends Component{
    constructor(props){
        super(props);   
        this.state = {
          buttonProcessing: false,
          rowIndex: '',
          dataTableItem: []
        };
        
      }

    render(){
        let rowsItem = []; 
        for(const [i, userData] of this.props.data.entries()){
            let userInfo = {
                SNo:i,
                userName: userData.contactPerson,  
                truckName: userData.truckName,
                contactNo: userData.contactNo || " ",
                message: userData.message,
                status: userData.numberofPerson,   
                eventDate: userData.eventDate,
              }      
              rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map(user =>{
            return (
                <tr key={user.SNo}>
                    <td>{user.userName}</td>
                    <td>{user.truckName}</td>
                    <td>{user.contactNo}</td>
                    <td>{user.message}</td>
                    <td>{user.eventDate}</td>
                </tr>
            );
        });

        return (
            <>
            <h5>
                New Inquiries
                <Link to="/admin/enquiries" className="btn btn-primary view-all-btn" title="View All Inquiries">View All</Link>
            </h5>
            <div className="table-responsive">
                <table className="table-outline mb-0 d-none d-sm-table table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th>User</th>
                            <th>Truck Name</th>
                            <th>Phone Number</th>
                            <th>Message</th>
                            <th>Event Date</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </div>
            </>
        );

    }
}

export default NewEnquiriesData;