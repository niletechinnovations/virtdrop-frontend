import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";
import commonService from '../../../../core/services/commonService';

export class HireVaAssignmentData extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rowIndex: '',
            edit: "Edit VA"

        }
    }

    componentDidMount() {

    }
   
    // Edit Store Info 
    editHireItem(rowIndex) {
        this.props.editItemAction(rowIndex);
        // this.props.changeNameget()
    };

    // Edit Store Info 
    deleteHireItem(rowIndex) {
        this.props.deleteItemAction(rowIndex);
    };

    render() {
        
        let count = 0;
        // let dataItem= [];
        let rowsItem = [];
        for (const [i, Store] of this.props.data.entries()) {
            // console.log("Storeeeeee----------Authid-----------", Store)
            let hireInfo = {
                // organizationName: Store.organizationName,
                industryName: Store.industrytype.map(e=>e.name).toString(),
                skillName: Store.skillsFreelancer.map(e=>e.areaName).toString(),
                choosePlan: Store.which_plan,
                need: Store.quickly_Need===1? "Within 48 hours":"Under No Rush wait for the best candidates",
                weekdays: Store.which_Days_Week,
                requiredTime: Store.during_Those_Days,
                hoursA_Day: Store.Hours_A_Day,
                authId: Store.authId,
                _id: Store._id,
                // client: Store.clientCompleteName,
                client:Store.firstName ? Store.firstName + " " + Store.lastName: "empty"

            }

            rowsItem.push(hireInfo);
            count = count + i;
        }

        const columns = [

            {
                label: 'Industry',
                name: 'industryName',
            },
            {
                label: 'Client',
                name: 'client'
            },
            {
                label: 'Skills',
                name: 'skillName',
            },
            {
                label: 'Need',
                name: 'need'
            },
            {
                label: 'Req. Time',
                name: 'requiredTime'
            },
            {
                label: 'Hrs. a Day ',
                name: 'hoursA_Day'
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
                        // console.log("[this.props.data[i].authId]00000000000000000000000000000",[{clientid :rowsItem[i].authId}])
                        // this.props.history.push({
                        //       pathname: '/admin/assign-hire-va/',
                        //       state: [{clientid :rowsItem[i].authId}]
                        //   })
                        return (
                            
                            <div className="actionBtnGroup" style={{ width: '90px' }}>
                                {/* <Link className="btn btn-sm btn-primary" to={`/admin/assign-hire-va/${rowsItem[i]._id}`}>Assign VA</Link> */}
                                <Link className="btn btn-sm btn-primary" to={{pathname:`/admin/assign-hire-va/${rowsItem[i]._id}`,
                                   state: rowsItem[i].authId     
                                }}>Assign VA</Link>
                                
                            </div>
                        );
                    }
                }
            }

        ];
        
                     
        const options = {
            search: true,
            filter: false,
            searchOpen: false,
            print: false,
            download: true,
            downloadOptions: { filename: 'hire-va-assignment-list.csv', separator: ',' },
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
            <div>
                <MUIDataTable
                    title={"Hire VA Assignment List"}
                    data={rowsItem}
                    columns={columns}
                    options={options}
                />
            </div>
        )

        
    }
}

export default HireVaAssignmentData;
