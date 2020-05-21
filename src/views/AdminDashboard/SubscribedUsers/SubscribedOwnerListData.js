import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";

class SubscribedOwnerListData extends Component {
  
  constructor(props){
    super(props);   
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: [],
    };
    
  }
  componentDidMount() {   
  }
  
  editUserRow(rowIndex){    
    this.props.editUserAction(rowIndex);
  }
  deleteUserRow(rowIndex){    
    this.props.deleteUserAction(rowIndex);
  }
  
  render() {
   
    let rowsItem = [];    
    for(const [i, userData] of this.props.data.entries()){
      console.log(i);
      let userInfo = {
        userName: userData.userName,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
        planName: userData.planName || " ",
        transactionProfileId: userData.transactionProfileId,
        status: userData.statusLabel,
        amount: '$'+userData.amount,
        startDate: (new Date(userData.startDate)).toLocaleDateString("en-US"),
        endDate: (new Date(userData.endDate)).toLocaleDateString("en-US"),
      }      
      rowsItem.push(userInfo);
    }      
    const columns = [      
      {
        label: 'Owner Name',
        name: 'userName',
      },
      {
        label: 'Email',
        name: 'email',
      },
      {
        label: 'Phone no.',
        name: 'phoneNumber',
        options: { display: false}
      },
      {
        label: 'Plan',
        name: 'planName',
      },
      {
        label: 'Amount',
        name: 'amount',
      },
      {
        label: 'Subscription ID',
        name: 'transactionProfileId',
        options: { display: false}
      },
      {
        label: 'Start Date',
        name: 'startDate',
      },
      {
        label: 'End Date',
        name: 'endDate',
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
          download: false,
          customBodyRender: (value, tableMeta, updateValue) => {
            let i = tableMeta.rowIndex;
            return (
              <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
                this.editUserRow(i)} title="View Subscriber Info"><i className="fa fa-eye"></i> </button>
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
      downloadOptions: {filename: 'texque-subscribed-owner-list.csv', separator: ','},
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
        title={"Subscribed Food Truck Owner List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default SubscribedOwnerListData;
