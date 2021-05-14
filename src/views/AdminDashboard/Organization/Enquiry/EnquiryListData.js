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

  /* Delete Enquiry Info */
  deleteEnquiryItem(rowIndex){    
    this.props.deleteEnquiryAction(rowIndex);
  }
 

  render() {
    
    let rowsItem = []; 
   
    for(const [i, enquiry] of this.props.data.entries()){
      //console.log(i);
      let resInfo = {
        contactPerson: enquiry.contactPerson,
        email: enquiry.email,
        phoneNumber: enquiry.phone || " ",
        message: enquiry.message || " ",
        subject: enquiry.subject,
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        enquiryId: enquiry.id,
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
          label: 'Interested on',
          name: 'subject',
        },
        {
          label: 'Message',
          name: 'message',
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
      downloadOptions: {filename: 'contact-enquiry-list.csv', separator: ','},
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
        title={"Contact Inquiries"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default EnquiryListData;