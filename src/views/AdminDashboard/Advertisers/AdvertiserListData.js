import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";

class AdvertiserListData extends Component {
  
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
    for(const [i, userData] of this.props.data.entries()){
      console.log(i);
      let userInfo = {
        userName: userData.firstName+' '+userData.lastName,
        email: userData.email,
        phoneNumber: userData.phoneNumber || " ",
        status: userData.status ? "Active" : "Inactive",
        createdAt: (new Date(userData.createdAt)).toLocaleDateString("en-US"),
      }      
      rowsItem.push(userInfo);
    }      
    const columns = [      
      {
        label: 'Advertiser Name',
        name: 'userName',
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
                this.editUserRow(i)} title="Edit Advertiser"><i className="fa fa-pencil"></i> </button>
                <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteUserRow(i) };}} title="Delete Advertiser"><i className="fa fa-trash"></i></a></div>
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
      downloadOptions: {filename: 'texque-advertiser-list.csv', separator: ','},
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
        title={"Advertiser List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default AdvertiserListData;
