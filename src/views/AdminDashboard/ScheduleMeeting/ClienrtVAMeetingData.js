import React, { Component } from 'react'
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import MUIDataTable from "mui-datatables";

export default class ClienrtVAMeetingData extends Component {

  constructor(props) {
    super(props);
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      meetinglink: '',
      dataTableItem: []
    };

  }
  componentDidMount() {
  }
  sendMeetingMail(link, rowIndex, formdata) {
    // console.log("MMMMMM", formdata)
    this.props.MailToAction(link, rowIndex, formdata);

  }
  /* Delete Meeting Info */
  deleteEnquiryItem(rowIndex) {
    this.props.deleteEnquiryAction(rowIndex);
  }

  render() {
    let rowsItem = [];
    // console.log("this.props.data".this.props.data)
    for (const [i, meeting] of this.props.data.entries()) {
    
      console.log("meeting", meeting.kickoff_date)
      // let [name] =meeting.clientCompleteDetails.map(e=>e.FirstName)
            //  var [clientName] =meeting.map(e=>e.clientCompleteDetails.map(el=>el.FirstName))
            //  console.log("clei",name)
      let  dt = new Date(meeting.kickoff_date)
      console.log("dddddddddddd",dt)
      let suggestedMonth = new Date(meeting.suggestedDate).getMonth()+1;
      let resInfo = {
       
        clinetAuthId: meeting.clientId,
        clientName: meeting.clientName,
        //clientName:  meeting.clientCompleteDetails? meeting.clientCompleteDetails.map(e=>e.FirstName):'',
        //clientEmail: meeting.clientCompleteDetails? meeting.clientCompleteDetails.map(e=>e.email):'',
        //clientMob: meeting.clientCompleteDetails? meeting.clientCompleteDetails.map(e=>e.PhoneNumber):'',
        clientEmail: meeting.clientEmail,
        clientMob: meeting.clientPhone,
        clientMob: meeting.clientPhone,
        clientOrganizationName: meeting.organizationName,
        //clientOrganizationName: meeting.clientCompleteDetails? meeting.clientCompleteDetails.map(e=>e.companyName):'',
        hireVAId: meeting.hireVAId,
        vAAuthId: meeting.vaAuthId,
        VaName: meeting.vaName,
        VaEmail:meeting.vaEmail,
        VaMobile: meeting.vaMobile,
        //VaName: meeting.selectedVaDetails? meeting.selectedVaDetails.map(e=>e.firstName).toString():'',
        //VaEmail:meeting.selectedVaDetails? meeting.selectedVaDetails.map(e=>e.email).join(",        "):'',
       //VaMobile: meeting.selectedVaDetails? meeting.selectedVaDetails.map(e=>e.mobileNumber):'',
        suggestedDate:meeting.suggestedDate? new Date(meeting.suggestedDate).getDate() +"/"+suggestedMonth +"/"+new Date(meeting.suggestedDate).getFullYear() :'',
        suggestedTime:meeting.suggestedTime ? meeting.suggestedTime + "AM":'',
        kickoff_Date: meeting.kickoff_date? dt.getDate()+'/'+(dt.getMonth()+1)+'/'+dt.getFullYear() :'Not Available',

        indexVal: i,

      }
      rowsItem.push(resInfo);
    }

    const columns = [
      {
        label: 'Client Name',
        name: 'clientName',
      },
      {
        label: 'Email',
        name: 'clientEmail',
      },
      {
        label: 'Kick Off Date',
        name: 'kickoff_Date',
      },
      {
        label: 'Suggested Date',
        name: 'suggestedDate',
      },
      {
        label: 'Suggested Time.',
        name: 'suggestedTime',
      },
      {
        label: 'Client Phone',
        name: 'clientMob',
      },
      /*{
        label: "Client's Company",
        name: 'clientOrganizationName',
      },*/
      {
        label: 'VA Name',
        name: 'VaName',
      },
      {
        label: 'VA Email',
        name: 'VaEmail',
      },
      {
        label: "VA Mobile",
        name: 'VaMobile'
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
            let link = this.state.meetinglink

            return (

              <div className="actionBtnGroup">
                <Button className="btn-edit btn-success" size='sm' onClick={() => { this.sendMeetingMail(link, i, rowsItem[i]) } } title="Sechdule Meeting"><i className="fa fa-envelope"></i></Button>
               <Button className="btn-delete btn-danger" size='sm' onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { this.deleteEnquiryItem(i) }; }} title="Delete Meeting"><i className="fa fa-trash"></i> </Button>
              </div>

            );
          }
        }
      },
    ];

    const options = {
      search: true,
      // filter: false,
      filterType: 'checkbox',
      searchOpen: false,
      print: false,
      download: true,
      downloadOptions: { filename: 'scheduled-meeting-list.csv', separator: ',' },
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
        title={"Schedule Meeting List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}
