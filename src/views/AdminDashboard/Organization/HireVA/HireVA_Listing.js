import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { FormErrors } from '../../../Formerrors/Formerrors';
import Loader from '../../../Loader/Loader';
import HireVAData from './HireVA_Data';
import commonService from '../../../../core/services/commonService';
import { toast } from 'react-toastify';
import { Multiselect } from 'multiselect-react-dropdown';
import DatePicker from "react-datepicker";


class HireVA_Listing extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            formProccessing: false,
            formValid: false,
            hireVaListData: [],
            skillList: [],
            modal: false,
            selectedValues: [],
            selectedIndustry:[],
            changeName: '',
            // selectedValues1:[],
            rowIndex: -1,
            formField: {
                // loading: true,
                // hireVaListData: [],
                clientName: '',
                authId: '',
                modal: false,
                industry: '',
                skillsFreelancer: [],
                jobDescreption: '',
                Hours_A_Day: '',
                Days_A_Week: '',
                which_Days_Week: '',
                during_Those_Days: '',
                which_plan: '',
                quickly_Need: '',
                // weekdays: '',
                requiredTime: '',
                // hoursADay: '',
                organizationName: '',
                // selectedValues:[],
                _id: '',
                status: '',
                // entery_Level:'',
                // expert_Level:'',
                // mid_Level:''
                requestInfo: '',
                industyFrom:'',
            },

            formErrors: { authId: '', industry: '', skillsFreelancer: [], jobDescreption: '', Hours_A_Day: '', Days_A_Week: '', which_Days_Week: '', skills: [], which_plan: '', quickly_Need: '', requiredTime: '', organizationName: '', during_Those_Days: '', requestInfo: '' },

            filterItem: { filter_Skills: '', filter_client: '', filter_choose: '', filterFrom: '', filterTo: '' },
            IndustryList: [
                // { industryName: "Advertising", cat: "Group 1" },
                // { industryName: "AccountingFinance", cat: "Group 1" },
                // { industryName: "Apparel", cat: "Group 1" },
                // { industryName: "ConstructionArchitectureEngineering", cat: "Group 2" },
                // { industryName: "Design", cat: "Group 2" },
                // { industryName: "Entertainment", cat: "Group 2" },
                // { industryName: "Education", cat: "Group 2" },
                // { industryName: "HealthcareMedical", cat: "Group 1" },
                // { industryName: "HospitalityCatering", cat: "Group 1" },
                // { industryName: "LogisticsAndTransport", cat: "Group 1" },
                // { industryName: "Management", cat: "Group 2" },
                // { industryName: "Retail", cat: "Group 2" },
                // { industryName: "RealEstate", cat: "Group 2" },
                // { industryName: "Telecommunication", cat: "Group 2" },
                // { industryName: "TravelAndLeisureAndTourism", cat: "Group 1" },
                // { industryName: "Others", cat: "Group 1" },
            ]

        }

        this.hireVaList = this.hireVaList.bind(this);
        this.getSkillList = this.getSkillList.bind(this);
        this.handleEditItem = this.handleEditItem.bind(this);
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this);
        this.addItem = this.addItem.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.changeRadioButtonHandler = this.changeRadioButtonHandler.bind(this);
        this.handleDeleteItem = this.handleDeleteItem.bind(this);
        // this.onKeyDown = this.onKeyDown.bind(this);
        this.filterItemList = this.filterItemList.bind(this);
        this.onSelectIndstry = this.onSelectIndstry.bind(this);
        this.onRemoveIndustry = this.onRemoveIndustry.bind(this);
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
                    console.log("VA Hire32", res.data.data)
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    const result = res.data.data.requestList.map(skill => skill.skillsFreelancer)
                    console.log("REDSS",result)
                    
                    // const industryHava = res.data.data.requestList.map(industry=> industry.industrytype)
                    const industryHava = res.data.data.requestList.map((e)=>e.industrytype);
                    console.log("industryHava",industryHava)
                    

                    this.setState({ loading: false, hireVaListData: res.data.data.requestList, selectedValues: result, selectedIndustry:industryHava });
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

    addItem() {


        //  this.state.formField.selectedValues.push(this.state.formField.skills)
        //  this.state.formField.skills.push()
        //  console.log("this===========================",this.state.selectedValues)
        // this.setState(formField.skills[skillsFreelancer])
        //   this.state.formField.skills.push(this.state.hireVaListData.map(skill=>console.log("addItme",skill.skillsFreelancer)))
    }

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
    getIndustryList = () => {
        commonService.getAPIWithAccessToken('hire/get-hire-va-Industrylist')
            .then(res => {
                // console.log("INDDDDD",res)
                if (undefined === res.data.data || !res.data.status) {
                    this.setState({ loading: false });
                    toast.error(res.data.message);
                    return;
                }

                this.setState({ loading: false, IndustryList: res.data.data })
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
        this.getIndustryList();
        // this.hireVaList();
        // this.addItem();
        this.itemList();
    }

    onSelect(selectedList, selectedItem) {
        console.log("selectedList************************>",selectedList)
        this.setState({ selectedValues: selectedList.map(item => item) })

    }

    onRemove(selectedList, removedItem) {
        // this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill.skillName) })
        this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill) })
    }

    onSelectIndstry(selectedList, selectedItem) {
        console.log("SELECTED=============************************>",selectedList)
        this.setState({ selectedIndustry: selectedList.map(item => item) })

    }

    onRemoveIndustry(selectedList, removedItem) {
        console.log("REMOVE--------------------------------",selectedList)
        // this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill.skillName) })
        this.setState({ selectedIndustry: selectedList.filter((item) => (item.name !== removedItem.name)).map(industry => industry) })
    }

    // onKeyDown(keyEvent) {
    //     keyEvent.preventDefault();
    //     console.log("keyEvent",keyEvent.keyCode)
    //     // if ((keyEvent.charCode || keyEvent.keyCode) === 13) {
    //         // console.log("Please file the form")
    //             // return window.confirm( "Please file the form")

    //     //   keyEvent.preventDefault();
    //     //   keyEvent.stopPropagation();

    //     // }
    //   }

    /* Submit Form Handler*/
    submitHandler(event) {
        event.preventDefault();
        event.stopPropagation();
        // if(event.which === 13 ){
        // console.warn("CAlled==============", event.key !== 'Enter')
        // }
        let valid = this.state.formField;
        let getMappedSkilled = [];
        getMappedSkilled = this.state.selectedValues.map(skill => skill.skillName);
        // console.log("getMappedSkilled", getMappedSkilled)
        // console.log("VALID===", valid)

      let getMappedIndustry =  this.state.selectedIndustry.map(element => element._id);
      console.log("getMappedIndustry----------------",getMappedIndustry)

        event.target.className += "was-validated";
        // console.log("formInputField11>",this.state.formField)

        // valid.industry === "" ||
        if ( valid.getMappedSkilled === '' || valid.jobDescreption === "" || valid.Days_A_Week === '' || valid.which_Days_Week === '' || valid.which_plan === '' || valid.quickly_Need === '' || valid.requiredTime === '' || valid.Hours_A_Day === '' || valid.during_Those_Days === '' || valid.requestInfo === '') {
            console.log("Please file the form")
            return window.confirm("Please file the form")
        }
        // else{


        this.setState({ formProccessing: true }, () => {
            const formInputField = this.state.formField;
            //    console.log("8**********************",formInputField)
            const formData = {
                // authId: formInputField.authId,
                clientName: formInputField.clientName,
                organizationName: formInputField.organizationName,
                industry: formInputField.industry,
                which_plan: formInputField.which_plan,
                which_Days_Week: formInputField.which_Days_Week,
                Hours_A_Day: formInputField.Hours_A_Day,
                // skillsFreelancer: formInputField.skillsFreelancer,
                // skillsFreelancer: this.state.selectedValues.map(skill=>skill.skillName),
                skillsFreelancer: getMappedSkilled,
                industryType:getMappedIndustry,
                quickly_Need: formInputField.quickly_Need,
                during_Those_Days: formInputField.during_Those_Days,
                Days_A_Week: formInputField.Days_A_Week,
                jobDescreption: formInputField.jobDescreption,
                status: formInputField.status,
                // entery_Level:formInputField.entery_Level,
                // mid_Level:formInputField.mid_Level,
                // expert_Level:formInputField.expert_Level
            };
            // console.log("for------------>",formData)
            const rowIndex = this.state.rowIndex;
            if (rowIndex > -1) {
                formData['_id'] = formInputField._id;

                commonService.putAPIWithAccessToken('hire/', formData)
                    .then(res => {
                        if (undefined === res.data.data || !res.data.status) {
                            this.setState({ formProccessing: false });
                            toast.error(res.data.message);
                            return;
                        }
                        this.setState({ modal: false, formProccessing: false });
                        toast.success(res.data.message);
                        this.itemList();
                    })
                    .catch(err => {
                        if (err.response !== undefined && err.response.status === 401) {
                            localStorage.clear();
                            this.props.history.push('/login');
                        } else {
                            this.setState({ formProccessing: false });
                            toast.error(err.message);
                        }
                    })
            } else {
                commonService.postAPIWithAccessToken('hire/hire-va/', formData)
                    .then(res => {
                        if (undefined === res.data.data || !res.data.status) {
                            this.setState({ formProccessing: false });
                            toast.error(res.data.message);
                            return;
                        }
                        this.setState({ modal: false });
                        toast.success(res.data.message);
                        this.itemList();
                    })
                    .catch(err => {
                        if (err.response !== undefined && err.response.status === 401) {
                            localStorage.clear();
                            this.props.history.push('/login');
                        } else {
                            this.setState({ formProccessing: false });
                            toast.error(err.message);
                        }
                    })
            }
        });
        // }
    }


    changeRadioButtonHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        const formField = this.state.formField;
        // console.log("formField>>>>>>>>",formField)
        formField.which_plan = value;
        this.setState({ formField: formField })
    }



    /* Input Field On changes*/
    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        const formField = this.state.formField;
        formField[name] = value;
        console.log("changeHandler Check", formField[name])
        this.setState({ formField: formField },
            () => { this.validateField(name, value) });
    };

    /* Validate Form Field */
    validateField(fieldName, value) {
        // console.log("fieldName======================", fieldName, "-------", value)
        if (value === '' || value === undefined) {
            return "Please file the form";
        }
        else {
            let fieldValidationErrors = this.state.formErrors;
            fieldValidationErrors.error = '';


            switch (fieldName) {
                //   case 'organizationId':        
                //     fieldValidationErrors.organizationId = (value !== '') ? '' : ' is required';
                //     break;
                case 'industry':
                    fieldValidationErrors.industry = (value !== '') ? '' : ' is required';
                    break;
                case 'skills':
                    fieldValidationErrors.skills = (value !== '') ? '' : ' is required';
                    break;
                case 'choosenPlan':
                    fieldValidationErrors.choosenPlan = (value !== '') ? '' : ' is required';
                    break;
                case 'quickly_Need':
                    fieldValidationErrors.quickly_Need = (value !== '') ? '' : ' is required';
                    break;
                case 'Days_A_Week':
                    fieldValidationErrors.Days_A_Week = (value !== '') ? '' : ' is required';
                    break;
                case 'requiredTime':
                    fieldValidationErrors.requiredTime = (value !== '') ? '' : ' is required';
                    break;
                case 'Hours_A_Day':
                    fieldValidationErrors.Hours_A_Day = (value !== '') ? '' : ' is required';
                    break;

                case 'during_Those_Days':
                    fieldValidationErrors.during_Those_Days = (value !== '') ? '' : ' is required';
                    break;

                case 'jobDescreption':
                    fieldValidationErrors.jobDescreption = (value !== '') ? '' : ' is required';
                    break;

                default:
                    break;
            }
            this.setState({
                formErrors: fieldValidationErrors,
            }, this.validateForm);

        }
    }

    /* Validate Form */
    validateForm() {
        const formErrors = this.state.formErrors;
        const formField = this.state.formField;
        this.setState({
            // formValid:
            //     (formErrors.industry === "" && formField.industry !== "")
            //         ? true : false
        });
    }

    handleEditItem(rowIndex) {
        const itemInfo = this.state.hireVaListData[rowIndex];
        const selectedSkill = []
        const selectedIndustryType = []

        const getSkllls = itemInfo.skillsFreelancer
        this.state.skillList.forEach(el1 => getSkllls.forEach(el2 => {
            // console.log("E1>>>>>>>>>>>",typeof((el1.skillName)),"E2========",typeof(el2))

            if (el1.skillName === el2) {
                (selectedSkill.push(el1))
            }

        }))
        // console.log("finalResult", selectedSkill)
        this.setState({ selectedValues: selectedSkill })

    const getIndustryType = itemInfo.industrytype;
    this.state.IndustryList.forEach(list=> getIndustryType.forEach(list1=>{
        if(list.name===list1){
            (selectedIndustryType.push(list))

        }
    }))
    this.setState({ selectedIndustry: selectedIndustryType })

        const formField = {
            // industyFrom: this.state.formField.industyFrom,
            organizationName: itemInfo.organizationName,
            jobDescreption: itemInfo.jobDescreption,
            authId: itemInfo.authId,
            // industry: itemInfo.industry,
            which_plan: itemInfo.which_plan,
            which_Days_Week: itemInfo.which_Days_Week,
            Hours_A_Day: itemInfo.Hours_A_Day,
            Days_A_Week: itemInfo.Days_A_Week,
            skillsFreelancer: itemInfo.skillsFreelancer,
            quickly_Need: itemInfo.quickly_Need,
            during_Those_Days: itemInfo.during_Those_Days,
            _id: itemInfo._id,
            status: itemInfo.status,

        };
        // console.log("formField", formField)
        const statusBtn = <Button type="button" size="sm" className={`changeStatusBtn ` + (itemInfo.status ? 'btn-danger' : 'btn-success')}
            onClick={() =>
                this.changeProfileStatus(itemInfo.authId, itemInfo.status)} >
            {/* {
             ( itemInfo.status ? 'De-Activate Account' : 'Activate Account' )} */}
        </Button>

        this.setState({ rowIndex: rowIndex, formField: formField, modal: true, changeStatusBtn: statusBtn, formValid: true });

    }
    /* Delete Record*/
    handleDeleteItem(rowIndex) {
        const requestInfo = this.state.hireVaListData[rowIndex];
        // console.log("requestInfo33>>>>>",this.state.hireVaListData[rowIndex]);

        let formdata = { "vaHireRequestId": requestInfo._id }

        this.setState({ loading: true }, () => {
            commonService.deleteAPIWithAccessToken('hire', formdata)
                .then(res => {
                    this.setState({ loading: false });
                    if (undefined === res.data || !res.data.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    this.itemList();
                })
                .catch(err => {
                    if (err.response !== undefined && err.response.status === 401) {
                        localStorage.clear();
                        this.props.history.push('/login');
                    } else {
                        this.setState({ loading: false });
                        toast.error(err.message);
                    }
                })
        })
    }

    toggle = () => {

        // e.stopPropagation();
        // console.log("CCCCCCCCCCCCCCCCCCCCCCCCC",e.target.title)  

        this.setState({
            modal: !this.state.modal, rowIndex: -1, formProccessing: false,
            formValid: false,
            // changeName:  value==="edit" ? "Edit Hire VA":"Add Hire VA",
            changeName: "Hire VA",
            selectedValues: [],
            selectedIndustry:[],
            formField: {
                loading: true,
                // hireVaListData: [],
                organizationName: '', authId: '', modal: false, industry: '', skillsFreelancer: '', selectedIndustry:'', which_plan: '', quickly_Need: '', which_Days_Week: '', during_Those_Days: '', Hours_A_Day: '', Days_A_Week: '', jobDescreption: '', industrytype:'',
            },

            formErrors: { modal: false, industry: '', skills: [], skillsFreelancer: '', selectedIndustry:'', which_plan: '', quickly_Need: '', which_Days_Week: '', during_Those_Days: '', Days_A_Week: '', requiredTime: '', hoursADay: '', }


        });
    }
    /* Hire VA List API*/
    hireVaList() {
        commonService.getAPIWithAccessToken('hire/get-hire-va')
            .then(res => {
                console.log("VA Hire112", res.data.data)
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

        const { loading, hireVaListData, modal, formProccessing, skillList, selectedValues,  formField, filterItem, IndustryList, selectedIndustry } = this.state;
        // console.log("-----ff------", (this.state.selectedValues))
        let loaderElement = '';
        if (loading)
            loaderElement = <Loader />
        const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
        return (
            <div className="animated fadeIn">
                <Row>
                    {loaderElement}
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="mainHeading">
                                <strong> Hire VA List</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle}><i className="fa fa-plus"></i>Add Hire</Button>
                            </CardHeader>
                        </Card>
                    </Col>
                </Row>
                <Col lg={12}>
                    <CardBody>
                        <Row className="filterRow">
                            <Col md={"2"} className="pl-3">
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
                                    <Label htmlFor="filter_choose" >Plan</Label>
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

                    <HireVAData data={hireVaListData} editItemAction={this.handleEditItem} deleteItemAction={this.handleDeleteItem} dataTableLoadingStatus={this.state.loading} />
                    {/* changeNameget={this.state.changeName} */}
                </Col>
                {/* Add Hire VA */}
                <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section store-modal">
                    <ModalHeader title="getTitle" toggle={this.toggle}>Hire VA</ModalHeader>
                    <Form onSubmit={this.submitHandler} noValidate>
                        <ModalBody>
                            <FormErrors formErrors={this.state.formErrors} />
                            <Row>
                                {/* <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="organizationName">OrganizationName</Label>
                                        <Input type="text" placeholder="OrganizationName*" id="organizationName" name="organizationName" value={this.state.formField.organizationName} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col> */}

                                <Col md={"6"}>

                                    {/* <FormGroup>
                                        <Label htmlFor="industry">Industry</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Industry*" id="industry" name="industry" value={this.state.formField.industry} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup> */}

                                    <FormGroup>
                                        <Label htmlFor="industry">Industry1</Label>
                                        <Multiselect
                                            options={IndustryList}
                                            // groupBy="cat"
                                            onChange={this.changeHandler}
                                            onSelect={this.onSelectIndstry}
                                            onRemove={this.onRemoveIndustry}
                                            selectedValues={selectedIndustry}
                                            displayValue="name"
                                            showCheckbox={true}
                                        />
                                        {/* <Input type="select" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Industry*" id="industry" name="industry" value={this.state.formField.industry} onChange={this.changeHandler} required > */}
                                        {/* <option value="">All</option>
                                        <option value="Advertising">Advertising</option>
                                        <option value="AccountingFinance">AccountingFinance</option>
                                        <option value="Apparel">Apparel</option>
                                        <option value="ConstructionArchitectureEngineering">ConstructionArchitectureEngineering</option>
                                        <option value="Design">Design</option>
                                        <option value="Entertainment">Entertainment</option>
                                        <option value="Education">Education</option>
                                        <option value="HealthcareMedical">HealthcareMedical</option>
                                        <option value="HospitalityCatering">HospitalityCatering</option>
                                        <option value="LogisticsAndTransport">LogisticsAndTransport</option>
                                        <option value="Management">Management</option>
                                        <option value="Retail">Retail</option>
                                        <option value="RealEstate">RealEstate</option>
                                        <option value="Telecommunication">Telecommunication</option>
                                        <option value="TravelAndLeisureAndTourism">TravelAndLeisureAndTourism</option>
                                        <option value="Others">Others</option> */}
                                        {/* <option value="">All</option>
                                        <option value="1">Advertising</option>
                                        <option value="2">AccountingFinance</option>
                                        <option value="3">Apparel</option>
                                        <option value="4">ConstructionArchitectureEngineering</option>
                                        <option value="5">Design</option>
                                        <option value="6">Entertainment</option>
                                        <option value="7">Education</option>
                                        <option value="8">HealthcareMedical</option>
                                        <option value="9">HospitalityCatering</option>
                                        <option value="10">LogisticsAndTransport</option>
                                        <option value="11">Management</option>
                                        <option value="12">Retail</option>
                                        <option value="13">RealEstate</option>
                                        <option value="14">Telecommunication</option>
                                        <option value="15">TravelAndLeisureAndTourism</option>
                                        <option value="16">Others</option>
                                        </Input> */}

                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} >
                                        <Label htmlFor="skills">Skills</Label>
                                        {/* <Input type="text" placeholder="Skills *" id="skills" name="skills" value={this.state.formField.skills} onChange={this.changeHandler} required >
                                        </Input> */}
                                        <Multiselect onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }}

                                            options={skillList}
                                            onChange={this.changeHandler}
                                            onSelect={this.onSelect}
                                            onRemove={this.onRemove}
                                            displayValue="skillName"
                                            selectedValues={selectedValues}
                                        />
                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="jobDescreption">Job Descreption</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Job Description*" id="jobDescreption" name="jobDescreption" value={this.state.formField.jobDescreption} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>

                                <Col md={"5"}>
                                    {/* <Row> */}
                                    <FormGroup tag="fieldset">
                                        <FormGroup >
                                            {/* <Label>Choose which plan they want for hourly?</Label></FormGroup> */}
                                            <Label>Plan</Label></FormGroup>
                                        <Label className="radio-inline" htmlFor="entery_Level" ><Input style={{ padding: "20px", marginRight: "5px" }} type="radio" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} id="entery_Level" name="entery_Level" value="entery_Level" checked={this.state.formField.which_plan === 'entery_Level'}
                                            onChange={this.changeRadioButtonHandler} />Entry Level-12$ </Label>{'       '}

                                        <Label className="radio-inline" htmlFor="mid_Level" style={{ marginRight: "10px", }}  ><input type="radio" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} id="mid_Level" name="mid_Level" value="mid_Level" checked={this.state.formField.which_plan === 'mid_Level'} style={{ "marginRight": "5px" }} onChange={this.changeRadioButtonHandler} />Mid Level-15$</Label>{' '}

                                        <Label className="radio-inline" htmlFor="expert_Level"><Input type="radio" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} checked={this.state.formField.which_plan === "expert_Level"} id="expert_Level" name="expert_Level" value="expert_Level" style={{ "marginRight": "5px" }} onChange={this.changeRadioButtonHandler} />Expert Level-20$</Label>

                                        {/* {''} <Input type="radio" value  checked={formField.expert_Level === 'expert_Level'} onChange={this.changeHandler}  value={formField.expert_Level}/> */}
                                    </FormGroup>
                                    {/* </Row> */}
                                </Col>
                                {/* <FormGroup tag="fieldset"> */}
                                {/* <Col md={"6"}> */}
                                {/* <FormGroup> */}
                                {/* <Label htmlFor="which_plan">Choose Plan</Label> */}
                                {/* <Input type="select" name="which_plan" id="which_plan" value={this.state.formField.which_plan} onChange={this.changeHandler} required > */}
                                {/* <SetOrganizationDropDownItem key={index} organizationInfo={organizationInfo} /> */}
                                {/* <option value="">Select</option> */}
                                {/* <option value={this.state.formField.which_plan ='' ? "Entry Level":`${this.state.formField.which_plan}`}>Entry Level</option>
                                            <option value={this.state.formField.which_plan ='' ? "Mid Level":`${this.state.formField.which_plan}`}>Mid Level</option>
                                            <option value={this.state.formField.which_plan ='' ? "Expert Level":`${this.state.formField.which_plan}`}>Expert Level</option> */}
                                {/* <option value="Entry Level-12$">Entry Level</option>
                                            <option value="Mid Level-15$">Mid Level</option>
                                            <option value="Expart Level-20$">Expert Level</option> */}
                                {/* </Input> */}
                                {/* </FormGroup> */}
                                {/* </Col> */}

                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="quickly_Need">Need</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="quickly_Need *" id="quickly_Need" name="quickly_Need" value={this.state.formField.quickly_Need} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="which_Days_Week">Weekdays</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Weekdays *" id="which_Days_Week" name="which_Days_Week" value={this.state.formField.which_Days_Week} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="during_Those_Days">Required Time</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Required Time *" id="during_Those_Days" name="during_Those_Days" value={this.state.formField.during_Those_Days} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="Hours_A_Day">Hours A Day</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Hours_A_Day *" id="Hours_A_Day" name="Hours_A_Day" value={this.state.formField.Hours_A_Day} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>
                                <Col md={"6"}>
                                    <FormGroup>
                                        <Label htmlFor="Days_A_Week">Days A Week</Label>
                                        <Input type="text" onKeyPress={(e) => { e.key === 'Enter' && e.preventDefault(); }} placeholder="Days_A_Week *" id="Days_A_Week" name="Days_A_Week" value={this.state.formField.Days_A_Week} onChange={this.changeHandler} required >
                                        </Input>
                                    </FormGroup>
                                </Col>

                            </Row>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Submit'}</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>
        );
    }
}

function SetSkillDropDownItem(props) {
    const skillInfo = props.skillInfo;
    return (<option value={skillInfo.skillName} >{skillInfo.skillName}</option>)
}

export default HireVA_Listing;