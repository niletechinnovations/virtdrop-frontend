import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
//import {Link} from "react-router-dom";

class BillingData extends Component {
  
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
  editDataItem(rowIndex){    
    this.props.editItemAction(rowIndex);
  }

  deleteDataItem(rowIndex){    
    this.props.deleteItemAction(rowIndex);
  }
  payInvoiceItem(rowIndex){    
    this.props.payInvoiceAction(rowIndex);
  }

  render() {
    let count=0;
    let rowsItem = [];
    for(const [i, Store] of this.props.data.entries()){
      let orgInfo = {   
        invoiceId: '#'+Store.invoiceNo,
        title: Store.taskName,
        amount: '$'+Store.amount,
        billingHours: Store.billingHours || 0,
        clientName: Store.clientName || " ",
        billingDuration: ( Store.billingFrom+' - '+Store.billingTo),
        status: (Store.status===1 ? 'Paid' : 'Unpaid'),
        invoiceAttachment: (Store.invoiceAttachment!=='' ? <a href={Store.invoiceAttachment} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-primary" title="Download Invoice"><i className="fa fa-file-pdf-o "></i></a>  : ''),
      }
      rowsItem.push(orgInfo);
      count = count+i;
    }      
    
    const columns = [ 
      {
        label: 'Invoice no.',
        name: 'invoiceId',
      },
      {
        label: 'Client',
        name: 'clientName',
      },
      {
        label: 'Billing Hours',
        name: 'billingHours',
      },
      {
        label: 'Amount',
        name: 'amount',
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        label: 'Billing Duration',
        name: 'billingDuration',
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
              <div className="actionBtnGroup" style={{width:'140px'}}>
                {rowsItem[i].invoiceAttachment}&nbsp;
                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editDataItem(i)}><i className="fa fa-pencil"></i> </button>
                <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => {if(window.confirm('Are you sure you want to delete this record?')){ this.deleteDataItem(i) };}} ><i className="fa fa-trash"></i></button>
                <button className="btn-edit" title="Pay Now" onClick={() => {if(window.confirm('Are you sure you want to pay this invoice?')){ this.payInvoiceItem(i) };}} ><i className="fa fa-paypal"></i></button>
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
      downloadOptions: {filename: 'billing-list.csv', separator: ','},
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
        title={"Invoice List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default BillingData;