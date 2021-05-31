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
      skill_id:'',
      area_name:'',
      area_id:'',
      skillList: [],
      area_name:[],
      loading: true,
      rowIndex: -1,
      formErrors: {skill_name: '', skill_id: '', area_name: '', area_id:'', error: ''},
      skill_name_valid: false,
      skill_id_valid:false,
      area_name_valid:false,
      area_id_valid:false,
      
      formValid: false,

    } 
    this.handleEditCategory = this.handleEditCategory.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
  }

  // Fetch the Skill List
  componentDidMount() { 
    this.SkillList();
    this.AreaList();
  }

  /*Skill List API*/
  SkillList() {  
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('skill/get-new-skill')
        .then( res => {
          // console.log("Skillll",res)
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

  // Area List
  /*Skill List API*/
  AreaList() {  
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('skill/get-area')
        .then( res => {
          // console.log("Skillll",res)
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }   
          this.setState({loading:false, areaList: res.data.data});              
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
      "profileName" : this.state.skill_name,
      "id": this.state.skill_id,
      "parentName" : this.state.area_name,
      "parentId": this.state.area_id
    }
    
    this.setState( { loading: true}, () => {
      if(this.state.rowIndex > -1){
        /* Update Category */
        // const skillId = this.state.skillList[this.state.rowIndex].skillId;
        const skillId = this.state.skillList[this.state.rowIndex].skillId;
     
        commonService.putAPIWithAccessToken( `skill`, formData)
          .then( res => {
            // console.log("Put Update",res)
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState({loading: false});   
              toast.error(res.data.message);             
              return;
            } 
            // let updatedCategoryLists = this.state.skillList;
            // console.log("updatedCategoryLists",updatedCategoryLists)
            // updatedCategoryLists[this.state.rowIndex] = res.data.data;
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
    let skill_id_valid = this.state.skill_id_valid; 
    let area_name_valid = this.state.area_name_valid; 
    let area_id_valid = this.state.area_id_valid; 
    switch(fieldName) {    
      case 'area_name':
        area_name_valid = (value !== '') ? true : false;
        fieldValidationErrors.area_name = area_name_valid ? '' : ' is required';

        case 'area_id':
          area_id_valid = (value !== '') ? true : false;
          fieldValidationErrors.area_id = area_id_valid ? '' : ' is required';

      case 'skill_name':
        skill_name_valid = (value !== '') ? true : false;
        fieldValidationErrors.skill_name = skill_name_valid ? '' : ' is required';

        case 'skill_id':
        skill_id_valid = (value !== '') ? true : false;
        fieldValidationErrors.skill_id = skill_id_valid ? '' : ' is required';
  
        break;              
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                  skill_name_valid: skill_name_valid,  
                  skill_id_valid: skill_id_valid, 
                  area_name_valid: area_name_valid, 
                  area_id_valid: area_id_valid,                  
                  }, this.validateForm);
  }
  /* Validate Form */
  validateForm() {
    this.setState({formValid: this.state.skill_name_valid, formValid: this.state.skill_id_valid, formValid: this.state.area_name_valid, formValid:this.state.area_id_valid });
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      skill_name: "",
      skill_id:"",
      area_name:"",
      area_id:"",
      rowIndex: -1,
      formValid: false
    });
  }

  /* Edit Skill*/
  handleEditCategory(rowIndex){
    console.log("rowIndexrowIndexrowIndex",rowIndex)
      const categoryItem = this.state.skillList[rowIndex];
      console.log("categoryItem222222",categoryItem.vADesignation[0])
      this.setState({modal: true, area_name:categoryItem.parentName, area_id:categoryItem.parentId, skill_id:categoryItem.vADesignation[0].id, skill_name: categoryItem.vADesignation[0].profileName, rowIndex: rowIndex, formValid: true});
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
                {/* <strong>Manage Skills</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle} title="Add New Skill"><i className="fa fa-plus"></i> Add Skill</Button> */}
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
              <Col  md="12" sm="3">
              {/* <Row > */}
              <FormGroup> 
                
                <Label htmlFor="area_name">Area Name *</Label>            
                <Input type="text" placeholder="Area Name" id="area_name" name="area_name" value={this.state.area_name} onChange={this.changeHandler} required />
              </FormGroup>
              {/* <FormGroup> 
                <Label htmlFor="area_id">Area Id *</Label>            
                <Input type="text" placeholder="Area Id" id="area_id" name="area_id" value={this.state.area_id} onChange={this.changeHandler} required />
              </FormGroup> */}
              {/* </Row> */}
              </Col>
              <Col >
              {/* <Row> */}
              <FormGroup> 
                <Label htmlFor="skill_name">Skill Name *</Label>            
                <Input type="text" placeholder="Skill Name" id="skill_name" name="skill_name" value={this.state.skill_name} onChange={this.changeHandler} required />
              </FormGroup>
              {/* <FormGroup> 
                <Label htmlFor="skill_id">Skill Id *</Label>            
                <Input type="text" placeholder="Skill Id" id="skill_id" name="skill_id" value={this.state.skill_id} onChange={this.changeHandler} required />
              </FormGroup> */}
              {/* </Row> */}
              </Col>
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
