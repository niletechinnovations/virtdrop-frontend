import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
//import {Link} from "react-router-dom";

class VaTimesheetData extends Component {

  constructor(props) {
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
  editDataItem(rowIndex) {
    this.props.editItemAction(rowIndex);
  }

  deleteDataItem(rowIndex) {
    this.props.deleteItemAction(rowIndex);
  }

  // i.classList.toggle("fa-thumbs-down");
  changeStatus(rowIndex) {
    this.props.approvedItemAction(rowIndex);
    this.setState({isActive: false});

  }

  render() {
    let count = 0;
    let rowsItem = [];
    for (const [i, Store] of this.props.data.entries()) {

      let orgInfo = {
        projectId: Store.projectId,
        title: Store.taskName,
        duration: `${Store.TotalWorkingTime === "00:00:00" ? Store.duration : Store.TotalWorkingTime}`,
        // duration: Store.duration,
        billingHours: Store.billingHours || 0,
        clientName: Store.clientName || " ",
        vaName: Store.vaName || " ",
        createdAt: (new Date(Store.createdAt)).toLocaleDateString("en-US"),
        // status: (Store.status===2 ? 'Completed' : 'Active'),  
        status: (Store.status === 0 ? 'Unapproved' : 'Approved'),
      }
      rowsItem.push(orgInfo);
      // console.log("RrowsItem",rowsItem)
      count = count + i;
    }

    const columns = [
      { label: 'Task name', name: 'title'},
      { label: 'Client', name: 'clientName' },
      { label: 'VA name', name: 'vaName' },
      {
        label: 'Total working hours',
        name: 'duration',
      },
      {
        label: 'Billing hours',
        name: 'billingHours',
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        label: 'Created on',
        name: 'createdAt',
      },
      
      // const {isActive}= this.status
      {
        label: 'Action',
        name: 'action',
        options: {
          filter: false,
          sort: false,
          download: false,
          customBodyRender: (value, tableMeta, orgInfo, updateValue) => {
            let i = tableMeta.rowIndex;
            // console.log("1>>>",tableMeta.rowData[5])
            return (
              <div className="actionBtnGroup" style={{ width: '110px' }}>
                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() =>
                  this.editDataItem(i)}><i className="fa fa-pencil"></i> </button>

                <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { this.deleteDataItem(i) } }} ><i className="fa fa-trash"></i></button>
            
              { tableMeta.rowData[5] === "Unapproved" ?
                <button className="btn-approved" disabled={this.state.buttonProcessing} onClick={() =>
                  this.changeStatus(i)}><i className="fa fa-check"> </i>
                  </button> : ""
                  }

              </div>
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
      downloadOptions: { filename: 'va-task-list.csv', separator: ',' },
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
        title={"VA Timesheet List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default VaTimesheetData;