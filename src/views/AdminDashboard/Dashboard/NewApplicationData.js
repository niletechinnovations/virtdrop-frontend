import React, { Component } from 'react';
//import {Link} from 'react-router-dom';

class NewApplicationData extends Component{
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
                userName: userData.firstName+' '+userData.lastName,
                email: userData.email,
                mobileNumber: userData.mobileNumber,
                skypeID: userData.skypeID || " ",
                status: ( userData.statusText !==''  ? userData.statusText : "Pending"),
                createdDate: (new Date(userData.createdAt)).toLocaleDateString("en-US"),
              }
              rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map(user =>{
            return (
                <tr key={user.SNo}>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.mobileNumber}</td>
                    <td>{user.skypeID}</td>
                    <td>{user.status}</td>
                    <td>{user.createdDate}</td>
                </tr>
            );
        });

        return (
            <>
           
            <div className="table-responsive card-table">
                <table>
                    <thead>
                        <tr>
                            <th>User</th>
                            <th>Email</th>
                            <th>Mobile no.</th>
                            <th>Skype ID</th>
                            <th>Status</th>
                            <th>Application Date</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </div>
            </>
        );

    }
}

export default NewApplicationData;