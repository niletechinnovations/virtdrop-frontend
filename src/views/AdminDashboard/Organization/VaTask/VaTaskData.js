import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
//import {Link} from "react-router-dom";

class VaTaskData extends Component {
  
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
  /* Edit Info */
  editStoreItem(rowIndex){    
    this.props.editItemAction(rowIndex);
  }

  deleteStoreItem(rowIndex){    
    this.props.deleteItemAction(rowIndex);
  }

  render() {
    let count=0;
    let rowsItem = [];
    for(const [i, Store] of this.props.data.entries()){
      let orgInfo = {   
        projectId: Store.projectId,
        title: Store.title,
        description: Store.description,
        completionTime: Store.completionTime || " ",
        createdAt: (new Date(Store.createdAt)).toLocaleDateString("en-US"),
        status: Store.status ? 'Active' : 'Inactive',   
      }      
      rowsItem.push(orgInfo);
      count = count+i;
    }      
    
    const columns = [ 
      {
        label: 'Project',
        name: 'projectId',
      },     
      {
        label: 'Title',
        name: 'title',
      },
      {
        label: 'Description',
        name: 'description',
      },
      {
        label: 'Completion Time',
        name: 'completionTime',
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
              <div className="actionBtnGroup" style={{width:'110px'}}>
                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editStoreItem(i)}><i className="fa fa-pencil"></i> </button>
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
      downloadOptions: {filename: 'va-task-list.csv', separator: ','},
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
        title={"Task list"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default VaTaskData;