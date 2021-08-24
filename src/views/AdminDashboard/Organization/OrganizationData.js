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
      let orgInfo = {
        rowId: i,
        organizationName: orgnization.organizationName,
        organizationId: orgnization.organizationId,
        authId: orgnization.authId,
        firstName: orgnization.firstName +' '+ orgnization.lastName,
        email: orgnization.email,
        phoneNumber: orgnization.phoneNumber || " ",
        address: orgnization.address || " ",
        ccNumber: orgnization.ccNumber || " ",
        createdAt: (new Date(orgnization.createdAt)).toLocaleDateString("en-US"),
        status: orgnization.status ? "Active" : "Inactive",   
      }      
      rowsItem.push(orgInfo);
    }  
     
    
    const columns = [      
      {
        label: 'Client Name',
        name: 'firstName',
      },
      {
        label: 'Organization',
        name: 'organizationName',
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
        label: 'Card no.',
        name: 'ccNumber',
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
              <p>
            
               {/* {rowsItem[i].authId === "" ? (<Link className="btn btn-info btn-edit" to={`/admin/organization/assign-va-from-clientpanel`}><i className="fa fa-user-plus"></i> </Link>) :
               (<Link className="btn btn-info btn-edit" to={`/admin/organization/assign-va-from-clientpanel/${rowsItem[i].authId}`}><i className="fa fa-user-plus"></i> </Link>) } */}

                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editOrganizationItem(i)}><i className="fa fa-pencil"></i> </button>
                {( (localStorage.getItem( 'role' )!== "accountingAdmin" && localStorage.getItem( 'role' )!== "teamLead" ) ?
                <Link className="btn-view" to={`/admin/organization/card-info/${rowsItem[i].authId}`} title="Manage Card"><i className="fa fa-credit-card"></i> </Link>
                : '') }
                {( (localStorage.getItem( 'role' )!== "accountingAdmin" && localStorage.getItem( 'role' )!== "teamLead" ) ?
                <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteOrganizationItem(i) };}} ><i className="fa fa-trash"></i></a>
                : '') }
                </p>
                
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
      downloadOptions: {filename: 'va-client-list.csv', separator: ','},
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
        title={"Clients"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default OrganizationData;