import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import {Link} from "react-router-dom";

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
  /* Edit Store Info */
  editStoreItem(rowIndex){    
    this.props.editStoreAction(rowIndex);
  }

  deleteStoreItem(rowIndex){    
    this.props.deleteStoreAction(rowIndex);
  }

  render() {
    let count=0;
    let rowsItem = [];
    for(const [i, Store] of this.props.data.entries()){
      let orgInfo = {   
        organizationName: Store.organizationName,      
        truckName: Store.truckName,
        foodTruckId: Store.foodTruckId,
        featuredImage: Store.featuredImage,
        phoneNumber: Store.phoneNumber || " ",
        address: Store.address || " ",
        rating: Store.rating || " ",
        createdAt: (new Date(Store.createdAt)).toLocaleDateString("en-US"),
        status: Store.status ? 'Active' : 'Inactive',   
      }      
      rowsItem.push(orgInfo);
      count = count+i;
    }      
    
    const columns = [ 
      {
        label: 'Image',
        name: 'featuredImage',
        options: {
          filter: false,
          sort: false,
          download: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let j = tableMeta.rowIndex;
            return (
              rowsItem[j].featuredImage ? <img src={rowsItem[j].featuredImage} width="50" alt="Food Truck" className="img-thumbnail" /> : ''              
            );
          }
        }
      },     
      {
        label: 'Food Truck',
        name: 'truckName',
      },     
      {
        label: 'Organization',
        name: 'organizationName',
      },
      
      {
        label: 'Address',
        name: 'address',
      },
      {
        label: 'Phone no.',
        name: 'phoneNumber',
      },
      {
        label: 'Rating',
        name: 'rating',
        options: { display: false}
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        label: 'Created on',
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
              <div className="actionBtnGroup"><Link className="btn-edit" disabled={this.state.buttonProcessing} to={`/admin/organization/edit-truck/${rowsItem[i].foodTruckId}`}><i className="fa fa-pencil"></i> </Link>
              <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => {if(window.confirm('Are you sure you want to delete this record?')){ this.deleteStoreItem(i) };}} ><i className="fa fa-trash"></i></button></div>
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
      downloadOptions: {filename: 'texque-food-truck-list.csv', separator: ','},
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
        title={"Food Truck list"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default FoodTruckData;