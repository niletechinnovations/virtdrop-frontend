import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import {Link} from "react-router-dom";

class VaApplicationData extends Component {
  
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

  deleteItem(rowIndex){    
    this.props.deleteItemAction(rowIndex);
  }

  render() {
    let count=0;
    let rowsItem = [];
    for(const [i, item] of this.props.data.entries()){
      console.log("Skilll",item.skillSet1)
      let itemInfo = {   
        vaApplicationId: item.vaApplicationId,
        userName: item.firstName+' '+item.lastName,      
        email: item.email,
        mobileNumber: item.mobileNumber || " ",
        skillSet1: item.skillSet1.map(e=>e.profileName) + (item.rateSkill1 !=='' ? " ("+item.rateSkill1+")" :''  ) || " ",
        skillSet2: item.skillSet2.map(e=>e.profileName) + (item.rateSkill2 !=='' ? " ("+item.rateSkill2+")" :''  ) || " ",
        skillSet3: item.skillSet3.map(e=>e.profileName) + (item.rateSkill3 !=='' ? " ("+item.rateSkill3+")" :''  ) || " ",

        // skillSet1: Array.isArray(item.skillSet1)===true ? item.skillSet1.map(e=>e.profileName):'' + (item.rateSkill1 !=='' ? " ("+item.rateSkill1+")" :''  ) || " ",
        // skillSet2: Array.isArray(item.skillSet2)===true ? item.skillSet2.map(e=>e.profileName):'' + (item.rateSkill2 !=='' ? " ("+item.rateSkill2+")" :''  ) || " ",
        // skillSet3: Array.isArray(item.skillSet3)===true ?item.skillSet3.map(e=>e.profileName) :'' + (item.rateSkill3 !=='' ? " ("+item.rateSkill3+")" :''  ) || " ",

        createdAt: (new Date(item.createdAt)).toLocaleDateString("en-US"),
        status: ( item.statusText !==''  ? item.statusText : "Pending")
      }      
      rowsItem.push(itemInfo);
      count = count+i;
    }      
    
    const columns = [ 
      { label: 'Name', name: 'userName'},     
      { label: 'Email', name: 'email' },
      //{ label: 'Mobile no.', name: 'mobileNumber'},
      { label: 'Skill Set 1 (Rating)', name: 'skillSet1'},
      { label: 'Skill Set 2 (Rating)', name: 'skillSet2'},
      { label: 'Skill Set 3 (Rating)', name: 'skillSet3'},
      { label: 'Status', name: 'status'},
      { label: 'Created on', name: 'createdAt'},
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
              <div className="actionBtnGroup"><Link className="btn-edit" disabled={this.state.buttonProcessing} to={`/admin/va-application/${rowsItem[i].vaApplicationId}`}><i className="fa fa-pencil"></i> </Link>
              <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => {if(window.confirm('Are you sure you want to delete this record?')){ this.deleteItem(i) };}} ><i className="fa fa-trash"></i></button></div>
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
      downloadOptions: {filename: 'va-application-list.csv', separator: ','},
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
        title={"VA Application List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default VaApplicationData;