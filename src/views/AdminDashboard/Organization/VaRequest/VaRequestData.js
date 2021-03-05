import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";

class VaRequestData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: [],
      dataItem: []
    };

  }
  componentDidMount() {
  }
  /* Edit Store Info */
  editStoreItem(rowIndex) {
    this.props.editItemAction(rowIndex);
  }

  deleteStoreItem(rowIndex) {
    this.props.deleteItemAction(rowIndex);
  }

  render() {
    let count = 0;
    // let dataItem= [];
    let rowsItem = [];
    for (const [i, Store] of this.props.data.entries()) {
      let orgInfo = {
        organizationName: Store.organizationName,
        vaType: (Store.vaType === 1 ? 'Business Support' : 'Personal Assistance'),
        vaRequestId: Store.vaRequestId,
        natureOfBusiness: Store.natureOfBusiness,
        engagementType: (Store.engagementType === 1 ? 'Project-Based' : 'Ongoing Task'),
        numberOfVA: Store.numberOfVA || " ",
        createdAt: (new Date(Store.createdAt)).toLocaleDateString("en-US"),
        status: Store.status ? 'Active' : 'Inactive',
      }
      rowsItem.push(orgInfo)
      count = count + i;
    }

    const columns = [
      {
        label: 'Organization',
        name: 'organizationName',
      },
      {
        label: 'Type of VA',
        name: 'vaType',
      },
      {
        label: 'Nature of Business',
        name: 'natureOfBusiness',
      },
      {
        label: 'Type of Engagement',
        name: 'engagementType',
      },
      {
        label: 'No. of VA',
        name: 'numberOfVA',
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
              <div className="actionBtnGroup" style={{ width: '110px' }}>
                <Link className="btn btn-info btn-edit" to={`/admin/va-request/assign-va/${rowsItem[i].vaRequestId}`}><i className="fa fa-user-plus"></i> </Link>
                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() =>
                  this.editStoreItem(i)}><i className="fa fa-pencil"></i> </button>
                <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { this.deleteStoreItem(i) }; }} ><i className="fa fa-trash"></i></button></div>
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
      downloadOptions: { filename: 'va-request-list.csv', separator: ',' },
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
        title={"Request Lists"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default VaRequestData;