import React, { Component } from 'react';
import  { Link } from 'react-router-dom';
//import { Button } from 'reactstrap';

class NewUserData extends Component{
    constructor(props){
        super(props);   
        this.state = {
          buttonProcessing: false,
          rowIndex: '',
          dataTableItem: []
        };
        
      }

    render(){
        // console.log(this.props.data);
        let rowsItem = []; 
        for(const [i, userData] of this.props.data.entries()){
            let userInfo = {
                SNo:i,
                profileId:userData.profileId,
                organizationName: userData.organizationName,
                userName: userData.firstName+' '+userData.lastName,  
                userEmail: userData.email,
                phoneNumber: userData.mobileNumber || " ",
                address: userData.address || " ",
                status: userData.status ? "Active" : "Inactive",   
                createdAt: (new Date(userData.createdAt)).toLocaleDateString("en-US"),
              }      
              rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map(user =>{
            return (
                <tr key={user.SNo}>
                    <td>{user.organizationName}</td>
                    <td>{user.userName}</td>
                    <td>{user.userEmail}</td>
                    <td>{user.phoneNumber}</td>
                    <td>{user.address}</td>
                    <td>{user.status}</td>
                    <td className="text-center">
                        <Link className="btn-edit" to={`/admin/user/${user.profileId}`} ><i className="fa fa-eye"></i> </Link>
                    </td>
                </tr>
            );
        });

        return (
            <>
            
            <div className="table-responsive card-table">
                <table>
                    <thead className="thead-light">
                        <tr>
                            <th>Organization</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Phone Number</th>
                            <th>Address</th>
                            <th>Status</th>
                            <th className="text-center">#</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </div>
            </>
        );

    }
}

export default NewUserData;