import React, { Component } from 'react';
import { CardBody, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Loader from '../../../Loader/Loader';
import HireVaAssignmentData from './HireVaAssignmentData';
import commonService from '../../../../core/services/commonService';
import { toast } from 'react-toastify';
import { Multiselect } from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";


class HireVaAssignmentList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            hireVaListData: [],
            skillList: [],
            modal: false,
            selectedValues: [],
            changeName: '',
            // selectedValues1:[],
            rowIndex: -1,
            filterItem: { filter_Skills: '', filter_client: '', filter_choose: '', filterFrom: '', filterTo: '' },
        }

        this.hireVaList = this.hireVaList.bind(this);
        this.getSkillList = this.getSkillList.bind(this);
        // this.handleEditItem = this.handleEditItem.bind(this);
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this);
        // this.addItem = this.addItem.bind(this);
        // this.onKeyDown = this.onKeyDown.bind(this);
        this.filterItemList = this.filterItemList.bind(this);
    }

    itemList(filterItem = {}) {
        let filterQuery = "?pageSize=10000";

        if (filterItem.filter_client !== undefined && filterItem.filter_client !== "") {
            filterQuery += (filterQuery !== "") ? "&clientName=" + filterItem.filter_client : "&clientName=" + filterItem.filter_client;
        }
        if (filterItem.filter_choose !== undefined && filterItem.filter_choose !== "") {
            filterQuery += (filterQuery !== "") ? "&chooseplan=" + filterItem.filter_choose : "&chooseplan=" + filterItem.filter_choose;
        }
        if (filterItem.filter_Skills !== undefined && filterItem.filter_Skills !== "") {
            filterQuery += (filterQuery !== "") ? "&filterSkills=" + filterItem.filter_Skills : "&filterSkills=" + filterItem.filter_Skills;
        }

        if (filterItem.filterFrom !== undefined && filterItem.filterFrom !== "") {
            let newFromDate = this.getFormatDate(filterItem.filterFrom);
            filterQuery += (filterQuery !== "") ? "&start_date=" + newFromDate : "?start_date=" + newFromDate;
        }
        if (filterItem.filterTo !== undefined && filterItem.filterTo !== "") {
            let newToDate = this.getFormatDate(filterItem.filterTo);
            filterQuery += (filterQuery !== "") ? "&end_date=" + newToDate : "?end_date=" + newToDate;
        }

        this.setState({ loading: true }, () => {
            commonService.getAPIWithAccessToken('hire/get-hire-va' + filterQuery)
                .then(res => {
                    // console.log("VA Hire32", res.data.data)
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    const result = res.data.data.requestList.map(skill => skill.skillsFreelancer)

                    this.setState({ loading: false, hireVaListData: res.data.data.requestList, selectedValues: result });
                })
                .catch(err => {
                    if (err.response !== undefined && err.response.status === 401) {
                        localStorage.clear();
                        this.props.history.push('/login');
                    } else
                        this.setState({ loading: false });
                })
        })
    }

    filterItemList() {
        const filterItem = this.state.filterItem;
        this.itemList(filterItem);
    }

    getFormatDate(date) {
        // console.log("DDDDDDDdd", date)
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 101).toString().substring(1);
        var day = (date.getDate() + 100).toString().substring(1);
        return year + "-" + month + "-" + day;
    }

    setFilterFromDate = date => {
        let filterFormField = this.state.filterItem;
        console.log("ToDate>>>>>", (this.state.filterItem.filterTo) < Date.parse(date))
        if (Date.parse(this.state.filterItem.filterTo) < Date.parse(date)) {

            alert("To Date should be greater than From Date");
        } else {
            filterFormField.filterFrom = date;
            this.setState({ filterItem: filterFormField });
        }


    };

    setFilterToDate = date => {
        let filterFormField = this.state.filterItem;
        // console.log( Date.parse(this.state.filterItem.filterFrom),"=================",Date.parse(date))
        if (Date.parse(this.state.filterItem.filterFrom) > Date.parse(date)) {

            alert("To Date should be greater than From Date");
        } else {

            filterFormField.filterTo = date;
            this.setState({ filterItem: filterFormField });

        }

    };


    resetfilterForm = () => {

        this.setState({
            filterItem: { filterFrom: '', filterTo: '', filter_Skills: '', filter_client: '', filter_choose: '' },
        });
        this.itemList();
    }

    changeFilterHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        const filterItem = this.state.filterItem
        filterItem[name] = value;
        this.setState({ filterItem: filterItem });
    };

    getSkillList = () => {
        commonService.getAPIWithAccessToken('skill')
            .then(res => {
                if (undefined === res.data.data || !res.data.status) {
                    this.setState({ loading: false });
                    toast.error(res.data.message);
                    return;
                }

                this.setState({ loading: false, skillList: res.data.data })
            })
            .catch(error => {
                if (error !== undefined) {
                    localStorage.clear()
                    // this.props.histroy.push('/login')
                } else {
                    this.setState({ loading: false, })
                    toast.error(error.message)
                }
            })
    }
    componentDidMount() {
        const { match: { params } } = this.props;
        // console.log("match", this.props);
        this.getSkillList();
        // this.hireVaList();
        // this.addItem();
        this.itemList();
    }

    onSelect(selectedList, selectedItem) {
        // console.log("selectedList************************>",selectedList)
        this.setState({ selectedValues: selectedList.map(item => item) })

    }

    onRemove(selectedList, removedItem) {
        // this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill.skillName) })
        this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill) })
    }


    /* Hire VA List API*/
    hireVaList() {
        commonService.getAPIWithAccessToken('hire/get-hire-va')
            .then(res => {
                // console.log("VA Hire112", res.data.data)
                if (undefined === res.data.data || !res.data.status) {
                    this.setState({ loading: false });
                    toast.error(res.data.message);
                    return;
                }
                const result = res.data.data.map(skill => skill.skillsFreelancer).map(res => res.split(","));

                //  const rs1=   result.map(res=> res.split(","))
                //  console.log("===============>",result)

                this.setState({ loading: false, hireVaListData: res.data.data.requestList, selectedValues: result });
            })
            .catch(err => {
                if (err.response !== undefined && err.response.status === 401) {
                    localStorage.clear();
                    this.props.history.push('/login');
                } else
                    this.setState({ loading: false });
            })
    }


    render() {

        const { loading, hireVaListData, skillList, selectedValues, filterItem } = this.state;
        let loaderElement = '';
        if (loading)
            loaderElement = <Loader />
        const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
        return (
            <div className="animated fadeIn">
                <Row>
                    {loaderElement}
                <Col lg={12}>
                    <CardBody>
                        <Row className="filterRow">
                            <Col md={"2"} className="pl-0">
                                <FormGroup>
                                    <Label htmlFor="filter_client" >Client Name</Label>
                                    <Input type="text" value={filterItem.filter_client} placeholder="Search by Client Name" id="filter_client" name="filter_client"
                                        // value={filterItem.filter_filter_client} 
                                        onChange={this.changeFilterHandler}>

                                    </Input>
                                </FormGroup>
                            </Col>

                            <Col md={"2"} className="pl-3">
                                <FormGroup>
                                    <Label htmlFor="filter_choose" >Choose Plan</Label>
                                    <Input type="select" value={filterItem.filter_choose} placeholder="Search by Choose Plan" id="filter_choose" name="filter_choose"
                                        // value={filterItem.filter_choose} 
                                        onChange={this.changeFilterHandler}>
                                        <option value="">All</option>
                                        <option value="entery_Level">Entry Level</option>
                                        <option value="mid_Level">Mid Level</option>
                                        <option value="expert_Level">Expert Level</option>
                                        {/* {organizationList.map((organizationInfo, index) =>
                                <SetOrganizationDropDownItem key={index} organizationInfo={organizationInfo} />
                              )} */}
                                    </Input>
                                </FormGroup>
                            </Col>

                            <Col md={"3"} className="pl-3">
                                <FormGroup>
                                    <Label htmlFor="filter_Skills" >Skills</Label>
                                    <Input type="select" value={filterItem.filter_Skills} placeholder="filter_Skills *" id="filter_Skills" name="filter_Skills"
                                        // value={filterItem.filter_organization_id} 
                                        onChange={this.changeFilterHandler}>
                                        <option value="">All</option>
                                        {skillList.map((skillInfo, index) =>
                                            <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                        )}
                                    </Input>
                                </FormGroup>
                            </Col>
                            {/* <HireVA_Data /> */}
                            <Col md={"2"}>
                                <FormGroup>
                                    <Label>From Date</Label>
                                    <DatePicker className="form-control"
                                        selected={filterItem.filterFrom}
                                        maxDate={(new Date())}
                                        onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                                </FormGroup>
                            </Col>
                            <Col md={"2"}>
                                <FormGroup>
                                    <Label> To Date</Label>
                                    <DatePicker className="form-control"
                                        selected={filterItem.filterTo}
                                        maxDate={(new Date())}
                                        onChange={this.setFilterToDate}
                                        dateFormat="MM/dd/yyyy" />
                                </FormGroup>
                            </Col>
                            <Col md={"1"} className="p-0">
                                <FormGroup>
                                    <Label>&nbsp;</Label><br />
                                    <Button color="success" type="button" size="sm" onClick={this.filterItemList} title="Filter VA Request"><i className="fa fa-search"></i></Button>&nbsp;
                            <Button color="danger" type="reset" size="sm" onClick={this.resetfilterForm} title="Reset Fields"><i className="fa fa-refresh"></i></Button>
                                </FormGroup>
                            </Col>
                        </Row>
                    </CardBody>
                </Col>

                <Col md={12}>

                    <HireVaAssignmentData data={hireVaListData} dataTableLoadingStatus={this.state.loading} />
                    {/* changeNameget={this.state.changeName} */}
                </Col>
                
                </Row>
                 
                
            </div>
        );
    }
}

function SetSkillDropDownItem(props) {
    const skillInfo = props.skillInfo;
    return (<option value={skillInfo.skillName} >{skillInfo.skillName}</option>)
}

export default HireVaAssignmentList;