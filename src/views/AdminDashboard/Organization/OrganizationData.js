import React, { Component } from 'react';
import  { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

class OrganizationData extends Component {
  
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
  
  editOrganizationItem(rowIndex){    
    this.props.editOrganizationAction(rowIndex);
  }
  deleteOrganizationItem(rowIndex){    
    this.props.deleteOrganizationAction(rowIndex);
  }
  
  render() {
   
    let rowsItem = [];    
    for(const [i, orgnization] of this.props.data.entries()){
      console.log(i);
      let orgInfo = {
        organizationName: orgnization.organizationName,  
        authId: orgnization.authId,
        firstName: orgnization.firstName +' '+ orgnization.lastName,
        email: orgnization.email,
        phoneNumber: orgnization.phoneNumber || " ",
        address: orgnization.address || " ",
        createdAt: (new Date(orgnization.createdAt)).toLocaleDateString("en-US"),
        status: orgnization.status ? "Active" : "Inactive",   
      }      
      rowsItem.push(orgInfo);
    }      
    const columns = [      
      {
        label: 'Organization',
        name: 'organizationName',
      },
      {
        label: 'Owner',
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
        label: 'Address',
        name: 'address',
      },
      {
        label: 'Registered on',
        name: 'createdAt',
      },
      {
        label: 'Status',
        name: 'status',
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
              <p><button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editOrganizationItem(i)}><i className="fa fa-pencil"></i> </button>
                <Link className="btn-view" to={`/admin/organization/truck-listing/${rowsItem[i].authId}`}><i className="fa fa-truck"></i> </Link>
                <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteOrganizationItem(i) };}} ><i className="fa fa-trash"></i></a></p>
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
      downloadOptions: {filename: 'texque-food-truck-owner-list.csv', separator: ','},
      responsive: 'stacked',
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.props.dataTableLoadingStatus ? "Processing........" : "Sorry, no matching records found",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        },
      },
      fixedHeaderOptions: { xAxis: false, yAxis: false }

    };
    
    
    return (
      <MUIDataTable
        title={"Truck Owner Lists"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default OrganizationData;