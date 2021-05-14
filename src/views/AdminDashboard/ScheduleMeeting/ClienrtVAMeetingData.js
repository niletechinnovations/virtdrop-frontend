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
    for (const [i, meeting] of this.props.data.entries()) {
      // console.log("meeting",meeting)

      let resInfo = {
        clinetAuthId: meeting.clientId,
        clientName: meeting.clientFirstName + ' ' + meeting.clientLastName || " ",
        clientEmail: meeting.clientEmail || " ",
        clientMob: meeting.clientMobileNo || " ",
        clientOrganizationName: meeting.clientOrganizationName,
        hireVAId: meeting.hireVAId,
        vAAuthId: meeting.VADetails.vaAuthid || " ",
        VaName: meeting.VADetails.vACompleteName.join(",  ")  || " ",
        VaEmail: meeting.VADetails.vAEmail.join(",        ")|| " ",
        VaMobile: meeting.VADetails.vAMobileNo || " ",

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
        label: 'Client Phone no.',
        name: 'clientMob',
      },
      {
        label: 'Client Company name',
        name: 'clientOrganizationName',
      },
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
                {/* <Button className="btn-edit btn-success" size='sm' onClick={() => { if (link=prompt('Please! Add meeting Link into the box',"Add meeting Link")) { this.sendMeetingMail(link,i) }; }} to={`admin/schedule-meeting/${rowsItem[i].clinetAuthId}`} title=" Schedule Meeting"><i className="fa fa-handshake-o"></i>
              </Button> */}

                {/* <Link className="btn btn-sm btn-primary" size='sm' onClick={() => { if (link=prompt('Please! Add meeting Link into the box',"Add meeting Link")) { this.sendMeetingMail(link,i) } }} to={{pathname:`/admin/schedule-meeting/${rowsItem[i].clinetAuthId}`, state: rowsItem[i]}}><i className="fa fa-envelope"></i></Link> */}

                {/* <Link className="btn-edit btn-success" size='sm' onClick={() => { if (link = prompt('Please! Add meeting Link into the box', "Add meeting Link")) { this.sendMeetingMail(link, i, rowsItem[i]) } }} to={{ pathname: `/admin/schedule-meeting`, state: rowsItem[i] }}><i className="fa fa-envelope"></i></Link> */}

                <Button className="btn-edit btn-success" size='sm' onClick={() => { this.sendMeetingMail(link, i, rowsItem[i]) } } title="Sechdule Meeting"><i className="fa fa-envelope"></i></Button>


                {/* // <div className="actionBtnGroup"> */}
                {/* <div className="actionBtnGroup"> */}
                {/* <Button className="btn-edit btn-success" size='sm' onClick={() => { if (link=prompt('Please! Add meeting Link into the box',"Add meeting Link")) { this.sendMeetingMail(link,i) }; }} title="Schedule Meeting"><i className="fa fa-envelope"></i>
                    </Button> */}

                {/* <Link className="btn btn-sm btn-primary" size='sm' onClick={() => { if (link=prompt('Please! Add meeting Link into the box',"Add meeting Link")) { this.sendMeetingMail(link,i) }; }} to={`admin/schedule-meeting/${rowsItem[i].clinetAuthId}`}><i className="fa fa-envelope"></i></Link> */}
                {/* </Button> */}
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
