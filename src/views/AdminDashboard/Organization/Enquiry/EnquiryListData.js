import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MUIDataTable from "mui-datatables";

class EnquiryListData extends Component {
  
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

  /* Delete Enquiry Info */
  deleteEnquiryItem(rowIndex){    
    this.props.deleteEnquiryAction(rowIndex);
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
        numberofPerson: enquiry.numberofPerson,
        eventDate: enquiry.eventDate,
        status: enquiry.statusLabel ? enquiry.statusLabel : "Pending",   
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        enquiryId: enquiry.enquiryId,
      }      
      rowsItem.push(resInfo);
    }

    const columns = [ 
        {
          label: 'User',
          name: 'contactPerson',
        },
        {
          label: 'Phone no.',
          name: 'phoneNumber',
          options: { display: false}
        },
        {
          label: 'Message',
          name: 'message',
        },
        {
          label: 'No. of person',
          name: 'numberofPerson',
          options: { display: false}
        },
        {
          label: 'Event Date',
          name: 'eventDate',
        },
        {
          label: 'Truck Name',
          name: 'truckName',
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
          name: "action",
          label: " Action ",
          options: {
            filter: false,
            sort: false,
            download: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              let i = tableMeta.rowIndex;
              return (
                <div className="actionBtnGroup"><Button className="btn-edit btn-info" size='sm' disabled={this.state.buttonProcessing} onClick={() => 
                this.editEnquiryItem(i)} title="Edit Inquiry"><i className="fa fa-pencil"></i> </Button><Button className="btn-delete btn-danger" size='sm' disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteEnquiryItem(i) };}} title="Delete Inquiry"><i className="fa fa-trash"></i> </Button></div>
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
      downloadOptions: {filename: 'texque-enquiry-list.csv', separator: ','},
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

export default EnquiryListData;