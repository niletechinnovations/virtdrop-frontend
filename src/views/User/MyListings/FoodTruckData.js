import React, { Component } from 'react';
import { Button } from 'reactstrap';
import {Link} from 'react-router-dom';
import MUIDataTable from "mui-datatables";

class FoodTruckData extends Component {
  
  constructor(props){
    super(props);   
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: []
    };
    
  }
  componentDidMount() {   
  }
  

  render() {
    
    let rowsItem = []; 
   
    for(const [i, orgnization] of this.props.data.entries()){
      let orgInfo = {
        organizationName: orgnization.organizationName,  
        contactPerson: orgnization.contactPerson,
        truckName: orgnization.truckName,
        phoneNumber: orgnization.phoneNumber || " ",
        address: orgnization.address || " ",
        rating: orgnization.rating,
        status: orgnization.status ? "Active" : "Inactive",   
        createdAt: (new Date(orgnization.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        foodTruckId: orgnization.foodTruckId,
        action: orgnization
       /* action: <p><button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
          this.editStoreItem(i)}><i className="fa fa-pencil"></i> </button>
          <button href className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => 
          this.deleteStoreItem(i)}><i className="fa fa-trash"></i></button></p>,      */ 
      }      
      rowsItem.push(orgInfo);
    }      
    
   


    const columns = [ 
      {
        label: 'Listing',
        name: 'truckName',
      }, 
      {
        label: 'Location',
        name: 'address',
      },
      {
        label: 'Rating',
        name: 'rating',
      },
      {
        label: 'Date',
        name: 'createdAt',
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        name: "action",
        label: "Action",
        options: {
          filter: false,
          sort: false,
          empty: true,
          customBodyRender: (value, tableMeta, updateValue) => {
            
            return (  <>
              <Link to={`/user/my-listings/${value.foodTruckId}`} className="btn btn-info btn-sm" title="Edit Food Truck Info"><i className="fa fa-pencil"></i></Link>
             &nbsp;
              <Button color="danger" size="sm" disabled={this.state.buttonProcessing} onClick={() => {
            if (window.confirm('Are you sure you wish to delete this food truck?')) this.props.deleteFoodTruckAction(tableMeta.rowIndex) }} title="Delete Food Truck"><i className="fa fa-trash"></i></Button>&nbsp;
              
              </>     
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
      download: false,
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
        title={"Food Truck list"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default FoodTruckData;