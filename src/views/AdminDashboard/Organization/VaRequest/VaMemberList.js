import React, { Component } from 'react';
//import {Link} from 'react-router-dom';

class VAMemberList extends Component{
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
                skillSet: userData.skillSet,
              }
              rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map(user =>{
            return (
                <tr key={user.SNo}>
                    <td><input type="checkbox" /></td>
                    <td>{user.SNo+1}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.skillSet}</td>
                </tr>
            );
        });

        return (
            <>
           
            <div className="table-responsive card-table">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" /></th>
                            <th>S&nbsp;no.</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Skills</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </div>
            </>
        );

    }
}

export default VAMemberList;