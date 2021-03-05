import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button, FormGroup, Form, Input, Label, Card, Row, Col, CardBody } from 'reactstrap';
import CardHeader from 'reactstrap/lib/CardHeader';
import commonService from '../../../core/services/commonService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Multiselect } from 'multiselect-react-dropdown';


export class hireVA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formField: { industry: '', skillsFreelancer: [], jobDescreption: '', Hours_A_Day: '', Days_A_Week: '', which_Days_Week: '', during_Those_Days: '', quickly_Need: '', which_plan: '' },
            loading: false,
            skillList: [],
            selectedValues: [],
            options: [{ skillName: 'Srigar', skillid: 1 }, { skillName: 'Sam', skillid: 2 }]
        };
        this.submitHandler = this.submitHandler.bind(this);
        this.changeHandler = this.changeHandler.bind(this);
        this.changeRadioButtonHandler = this.changeRadioButtonHandler.bind(this);
        this.onSelect = this.onSelect.bind(this)
        this.onRemove = this.onRemove.bind(this);
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
                if (error !== undefined && error.response.status === 401) {
                    localStorage.clear()
                    this.props.histroy.push('/login')
                } else {
                    this.setState({ loading: false, })
                    toast.error(error.message)
                }
            })
    }

    componentDidMount() {
        //this.getProfile();
        this.getSkillList();
       console.log( localStorage.getItem("userName"),"Get Name")

    }

    onSelect(selectedList, selectedItem) {
        this.setState({ selectedValues: selectedList.map(item => item.skillName) })
        // this.setState({ selectedValues: selectedList.map(item => item.skillId) })
        // console.log("ADD",this.state.selectedValues)

    }

    onRemove(selectedList, removedItem) {
        this.setState({ selectedValues: selectedList.filter((item) => (item.skillName !== removedItem.skillName)).map(skill => skill.skillName) })
        // this.setState({ selectedValues: selectedList.filter((item) => (item !== item.removedItem)).map(skill => skill.skillId) })
        // console.log("REMOVE",this.state.selectedValues)
    }

    
    /* Submit Form Handler*/
    submitHandler(event) {
        event.preventDefault();
        event.target.className += " was-validated";
        this.setState({ loading: true }, () => {
            const formInputField = this.state.formField;
            
            const formData = {
                "industry": formInputField.industry,
                // "skillsFreelancer": formInputField.skillsFreelancer,
                "skillsFreelancer": this.state.selectedValues,
                "jobDescreption": formInputField.jobDescreption,
                "Hours_A_Day": formInputField.Hours_A_Day,
                "Days_A_Week": formInputField.Days_A_Week,
                "which_Days_Week": formInputField.which_Days_Week,
                "during_Those_Days": formInputField.during_Those_Days,
                "quickly_Need": formInputField.quickly_Need,
                "which_plan": formInputField.which_plan,
            };
            // console.log("formData",formData.skillsFreelancer)
            commonService.postAPIWithAccessToken('hire/hire-va/', formData)
                .then(res => {
                    // console.log("Ressssss", res)
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    this.setState({ loading: false });
                    this.props.history.push('/user/hire-va');
                    
                    toast.success(res.data.message);
                    // setTimeout(() => {
                    //     window.location.reload(false);
                    // }, 4000);
                   
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

    // Handle Input fields
    changeHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        const formField = this.state.formField
        formField[name] = value;
        this.setState({ formField: formField })
        //   () => { this.validateField(name, value) });
        //console.log(this.state.formValid);

    }
    changeRadioButtonHandler(event) {
        const name = event.target.name;
        const value = event.target.value;
        const formField = this.state.formField
        formField.which_plan = value;
        this.setState({ formField: formField })
    }

    render() {

        const { loading, formField, skillList } = this.state;
        return (
            <div className="dashboard-section container" style={{ paddingRight: '230px' }}>
                <Card className="vd-card ">
                    <CardHeader>
                        <div className="d-flex align-items-center ">
                            <div className="mr-auto">
                                <h4 className="card-title"><img src="/images/hire-a-helper-brands.svg" height="30" style={{ margin: "4px", width: "10%" }} alt="" />Hire VA</h4>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody>
                        <Form className="profile-form " onSubmit={this.submitHandler}>
                            <Row>
                                <Col md={"10"}>
                                    <FormGroup>
                                        <Label htmlFor="industry"> Industry You'r In </Label>
                                        <Input type="text" name="industry" id="industry" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>
                                {/* Demo */}
                                <Col md={"10"}>
                                    <FormGroup>
                                        <Multiselect

                                            options={skillList} // Options to display in the dropdown
                                            onSelect={this.onSelect} // Function will trigger on select event
                                            onRemove={this.onRemove} // Function will trigger on remove event
                                            displayValue="skillName" // Property name to display in the dropdown options
                                        />
                                    </FormGroup>
                                </Col>
                                {/* <Col md={"10"}>
                                    <FormGroup>
                                    
                                        <Label htmlFor="skillsFreelancer"> Skills freelancer needs to have</Label>
                                        <Input type="select" name="skillsFreelancer" id="skillsFreelancer" onChange={this.changeHandler} maxLength="222" required >
                                            <option>Select*</option>
                                            {
                                                skillList.map((skill, index) =>
                                                    <option key={skill.skillId} value={skill.skillId}>{skill.skillName}</option>
                                                )
                                            }
                    
                                        </Input>
                                    </FormGroup>
                                </Col> */}
                                <Col md={"10"}>
                                    <FormGroup>
                                        <Label htmlFor="jobDescreption"> Description Of job - Options to record</Label>
                                        <Input type="textarea" name="jobDescreption" id="jobDescreption" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>
                                <Col md={"5"}>
                                    <FormGroup>
                                        <Label htmlFor="Hours_A_Day">How many hrs a day ?</Label>
                                        <Input type="text" name="Hours_A_Day" id="Hours_A_Day" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>
                                <Col md={"5"}>
                                    <FormGroup>
                                        <Label htmlFor="Days_A_Week">How many days a week ?</Label>
                                        <Input type="text" name="Days_A_Week" id="Days_A_Week" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>

                                <Col md={"5"}>
                                    <FormGroup>
                                        <Label htmlFor="which_Days_Week">Which days of the week ?</Label>
                                        <Input type="text" name="which_Days_Week" id="which_Days_Week" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>

                                <Col md={"5"}>
                                    <FormGroup>
                                        <Label htmlFor="during_Those_Days">What time during those days?</Label>
                                        <Input type="text" name="during_Those_Days" id="during_Those_Days" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>
                                {/* <Label htmlFor="Days_A_Week">Choose which plan they want for hourly?</Label> */}
                                <Col md={"5"}>
                                    {/* <Row> */}
                                    <FormGroup tag="fieldset">
                                        <FormGroup >
                                            <Label>Choose which plan they want for hourly?</Label></FormGroup>
                                        <Label className="radio-inline" htmlFor="entery_Level" style={{ marginRight: "10px" }}><input type="radio" id="entery_Level"checked={formField.which_plan === 'entery_Level'} value="entery_Level" style={{ "marginRight": "5px" }}
                                            onChange={this.changeRadioButtonHandler} />Entry Level-12$ </Label>{''}

                                        <Label className="radio-inline" htmlFor="mid_Level" style={{ "marginRight": "10px" }}  ><input type="radio" id="mid_Level" checked={formField.which_plan === 'mid_Level'}  value="mid_Level" style={{ "marginRight": "5px" }} onChange={this.changeRadioButtonHandler} />Mid Level-15$</Label>{' '}

                                        <Label className="radio-inline" htmlFor="expert_Level"><input type="radio" checked={formField.which_plan === "expert_Level"} id="expert_Level" value="expert_Level" style={{ "marginRight": "5px" }} onChange={this.changeRadioButtonHandler} />Expert Level-20$</Label>
                                        

                                        {/* {''} <Input type="radio" value  checked={formField.expert_Level === 'expert_Level'} onChange={this.changeHandler}  value={formField.expert_Level}/> */}
                                    </FormGroup>
                                    {/* </Row> */}
                                </Col>
                                <Col md={"5"}>
                                    <FormGroup>
                                        <Label htmlFor="quickly_Need">How quickly do you need someone?</Label>
                                        <Input type="text" name="quickly_Need" id="quickly_Need" onChange={this.changeHandler} required />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <div className="form-group pull-right">
                                <Button color="danger">Cancel</Button>{' '}
                                <Button color="primary">Submit</Button>
                            </div>
                        </Form>
                    </CardBody>
                </Card>
            </div>
        )
    }
}

export default hireVA;
