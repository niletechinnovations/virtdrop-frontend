import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";

export class HireVA_Data extends Component {
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

    // Show Store Info 
    showHireItem(rowIndex) {
        this.props.showItemAction(rowIndex);
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
            // console.log("Storeeeeee--------------------", Store)
            let hireInfo = {
                // organizationName: Store.organizationName,
                // industryName: Store.industry,
                industryName: Store.industrytype.map(e=>e.name).toString(),
                // skillName: Store.skillsFreelancer.toString(),
                //  skillName: Store.skillsFreelancer.map(e=>e.parentName).toString(),
                skillName:Store.skillsFreelancer.map(item => item.parentName)
                .filter((value, index, self) => self.indexOf(value) === index).toString(),
                choosePlan: Store.which_plan,
                // need: Store.quickly_Need >1 ? Store.quickly_Need + " "+ 'days' :Store.quickly_Need + " "+ 'day' ,
                need:  Store.quickly_Need == 2 ? "Under No Rush , wait best candidate":"Within 48 Hours",
                weekdays: Store.Days_A_Week,
                requiredTime: Store.during_Those_Days, 
                hoursA_Day: Store.Hours_A_Day+" "+'hrs',
                authId: Store.authId,
                _id: Store._id,
                // client: Store.clientCompleteName,
                // client: Store.firstName + " " + Store.lastName
                client: Store.firstName

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
                label: 'Required Skills',
                name: 'skillName',
            },
            {
                label: 'Plan',
                name: 'choosePlan'
            },
            {
                label: 'Need',
                name: 'need'
            },

            {
                label: 'Weekdays',
                name: 'weekdays'
            },
            // {
            //     label: 'Required Time',
            //     name: 'requiredTime'
            // },
            {
                label: 'Hours A Day ',
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
                        // console.log("index............", value)
                        let i = tableMeta.rowIndex;
                        // console.log("iiiiiiiiiiiiiiii",i)
                        return (
                            <div className="actionBtnGroup">

                                {/* <Link className="btn btn-info btn-edit" to={`/admin/hire-va/view-hire-va-list/${rowsItem[i]._id}`}><i className="fa fa-eye" aria-hidden="true"></i>
                                </Link>  */}
                                {/* <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => this.editHireItem(i)}><i className="fa fa-eye"></i></button> */}
                                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => this.showHireItem(i)}><i className="fa fa-eye"></i></button>
                                {/* , this.chahgename(this.state.edit) */}
                                <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { this.deleteHireItem(i) }; }} ><i className="fa fa-trash"></i></button>
                               
                                <Link className="btn btn-sm btn-primary" to={{pathname:`/admin/assign-hire-va/${rowsItem[i]._id}`,
                                   state: rowsItem[i].authId     
                                }}><i className="fa fa-user"></i></Link>

                                {/* <i className="fa fa-user"></i> */}
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
            downloadOptions: { filename: 'hire-va-request-list.csv', separator: ',' },
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
                    title={"Hire VA List"}
                    data={rowsItem}
                    columns={columns}
                    options={options}
                />

            </div>
        )
    }
}

export default HireVA_Data;
