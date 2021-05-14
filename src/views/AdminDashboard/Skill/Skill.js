import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';
import SkillData from './SkillData';
import './Skill.css'

class Skill extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      skill_name: "",
      skillList: [],
      loading: true,
      rowIndex: -1,
      formErrors: {skill_name: '', error: ''},
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
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('skill')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }   
          this.setState({loading:false, skillList: res.data.data});              
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else {
            this.setState( { loading: false } );
            toast.error(err.message);    
          }
        } )
    } )
  }
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    const formData = {
      "skillName": this.state.skill_name
    }
    
    this.setState( { loading: true}, () => {
      if(this.state.rowIndex > -1){
        /* Update Category */
        const skillId = this.state.skillList[this.state.rowIndex].skillId;
        formData['skillId'] = skillId;
        commonService.putAPIWithAccessToken( `skill`, formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState({loading: false});   
              toast.error(res.data.message);             
              return;
            } 
            let updatedCategoryLists = this.state.skillList;
            updatedCategoryLists[this.state.rowIndex] = res.data.data;
            this.setState({modal: false, rowIndex: "", loading:false});
            toast.success(res.data.message);    
            this.SkillList();
          } )
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else {
              this.setState( { loading: false } );
              toast.error(err.message);    
            }
          } )
      }
      else{
         /* Add Skill */
        commonService.postAPIWithAccessToken( `skill`, formData)
          .then( res => {          
            let formErrors = this.state.formErrors;
            formErrors.error = '';
            if ( undefined === res.data.data || !res.data.status ) { 
              this.setState({loading: false});           
              toast.error(res.data.message);             
              return;
            }            
            this.setState({modal: false, loading: false});
            toast.success(res.data.message); 
            this.SkillList();
          } )
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else{
              this.setState( { loading: false } );
              toast.error(err.message); 
            }
          } )
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
    let skill_name_valid = this.state.skill_name_valid; 
    switch(fieldName) {         
      case 'skill_name':
        skill_name_valid = (value !== '') ? true : false;
        fieldValidationErrors.skill_name = skill_name_valid ? '' : ' is required';
        break;              
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                  skill_name_valid: skill_name_valid,                   
                  }, this.validateForm);
  }
  /* Validate Form */
  validateForm() {
    this.setState({formValid: this.state.skill_name_valid});
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      skill_name: "",
      rowIndex: -1,
      formValid: false
    });
  }

  /* Edit Skill*/
  handleEditCategory(rowIndex){
      const categoryItem = this.state.skillList[rowIndex];
      this.setState({modal: true, skill_name: categoryItem.skillName, rowIndex: rowIndex, formValid: true});
  }

  /* Delete Skill */
  handleDeleteCategory(rowIndex){
   
    const skillItem = this.state.skillList[rowIndex];
   
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `skill/`+skillItem.skillId)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          toast.success(res.data.message);
          this.SkillList();
        } )
        .catch( err => {       
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { loading: false } );
            toast.error(err.message);
          }
      } )
    })
  }

  render() {

    const { skillList, loading, modal  } = this.state;     
    let loaderElement ='';
    if(loading)
      loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row>
          
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardHeader className="mainHeading">
                <strong>Manage Skills</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle} title="Add New Skill"><i className="fa fa-plus"></i> Add Skill</Button>
              </CardHeader>
              <CardBody>                
                <SkillData data={skillList} editCategoryAction={this.handleEditCategory} deleteCategoryAction={this.handleDeleteCategory} dataTableLoadingStatus = {this.state.loading} />
                  
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="category-modal-section">
          <ModalHeader toggle={this.toggle}>Skill</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <FormGroup> 
                <Label htmlFor="skill_name">Skill Name *</Label>            
                <Input type="text" placeholder="Skill Name" id="skill_name" name="skill_name" value={this.state.skill_name} onChange={this.changeHandler} required />
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

export default Skill;
