import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MUIDataTable from "mui-datatables";

class ScheduledBookingData extends Component {
  
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

  /* Delete Enquiry Info */
  deleteEnquiryItem(rowIndex){    
    this.props.deleteEnquiryAction(rowIndex);
  }
 

  render() {
    let rowsItem = []; 
    for(const [i, enquiry] of this.props.data.entries()){
      //console.log(i);
      let resInfo = {
        contactPerson: enquiry.firstName+' '+enquiry.lastName,
        email: enquiry.email,
        phoneNumber: enquiry.phoneNumber || " ",
        companyName: enquiry.companyName || " ",
        scheduledOn: (new Date(enquiry.scheduledDate)).toLocaleDateString("en-US",{ year: 'numeric', month: 'long', day: 'numeric' })+' @ '+enquiry.scheduledTime,
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        bookingId: enquiry.id,
      }
      rowsItem.push(resInfo);
    }

    const columns = [ 
        {
          label: 'User',
          name: 'contactPerson',
        },
        {
          label: 'Email',
          name: 'email',
        },
        {
          label: 'Phone no.',
          name: 'phoneNumber',
        },
        {
          label: 'Company name',
          name: 'companyName',
        },
        {
          label: 'Scheduled on',
          name: 'scheduledOn',
        },
        {
          label: 'Created on',
          name: 'createdAt',
        },
        {
          name: "action",
          label: " Action ",
          options: {
            filter: false,
            sort: false,
            download: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              let i = tableMeta.rowIndex;
              return (
                <div className="actionBtnGroup"><Button className="btn-delete btn-danger" size='sm' onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteEnquiryItem(i) };}} title="Delete Inquiry"><i className="fa fa-trash"></i> </Button></div>
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
      downloadOptions: {filename: 'scheduled-booking-list.csv', separator: ','},
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
        title={"Scheduled Booking Data"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default ScheduledBookingData;