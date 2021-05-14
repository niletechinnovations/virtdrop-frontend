import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MUIDataTable from "mui-datatables";

class TransactionData extends Component {
  
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
        subscriberId: enquiry.transactionProfileId,
        planName: enquiry.planName,
        amount: ( enquiry.isTrail ? 'Free Trial' : '$'+enquiry.amount),
        startDate: (new Date(enquiry.startDate)).toLocaleDateString("en-US"),
        endDate: (new Date(enquiry.endDate)).toLocaleDateString("en-US"),
        status: enquiry.statusLabel ? enquiry.statusLabel : "Pending",   
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        reviewId: enquiry.reviewId,
        action: <Button className="btn-edit btn-info" size='sm' disabled={this.state.buttonProcessing} onClick={() => 
          this.editDataItem(i)} title="View Transaction Details"><i className="fa fa-eye"></i> </Button>
      }      
      rowsItem.push(resInfo);
    }

    const columns = [ 
        { label: 'Subscription ID', name: 'subscriberId' },
        { label: 'Plan', name: 'planName' },
        { label: 'Amount', name: 'amount' },
        { label: 'Start Date', name: 'startDate' },
        { label: 'End Date', name: 'endDate' },
        { label: 'Status', name: 'status' },
        {
            name: "action",
            label: "Action",
            options: {
                filter: false,
                sort: false,
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
          noMatch: this.props.dataTableLoadingStatus ? "Loading........" : "",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        },
      },
      fixedHeaderOptions: { xAxis: false, yAxis: false }
    };
    
    return (
      <MUIDataTable
        title={"Payment History"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default TransactionData;