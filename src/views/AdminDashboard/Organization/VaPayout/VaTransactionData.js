import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";

class VaTransactionData extends Component {
  
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
  /* Edit Row Info */
  editDataItem(rowIndex){    
    this.props.editDataAction(rowIndex);
  }
 

  render() {
    
    let rowsItem = []; 
   
    for(const [i, enquiry] of this.props.data.entries()){
      let resInfo = {
        payout_batch_id: enquiry.payout_batch_id,
        invoiceNo: '#'+enquiry.invoiceNo,
        amount: '$'+enquiry.amount,
        status: enquiry.batch_status,   
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
      }      
      rowsItem.push(resInfo);
    }

    const columns = [ 
        { label: 'Payout Batch ID', name: 'payout_batch_id' },
        { label: 'Invoice No', name: 'invoiceNo' },
        { label: 'Amount', name: 'amount' },
        { label: 'Status', name: 'status' },
        { label: 'Created on', name: 'createdAt' },
        /*{
          name: "action",
          label: "Action",
          options: {
            filter: false,
            sort: false,
            download: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              let i = tableMeta.rowIndex;
              return (
                <Button className="btn-edit btn-info" size='sm' disabled={this.state.buttonProcessing} onClick={() => 
                  this.editDataItem(i)}><i className="fa fa-eye"></i> </Button>
              );
            }
          }
        },*/
    ];

    
    const options = {
      search: true,
      filter: false,
      searchOpen: false,
      print: false,
      download: true,
      downloadOptions: {filename: 'transaction-list.csv', separator: ','},
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
        title={"VA Transactions"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default VaTransactionData;