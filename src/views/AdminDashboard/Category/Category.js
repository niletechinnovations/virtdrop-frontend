import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Button, Form, Input, FormGroup, Label, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';

import Loader from '../../Loader/Loader';
import { FormErrors } from '../../Formerrors/Formerrors';
import CategoryData from './CategoryData';
import './Category.css'

class Category extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      category_name: "",
      categoryList: [],
      categoryImage: null,
      categoryImageUrl: "",
      loading: true,
      rowIndex: -1,
      formErrors: {category_name: '', category_image: '', error: ''},
      category_name_valid: false,
      formValid: false,

    } 
    this.handleEditCategory = this.handleEditCategory.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteCategory = this.handleDeleteCategory.bind(this);
  }

  // Fetch the category List
  componentDidMount() { 
    this.categoryList();
  }
  /*Category List API*/
  categoryList() {
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('category')
        .then( res => {
          console.log(res);
           
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }   

          this.setState({loading:false, categoryList: res.data.data});     
         
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else {
            this.setState( { loading: false } );
            toast.error(err.message);    
          }
        } )
    } )
  }
  submitHandler (event) {
    event.preventDefault();
    event.target.className += " was-validated";
    let formData = new FormData(); 
    
    if(this.state.categoryImage !=="" && this.state.categoryImage !== undefined && this.state.categoryImage !== null) {
      if(this.state.categoryImage.type !== "image/png" && this.state.categoryImage.type !== "image/jpeg" && this.state.categoryImage.type !== "image/jpg" && this.state.categoryImage.type !== "image/svg") {
        return false;
      }
      formData.append('filename',this.state.categoryImage);
    }
    formData.append('categoryName', this.state.category_name);
    this.setState( { loading: true}, () => {
      if(this.state.rowIndex > -1){
        /* Update Category */
        const categoryId = this.state.categoryList[this.state.rowIndex].categoryId;
        formData.append('categoryId', categoryId);
        
        commonService.putAPIWithAccessToken( `category`, formData)
          .then( res => {
            console.log(res);
           
            
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState({loading: false});   
              toast.error(res.data.message);             
              return;
            } 
            let updatedCategoryLists = this.state.categoryList;
            updatedCategoryLists[this.state.rowIndex] = res.data.data;
            this.setState({modal: false, rowIndex: "", loading:false});
            toast.success(res.data.message);    
            this.categoryList();
          } )
          .catch( err => {       
              
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }
            else {
              this.setState( { loading: false } );
              toast.error(err.message);    
            }
          } )
       
      }
      else{
         /* Add Category */
        commonService.postAPIWithAccessToken( `category`, formData)
          .then( res => {
            console.log(res);
           
            let formErrors = this.state.formErrors;
            formErrors.error = '';
            if ( undefined === res.data.data || !res.data.status ) { 
              this.setState({loading: false});           
              toast.error(res.data.message);             
              return;
            }            
            this.setState({modal: false, loading: false});
            toast.success(res.data.message); 
            this.categoryList();
          } )
          .catch( err => {
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }
            else{
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
    let category_name_valid = this.state.category_name_valid; 
    switch(fieldName) {         
      case 'category_name':
        category_name_valid = (value !== '') ? true : false;
        fieldValidationErrors.category_name = category_name_valid ? '' : ' is required';
        break;              
      default:
        break;
    }
    this.setState({formErrors: fieldValidationErrors,
                    category_name_valid: category_name_valid,                   
                  }, this.validateForm);
  }
  /* Validate Form */
  validateForm() {
    this.setState({formValid: this.state.category_name_valid});
  }
  /* Set Error Class*/
  errorClass(error) {
    return(error.length === 0 ? '' : 'has-error');
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      category_name: "",
      rowIndex: -1,
      formValid: false
    });
  }
  /* File changes handler*/
  changeFileHandler = event => {   
    const targetFile = event.target.files[0];
    let formErrors = this.state.formErrors;
    formErrors.category_image = "";
    
    if(targetFile.type !== "image/png" && targetFile.type !== "image/jpeg" && targetFile.type !== "image/jpg" && targetFile.type !== "image/svg") {
      formErrors.category_image = " accept only png, jpeg, jpg";
      this.setState({ categoryImage: targetFile, formErrors: formErrors  });
    }
    else
      this.setState({ categoryImage: targetFile, formErrors: formErrors  });
  };

  /* Edit Category*/
  handleEditCategory(rowIndex){
   
      const categoryItem = this.state.categoryList[rowIndex];
      
      this.setState({modal: true, category_name: categoryItem.categoryName, rowIndex: rowIndex, formValid: true});
  }
  /* Add category */
  handleDeleteCategory(rowIndex){
   
    const categoryItem = this.state.categoryList[rowIndex];
   
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `category/`+categoryItem.categoryId)
        .then( res => {
          this.setState({loading: false});
          if ( undefined === res.data || !res.data.status ) {            
             toast.error(res.data.message);      
            return;
          }         
          
          toast.success(res.data.message);
          this.categoryList();
        } )
        .catch( err => {       
            
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else{
            this.setState( { loading: false } );
            toast.error(err.message);
          }
      } )
    })
  }

  render() {

    const { categoryList, loading, modal  } = this.state;     
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
                <strong>Manage Cuisine</strong> <Button color="primary" className="categoryAdd" type="button" onClick={this.toggle} title="Add New Cuisine"><i className="fa fa-plus"></i> Add Cuisine</Button>
              </CardHeader>
              <CardBody>                
                <CategoryData data={categoryList} editCategoryAction={this.handleEditCategory} deleteCategoryAction={this.handleDeleteCategory} dataTableLoadingStatus = {this.state.loading} />
                  
              </CardBody>
            </Card>
          </Col>
        </Row>
        <Modal isOpen={modal} toggle={this.toggle} className="category-modal-section">
          <ModalHeader toggle={this.toggle}>Cuisine</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate>
            <ModalBody>
              <FormErrors formErrors={this.state.formErrors} />
              <FormGroup> 
                <Label htmlFor="category_name">Cuisine Name</Label>            
                <Input type="text" placeholder="Cuisine Name *" id="category_name" name="category_name" value={this.state.category_name} onChange={this.changeHandler} required />
              </FormGroup>
              <FormGroup>      
                <Label htmlFor="categoryImage">Upload Image</Label>            
                <Input type="file" placeholder="File *" id="categoryImage" name="categoryImage" onChange={this.changeFileHandler} accept=".png,.jpg,.jpeg,.svg"/>
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

export default Category;
