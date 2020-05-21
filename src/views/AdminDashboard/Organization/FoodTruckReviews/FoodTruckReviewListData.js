import React, { Component } from 'react';
import { Button } from 'reactstrap';
import MUIDataTable from "mui-datatables";

class FoodTruckReviewListData extends Component {
  
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
        reviewedBY: enquiry.reviewedBY,
        truckName: enquiry.truckName,
        message: enquiry.message || " ",
        rating: enquiry.rating,
        replyMessage: enquiry.replyMessage,
        status: enquiry.statusLabel ? enquiry.statusLabel : "Pending",   
        createdAt: (new Date(enquiry.createdAt)).toLocaleDateString("en-US"),
        indexVal: i,
        reviewId: enquiry.reviewId,
      }      
      rowsItem.push(resInfo);
    }

    const columns = [ 
        {
            label: 'User',
            name: 'reviewedBY',
        },
        {
            label: 'Message',
            name: 'message',
        },
        {
          label: 'Rating',
          name: 'rating',
        }, 
        {
          label: 'Comment',
          name: 'replyMessage',
          options: { display: false}
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
          label: " Action ",
          options: {
            filter: false,
            sort: false,
            download: false,
            customBodyRender: (value, tableMeta, updateValue) => {
              let i = tableMeta.rowIndex;
              return (
                <div className="actionBtnGroup"><Button className="btn-edit btn-info" size='sm' disabled={this.state.buttonProcessing} onClick={() => 
                  this.editEnquiryItem(i)} title="Edit Review"><i className="fa fa-pencil"></i> </Button><Button className="btn-delete btn-danger" size='sm' disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteEnquiryItem(i) };}} title="Delete Review"><i className="fa fa-trash"></i> </Button></div>
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
      downloadOptions: {filename: 'texque-review-list.csv', separator: ','},
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
        title={"Food Truck Reviews"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default FoodTruckReviewListData;