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
        console.log(this.props.data);
        let rowsItem = []; 
        for(const [i, userData] of this.props.data.entries()){
            let userInfo = {
                SNo:i,
                profileId:userData.profileId,
                userName: userData.firstName+' '+userData.lastName,  
                userEmail: userData.email,
                phoneNumber: userData.phoneNumber || " ",
                address: userData.address || " ",
                status: userData.status ? "Active" : "Inactive",   
                createdAt: (new Date(userData.createdAt)).toLocaleDateString("en-US"),
              }      
              rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map(user =>{
            return (
                <tr key={user.SNo}>
                    <td className="text-center">
                        <div className="avatar">
                            {/* <img src="/images/avtar3.jpg" className="img-avatar" alt={user.userName} /> */}
                            <div className="profileImage userImg">{user.userName.substring(0, 1)}</div>
                        </div>
                    </td>
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
            <h5>
                Recent Registered Users
                <Link to="/admin/users" className="btn btn-primary view-all-btn" title="View All Users">View All</Link>
            </h5>
            <div className="table-responsive">
                <table className="table-outline mb-0 d-none d-sm-table table table-hover">
                    <thead className="thead-light">
                        <tr>
                            <th className="text-center"><i className="icon-people"></i></th>
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