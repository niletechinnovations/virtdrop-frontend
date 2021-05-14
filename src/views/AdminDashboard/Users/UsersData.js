import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";

class UsersData extends Component {
  
  constructor(props){
    super(props);   
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: [],
    };
    
  }
  componentDidMount() {   
  }
  
  editUserRow(rowIndex){    
    this.props.editUserAction(rowIndex);
  }
  deleteUserRow(rowIndex){    
    this.props.deleteUserAction(rowIndex);
  }
  
  render() {
   
    let rowsItem = [];
    let count = 0;
    for(const [i, userData] of this.props.data.entries()){
      count = count+i;
      let userInfo = {
        firstName: userData.firstName +' '+ userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || " ",
        address: userData.address || " ",
        role: (userData.role ==='admin' ? "Super Admin" : userData.role.charAt(0).toUpperCase() + userData.role.substring(1) ),
        createdAt: (new Date(userData.createdAt)).toLocaleDateString("en-US"),
        status: userData.status ? "Active" : "Inactive",   
      }      
      rowsItem.push(userInfo);
    }      
    const columns = [      
      {
        label: 'User',
        name: 'firstName',
      },
      {
        label: 'Email ID',
        name: 'email',
      },
      {
        label: 'Phone no.',
        name: 'phoneNumber',
      },
      {
        label: 'Role',
        name: 'role',
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        label: 'Registered on',
        name: 'createdAt',
      },
      {
        label: 'Action',
        name: 'action',
        options: {
          filter: false,
          sort: false,
          download: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let i = tableMeta.rowIndex;
            return (
              <div><button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editUserRow(i)}><i className="fa fa-pencil"></i> </button>
                <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteUserRow(i) };}} ><i className="fa fa-trash"></i></a></div>
            );
          }
        }
      },
    ];
    const options = {
      search: true,
      filter: false,
      searchOpen: false,
      print: false,
      download: true,
      downloadOptions: {filename: 'virdrop-users-list.csv', separator: ','},
      responsive: 'stacked',
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.props.dataTableLoadingStatus ? "Loading........" : "",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        },
      },
      fixedHeaderOptions: { xAxis: false, yAxis: false }

    };
    
    
    return (
      <MUIDataTable
        title={"Users List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default UsersData;