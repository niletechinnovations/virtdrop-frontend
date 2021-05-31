import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';
import ManageAreaData from './ManageAreaData';
import './Skill.css'

class ManageArea extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            area_name: "",
            skillList: [],
            loading: true,
            rowIndex: -1,
            formErrors: {  area_name:'', skill_name: '', error: '' },
            skill_name_valid: false,
            formValid: false,

        }
        this.handleEditCategory = this.handleEditCategory.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
    }

    // Fetch the Skill List
    componentDidMount() {
        this.SkillList();
    }

    /*Skill List API*/
    SkillList() {
        this.setState({ loading: true }, () => {
            commonService.getAPIWithAccessToken('skill/get-area')
                .then(res => {
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    this.setState({ loading: false, skillList: res.data.data });
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
    submitHandler(event) {
        event.preventDefault();
        event.target.className += " was-validated";
        const formData = {
            "AreaName": this.state.area_name
        }

        this.setState({ loading: true }, () => {
            if (this.state.rowIndex > -1) {
                /* Update Category */
                const skillId = this.state.skillList[this.state.rowIndex].skillId;
                formData['skillId'] = skillId;
                commonService.putAPIWithAccessToken(`skill`, formData)
                    .then(res => {
                        if (undefined === res.data.data || !res.data.status) {
                            this.setState({ loading: false });
                            toast.error(res.data.message);
                            return;
                        }
                        let updatedCategoryLists = this.state.skillList;
                        updatedCategoryLists[this.state.rowIndex] = res.data.data;
                        this.setState({ modal: false, rowIndex: "", loading: false });
                        toast.success(res.data.message);
                        this.SkillList();
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
            }
            else {
                /* Add Skill */
                commonService.postAPIWithAccessToken(`skill/area`, formData)
                    .then(res => {
                        let formErrors = this.state.formErrors;
                        formErrors.error = '';
                        if (undefined === res.data.data || !res.data.status) {
                            this.setState({ loading: false });
                            toast.error(res.data.message);
                            return;
                        }
                        this.setState({ modal: false, loading: false });
                        toast.success(res.data.message);
                        this.SkillList();
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
            }
        })
    };
    /* Input Field On changes*/
    changeHandler = event => {
        const name = event.target.name;
        const value = event.target.value
        this.setState({ [name]: value },
            () => { this.validateField(name, value) });
    };

    /* Validate Form Field */
    validateField(fieldName, value) {
        let fieldValidationErrors = this.state.formErrors;
        fieldValidationErrors.error = '';
        let area_name_valid = this.state.area_name_valid;
        switch (fieldName) {
            case 'area_name':
                area_name_valid = (value !== '') ? true : false;
                fieldValidationErrors.area_name = area_name_valid ? '' : ' is required';
                break;
            default:
                break;
        }
        this.setState({
            formErrors: fieldValidationErrors,
            area_name_valid: area_name_valid,
        }, this.validateForm);
    }
    /* Validate Form */
    validateForm() {
        this.setState({ formValid: this.state.area_name_valid });
    }
    /* Set Error Class*/
    errorClass(error) {
        return (error.length === 0 ? '' : 'has-error');
    }

    toggle = () => {
        this.setState({
            modal: !this.state.modal,
            area_name: "",
            rowIndex: -1,
            formValid: false
        });
    }

    /* Edit Skill*/
    handleEditCategory(rowIndex) {
        const categoryItem = this.state.skillList[rowIndex];
        // console.log("categoryItem",categoryItem)
        this.setState({ modal: true, area_name: categoryItem.AreaName, rowIndex: rowIndex, formValid: true });
    }

    /* Delete Skill */
    handleDeleteCategory(rowIndex) {

        const areaItem = this.state.skillList[rowIndex];
        console.log("areaItem",areaItem)

        this.setState({ loading: true }, () => {
            commonService.deleteAPIWithAccessToken(`skill/del/` + areaItem.AreaId)
                .then(res => {
                    this.setState({ loading: false });
                    if (undefined === res.data || !res.data.status) {
                        toast.error(res.data.message);
                        return;
                    }
                    toast.success(res.data.message);
                    this.SkillList();
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

    render() {

        const { skillList, loading, modal } = this.state;
        let loaderElement = '';
        if (loading)
            loaderElement = <Loader />

        return (
            <div className="animated fadeIn">
                <Row>

                    {loaderElement}
                    <Col lg={12}>
                        <Card>
                            <CardHeader className="mainHeading">
                                <strong>Manage Area</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle} title="Add New Area"><i className="fa fa-plus"></i> Add Area</Button>
                            </CardHeader>
                            <CardBody>
                                <ManageAreaData data={skillList} editCategoryAction={this.handleEditCategory} deleteCategoryAction={this.handleDeleteCategory} dataTableLoadingStatus={this.state.loading} />

                            </CardBody>
                        </Card>
                    </Col>
                </Row>
                <Modal isOpen={modal} toggle={this.toggle} className="category-modal-section">
                    <ModalHeader toggle={this.toggle}>Area</ModalHeader>
                    <Form onSubmit={this.submitHandler} noValidate>
                        <ModalBody>
                            <FormErrors formErrors={this.state.formErrors} />
                            <FormGroup>
                                <Label htmlFor="area_name">Area Name *</Label>
                                <Input type="text" placeholder="Area Name" id="area_name" name="area_name" value={this.state.area_name} onChange={this.changeHandler} required />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" disabled={!this.state.formValid} type="submit">Submit</Button>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Form>
                </Modal>
            </div>

        )
    }

}
export default ManageArea;