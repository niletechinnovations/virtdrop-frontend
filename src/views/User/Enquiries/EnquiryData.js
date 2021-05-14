import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MUIDataTable from "mui-datatables";

class EnquiryData extends Component {
  
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
  /* Edit Enquiry Info */
  editEnquiryItem(rowIndex){    
    this.props.editEnquiryAction(rowIndex);
  }
 

  render() {
    
    let rowsItem = []; 
   
    for(const [i, enquiry] of this.props.data.entries()){
      //console.log(i);
      let resInfo = {
        organizationName: enquiry.organizationName,  
        contactPerson: enquiry.contactPerson,
        truckName: enquiry.truckName,
        phoneNumber: enquiry.contactNo || " ",
        message: enquiry.message || " ",
        status: enquiry.statusLabel ? enquiry.statusLabel : "Pending",   
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        enquiryId: enquiry.enquiryId,
        action: <Button className="btn-edit btn-info" size='sm' disabled={this.state.buttonProcessing} onClick={() => 
          this.editEnquiryItem(i)} title="Edit Inquiry"><i className="fa fa-pencil"></i> </Button>
      }      
      rowsItem.push(resInfo);
    }

    const columns = [ 
        {
            label: 'User',
            name: 'contactPerson',
        },
        {
            label: 'Message',
            name: 'message',
        },
        {
            label: 'Truck Name',
            name: 'truckName',
        }, 
        {
            label: 'Date',
            name: 'createdAt',
        },
        {
            label: 'Status',
            name: 'status',
        },
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
        title={"Food Truck Inquiries"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default EnquiryData;