import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";

class SubscriptionData extends Component {
  
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
  editSubscriptionItem(rowIndex){    
    this.props.editSubscriptionAction(rowIndex);
  }

  deleteSubscriptionItem(rowIndex){    
    this.props.deleteSubscriptionAction(rowIndex);
  }

  render() {
    
    let rowsItem = [];
    for(const [i, plan] of this.props.data.entries()){
      let pmon = plan.planVariation[0];
      let pyear = plan.planVariation[1];
      let orgInfo = {   
        planId: plan.planId,      
        planName: plan.planName,        
        amount: ( pmon!==undefined ? '$'+pmon.amount+' Monthly, $'+pyear.amount+' Yearly' : '' ),
        userAccess: plan.advertisementAccess || " ",      
        description: plan.description || " ",
        status: plan.status ? 'Active' : 'Inactive',   
        action: <p><button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
          this.editSubscriptionItem(i)} title="Edit Subscription"><i className="fa fa-pencil"></i> </button></p>,       
      }      
      rowsItem.push(orgInfo);
    }      
    
    const columns = [ 
      {
        label: 'Plan Name',
        name: 'planName',
      },     
      {
        label: 'Amount',
        name: 'amount',
      },
      {
        label: 'No. of listing',
        name: 'userAccess',
      },
      {
        label: 'Description',
        name: 'description',
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
        title={"Plan List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default SubscriptionData;