import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';
// import  '../../../../containers/AdminLayout/AdminLayout.css'

class ViewHireVA_List extends Component {
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
            hireVARequestId: '',
            selectedIndustry: [],
            // selectedValues1:[],
            rowIndex: -1,
            formField: {
                // loading: true,
                // hireVaListData: [],
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
                clientCompleteName: '',
                _id: '',
                status: ''
            },

            formErrors: { authId: '', modal: false, industry: '', skills: [], which_plan: '', quickly_Need: '', weekdays: '', requiredTime: '', hoursADay: '', }

        }

    }

    componentDidMount() {
        const { match: { params } } = this.props;
        if (params.hireVARequestId !== undefined && params.hireVARequestId !== "") {
            this.setState({ hireVARequestId: params.hireVARequestId });
            this.getHireVARequest(params.hireVARequestId);
        } else
            this.props.history.push('/admin/hire-va-request');
        // this.itemList();
        // getHireVARequest()
    }

    getHireVARequest(hireVARequestId) {
        this.setState({ loading: true }, () => {
            commonService.getAPIWithAccessToken('hire/hire-va-request/' + hireVARequestId)
                .then(res => {
                    // console.log("VIEW-----------",res)
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    const currentDate = new Date(res.data.data.createdAt);
                    var date = currentDate.getDate();
                    var month = currentDate.getMonth();
                    var year = currentDate.getFullYear();
                    var monthDateYear = (month + 1) + "/" + date + "/" + year;

                    const itemInfo = res.data.data;
                        // console.log("industrytype",itemInfo.industrytype)
                    const formField = {
                        getIndustryName:itemInfo.industrytype,
                        clientCompleteName: itemInfo.firstName + " " + itemInfo.lastName,
                        // clientCompleteName:itemInfo.clientCompleteName,
                        organizationName: itemInfo.organizationName,
                        jobDescreption: itemInfo.jobDescreption,
                        authId: itemInfo.authId,
                        // industry: itemInfo.industry,
                        industry:itemInfo.industrytype,
                        which_plan: itemInfo.which_plan,
                        which_Days_Week: itemInfo.which_Days_Week,
                        Hours_A_Day: itemInfo.Hours_A_Day,
                        Days_A_Week: itemInfo.Days_A_Week,
                        skillsFreelancer: itemInfo.skillsFreelancer,
                        quickly_Need: itemInfo.quickly_Need,
                        during_Those_Days: itemInfo.during_Those_Days,
                        _id: itemInfo._id,
                        status: itemInfo.status,
                        role: itemInfo.role,
                        createdAt: monthDateYear,
                    };
                    this.setState({ hireVARequestId: hireVARequestId, clientId: itemInfo.authId, formField: formField, modal: true, loading: false, formValid: true });

                })
                .catch(err => {
                    if (err.response !== undefined && err.response.status === 401) {
                        localStorage.clear();
                        this.props.history.push('/login');
                    } else
                        this.setState({ loading: false });
                    toast.error(err.message);
                })
        });
    }

    render() {
        return (
            <div >
                <Row>
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="mainHeading">
                                <strong> Hire VA List</strong>

                            </CardHeader>
                            <CardBody>
                                <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}
                                >Go Back</button>
                                <div className="form-service-listing">
                                    <h2> VA Hire Information:</h2>
                                    <Row>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="industry">Industry </Label>
                                                <Input type="text" name="industry" id="industry" value={this.state.formField.industry} onChange={this.changeHandler} placeholder="Industry" readOnly />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="organizationName">Organization </Label>
                                                <Input type="text" name="organizationName" id="organizationName" value={this.state.formField.organizationName} onChange={this.changeHandler} placeholder="Organization Name" readOnly />
                                            </FormGroup>
                                        </Col> */}
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="which_plan">Which Plan </Label>
                                                <Input type="text" name="which_plan" id="which_plan" value={this.state.formField.which_plan} onChange={this.changeHandler} placeholder="Which Plan" readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="which_Days_Week">Week Days </Label>
                                                <Input type="text" name="which_Days_Week" id="which_Days_Week" value={this.state.formField.which_Days_Week} onChange={this.changeHandler} placeholder="Organization Name" readOnly />
                                            </FormGroup>
                                        </Col><Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="Hours_A_Day">Hours A Day </Label>
                                                <Input type="text" name="Hours_A_Day" id="Hours_A_Day" value={this.state.formField.Hours_A_Day} onChange={this.changeHandler} placeholder="Hours A Day" readOnly />
                                            </FormGroup>
                                        </Col><Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="skillsFreelancer">Skills </Label>
                                                <Input type="text" name="skillsFreelancer" id="skillsFreelancer" value={this.state.formField.skillsFreelancer} onChange={this.changeHandler} placeholder="SKills" readOnly />
                                            </FormGroup>
                                        </Col><Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="quickly_Need">Need </Label>
                                                <Input type="text" name="quickly_Need" id="quickly_Need" value={this.state.formField.quickly_Need} onChange={this.changeHandler} placeholder="Need" readOnly />
                                            </FormGroup>
                                        </Col><Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="during_Those_Days">Required Time </Label>
                                                <Input type="text" name="during_Those_Days" id="during_Those_Days" value={this.state.formField.during_Those_Days} onChange={this.changeHandler} placeholder="Required Time" readOnly />
                                            </FormGroup>
                                        </Col><Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="status">Status </Label>
                                                <Input type="text" name="status" id="status" value={this.state.formField.status} onChange={this.changeHandler} placeholder="Status" readOnly />
                                            </FormGroup>
                                        </Col>
                                        {/* <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="role">Role </Label>
                                                <Input type="text" name="role" id="role" value={this.state.formField.role} onChange={this.changeHandler} placeholder="Role" readOnly />
                                            </FormGroup>
                                        </Col> */}
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="clientCompleteName">Submitted By </Label>
                                                <Input type="text" name="clientCompleteName" id="clientCompleteName" value={this.state.formField.clientCompleteName} onChange={this.changeHandler} placeholder="Submitted By" readOnly />
                                            </FormGroup>
                                        </Col>
                                        <Col md={6}>
                                            <FormGroup>
                                                <Label htmlFor="createdAt">Created At </Label>
                                                <Input type="text" name="createdAt" id="createdAt" value={this.state.formField.createdAt} onChange={this.changeHandler} placeholder="Created At" readOnly />
                                            </FormGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default ViewHireVA_List
