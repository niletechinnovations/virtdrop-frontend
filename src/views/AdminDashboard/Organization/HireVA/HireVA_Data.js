import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
import { Link } from "react-router-dom";

export class HireVA_Data extends Component {
    constructor(props) {
        super(props)
        this.state = {
            rowIndex: '',
            edit: "Edit VAAA"

        }
    }

    componentDidMount() {

    }
    //   change Name
    //  chahgename(edit){
    //    console.log ( this.props.changeNameget,"hee")
    //  }

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
            console.log("Storeeeeee------------------------", Store)
            let hireInfo = {
                // organizationName: Store.organizationName,
                industryName: Store.industry,
                skillName: Store.skillsFreelancer,
                choosePlan: Store.which_plan,
                need: Store.quickly_Need,
                weekdays: Store.which_Days_Week,
                requiredTime: Store.during_Those_Days,
                hoursA_Day: Store.Hours_A_Day,
                authId: Store.authId,
                _id: Store._id,
                client: Store.clientCompleteName

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
                label: 'Choosen Plan',
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
            {
                label: 'Required Time',
                name: 'requiredTime'
            },
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
                            <div className="actionBtnGroup" style={{ width: '110px' }}>
                                <Link className="btn btn-info btn-edit" to={`/admin/hire-va/view-hire-va-list/${rowsItem[i]._id}`}><i className="fa fa-eye" aria-hidden="true"></i>
                                </Link>
                                <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => this.editHireItem(i)}><i className="fa fa-pencil"></i></button>
                                {/* , this.chahgename(this.state.edit) */}
                                <button className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if (window.confirm('Are you sure you want to delete this record?')) { this.deleteHireItem(i) }; }} ><i className="fa fa-trash"></i></button></div>
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
