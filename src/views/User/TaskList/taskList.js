import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label,
  Modal, ModalHeader, ModalBody, ModalFooter, 
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import ReactDragListView from 'react-drag-listview/lib/index.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./taskList.css";

class taskList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      vaLists: [],
      formProccessing: false,
      loading: false,
      rowIndex: -1,
      formField: { taskId: '', vaAuthId: '', projectId: '', title: '', description:'', completionTime:'', dueDate:'' },
      filterItem: { filterProjectId:'', filterTitle: '', filterCompletionTime:'',  filterFrom:'',  filterTo:''}
    } 
    this.filterItemList = this.filterItemList.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleEditData = this.handleEditData.bind(this);
    this.handleDeleteData = this.handleDeleteData.bind(this);
    this.dragRowItem = this.dragRowItem.bind(this);
  }

  componentDidMount() {
    const { match: { params } } = this.props;    
    if(params.vaAuthId !== undefined && params.vaAuthId !=="") {
      const formField = this.state.formField
      formField.vaAuthId =  params.vaAuthId;
      this.setState({ formField: formField });
    }        
    this.itemLists({});
    this.vaListItem({});
  }

  /* Task List API */
  itemLists(filterItem = {}) {
    let filterQuery = "?pageSize=10000";
   if(filterItem.filterFrom !== undefined && filterItem.filterFrom !== "" ){
      let newFromDate = this.getFormatDate( filterItem.filterFrom );
      filterQuery += (filterQuery !=="" ) ? "&start_date="+newFromDate : "?start_date="+newFromDate;
    }
    if(filterItem.filterTo !== undefined && filterItem.filterTo !== "" ){
      let newToDate = this.getFormatDate( filterItem.filterTo );
      filterQuery += (filterQuery !=="" ) ? "&end_date="+newToDate: "?end_date="+newToDate;
    }
    if(filterItem.filterProjectId !== undefined && filterItem.filterProjectId !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&projectId="+filterItem.filterProjectId: "?projectId="+filterItem.filterProjectId;
    
    if(filterItem.filterTitle !== undefined && filterItem.filterTitle !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&title="+filterItem.filterTitle: "?title="+filterItem.filterTitle;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-task'+filterQuery)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          
          this.setState({loading:false, dataLists: res.data.data.requestList});         
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

  /* VA List API */
  vaListItem(filterItem = {}) {
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-assignment/clients-va?pageSize=1000')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, vaLists: res.data.data.requestList}); 
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

  /* Submit Form Handler*/
  submitHandler (event) {
    event.preventDefault();
    const formInputField = this.state.formField;
    if(formInputField.vaAuthId==='' && formInputField.title==='' && formInputField.description==='' ){
      toast.error("Please fill all required fields!");
      return;
    }

    event.target.className += " was-validated";
    this.setState( { formProccessing: true}, () => {
      const formData = {
        "vaAuthId": formInputField.vaAuthId,
        "projectId": formInputField.projectId,
        "title": formInputField.title,
        "description": formInputField.description,
        "completionTime": formInputField.completionTime,
        "dueDate": formInputField.dueDate
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        formData['vaTaskId'] = formInputField.vaTaskId;
       
        commonService.putAPIWithAccessToken('va-task', formData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {           
            this.setState( { formProccessing: false} );
            toast.error(res.data.message);
            return;
          } 
          this.setState({ modal: false, formProccessing: false});
          this.itemLists();        
          toast.success(res.data.message);
        } )
        .catch( err => {         
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }else{
            this.setState( { formProccessing: false } );
            toast.error(err.message);
          } 
        } )
      }else{
        commonService.postAPIWithAccessToken('va-task', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            this.setState({ loading: false, modal: false, formProccessing: false });
            this.itemLists({});
            toast.success(res.data.message);
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
    } );  
  };
  
  /* Input Field On changes*/
  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField });
  };
  
  toggle = () => {
    this.setState({
      modal: !this.state.modal,
      rowIndex: -1,
      formField: { taskId:'', vaAuthId:this.state.formField.vaAuthId, projectId: '', title: '', description:'', completionTime:'', dueDate:'' },
    });
  }

  filterItemList(){
    const filterItem = this.state.filterItem;
    this.itemLists(filterItem);
  }

  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };
  setFilterFromDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterFrom = date;
    this.setState({ filterItem: filterFormField });
  };
  setFilterToDate = date => {
    let filterFormField = this.state.filterItem;
    filterFormField.filterTo = date;
    this.setState({ filterItem: filterFormField });
  };
  setDueDate = date => {
    let dueDateField = this.state.formField;
    dueDateField.dueDate = date;
    this.setState({ formField: dueDateField });
    console.log(dueDateField);
  };

  

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterFrom:'',  filterTo:'', filterProjectId:'', filterTitle:'', filterCompletionTime:''}
    });
    this.itemLists();
  }

  /* To edit review details/ change status */
  handleEditData(rowIndex){
    const rowData = this.state.dataLists[rowIndex];
    //console.log(rowData); return;
    const formField = {
      vaAuthId: rowData.vaAuthId,
      vaTaskId: rowData.vaTaskId,
      projectId: rowData.projectId,
      title: rowData.title,
      description: rowData.description,
      completionTime: rowData.completionTime,
      dueDate: (rowData.dueDate!=='' ? new Date(rowData.dueDate) :'' )
    }
    this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  handleDeleteData(rowIndex){
    const rowInfo = this.state.dataLists[rowIndex];
    const delFormData = {
      "vaTaskId": rowInfo.vaTaskId,
    };
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `va-task`, delFormData)
        .then( res => {
          if ( undefined === res.data || !res.data.status ) {            
            this.setState( { loading: false} );
            toast.error(res.data.message);      
            return;
          }         
          this.setState({ loading: false});
          this.itemLists({});       
          toast.success(res.data.message);
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

  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  dragRowItem(fromIndex, toIndex) {
    const data = this.state.dataLists;
    let currentTask = data[fromIndex];
    const item = data.splice(fromIndex, 1)[0];
    data.splice(toIndex, 0, item);
    this.setState({ dataLists: data });
    this.updateTaskRowOrder(currentTask, toIndex);
  }

  updateTaskRowOrder(taskInfo, updatedPosition){
    
    commonService.postAPIWithAccessToken('va-task/update-order', {vaTaskId: taskInfo.vaTaskId, organizationId: taskInfo.organizationId, previousPosition: taskInfo.rowOrder || 0, currentPosition: parseInt(updatedPosition) + 1})
      .then( res => {
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading: false} );
          toast.error(res.data.message);
          return;
        }
        
        this.setState({ loading: false, modal: false, formProccessing: false });
        this.itemLists({});
        //toast.success(res.data.message);
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
  
  render() {
    const { dataLists, vaLists, loading, modal, formField, formProccessing, filterItem } = this.state;
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    const currentObj = this;
    const dragProps = {
      onDragEnd(fromIndex, toIndex) {        
        currentObj.dragRowItem(fromIndex, toIndex);
      },
      nodeSelector: 'tr',
      handleSelector: 'td'
    };
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    console.log(formField);

    return (
      <div className="dashboard-section">
        {loaderElement}
                  
        <Card className="vd-card">
          <CardHeader>
            <div className="d-flex align-items-center">
              <div className="mr-auto">
                <h4 className="card-title"><img src="/images/task.svg" height="30" alt="" /> Manage Task</h4>
              </div>
              <div className="add-option-info">
                <Button className="btn-add" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add New Task</Button>          
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
            <div className="Search-filter">
              <div className="row">
                  {/* <div className="col-md-3">
                    <div className="form-group">
                      <Input type="select" name="filterProjectId" value={filterItem.filterProjectId} onChange={this.changeFilterHandler}>
                        <option value="">Filter by Project</option>
                        <option value="1">Project 1</option>
                        <option value="2">Project 2</option>
                        <option value="3">Project 3</option>
                        <option value="4">Project 4</option>
                      </Input>
                    </div>
                  </div> */}
                  <div className="col-md-6">
                    <div className="form-group">
                      <Input type="text" name="filterTitle" value={filterItem.filterTitle} onChange={this.changeFilterHandler} placeholder="Filter by Task Title" />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <DatePicker className="form-control" selected={ filterItem.filterFrom } placeholderText="From Date" onChange={this.setFilterFromDate} dateFormat="MM/dd/yyyy" />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <DatePicker className="form-control" selected={ filterItem.filterTo } onChange={this.setFilterToDate} dateFormat="MM/dd/yyyy" placeholderText="To Date" />
                    </div>
                  </div>
                  <div className="col-md-2">
                    <div className="form-group">
                      <button className="search-btn" onClick={this.filterItemList}>Search</button> &nbsp;
                      <button className="search-btn" onClick={this.resetfilterForm}>Clear</button>
                    </div>
                  </div>
              </div>
          </div>
            <div className="card-table table-responsive">
              <ReactDragListView {...dragProps}>
                <table className="table table-orders table-dragable">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Task</th>
                      <th>Assigned Date</th>
                      <th>Due Date</th>
                      <th>VA</th>
                      <th>Notes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {dataLists.map((dataInfo, index) => 
                      <tr key={index}>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>{dataInfo.title}</td>
                        <td>{(new Date(dataInfo.createdAt)).toLocaleDateString("en-US")}</td>
                        <td>{ (dataInfo.dueDate!=='' ? (new Date(dataInfo.dueDate)).toLocaleDateString("en-US") : '') }</td>
                        <td>{dataInfo.vaName}</td>
                        <td>{dataInfo.description}</td>
                        <td>
                        <UncontrolledDropdown>
                          <DropdownToggle color="default" className="btn-trigger">
                            <img src="/images/more.svg" width="20" alt="more" />
                          </DropdownToggle>
                          <DropdownMenu className="action-dropdown">
                            <DropdownItem onClick={() => { this.handleEditData(index) }} className="edit-btn"><i className="fa fa-pencil"></i> Edit</DropdownItem>
                            <DropdownItem onClick={() => {
                            if (window.confirm('Are you sure you want to delete this record?')) this.handleDeleteData(index) }} className="delete-btn"><i className="fa fa-trash-o"></i> Delete</DropdownItem>
                          </DropdownMenu>
                        </UncontrolledDropdown>  
                          
                        </td>
                      </tr>
                      
                      )}


                  </tbody>
                </table>
              </ReactDragListView>
            </div>
          </CardBody>
        </Card>

        <Modal isOpen={modal} toggle={this.toggle} className="full-width-modal-section">
          <ModalHeader toggle={this.toggle} className="pb-0">Task Info</ModalHeader>
          <Form onSubmit={this.submitHandler} noValidate className="profile-form">
            <ModalBody>
              <Row>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="vaAuthId">VirDrop VA *</Label>            
                    <Input type="select" id="vaAuthId" name="vaAuthId" value={formField.vaAuthId} onChange={this.changeHandler} required >
                      <option value="">Select VA</option>
                      {vaLists.map((vaInfo, index) =>
                        <SetVaDropDownItem key={index} vaInfo={vaInfo} />
                      )}
                    </Input>
                  </FormGroup>  
                </Col>
                {/* <Col md={"12"}>
                  <div className="form-group">
                    <label htmlFor="projectId">Project </label>
                    <Input type="select" name="projectId" id="projectId" className="form-control" value={formField.projectId} onChange={this.changeHandler}>
                      <option value="1">Project 1</option>
                      <option value="2">Project 2</option>
                      <option value="3">Project 3</option>
                      <option value="4">Project 4</option>
                    </Input>
                    <Button type="button" size="sm" color="primary" className="btn-add pull-right">+ Add New Project</Button>
                  </div>
                </Col> */}
                <Col md={"12"}>
                  <FormGroup>
                    <label htmlFor="title">Task name *</label>
                    <input type="text" name="title" id="title" className="form-control" placeholder="Task Name" value={formField.title} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="description">Comment *</Label>
                    <Input type="textarea" name="description" className="form-control" value={formField.description} onChange={this.changeHandler} required></Input>
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <div className="form-group">
                    <label htmlFor="dueDate">Due Date</label><br />
                    <DatePicker className="form-control" selected={ formField.dueDate } placeholderText="Select Due Date" onChange={this.setDueDate} dateFormat="MM/dd/yyyy" />
                  </div>
                </Col>
              </Row>
             </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Submit' }</Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>
      </div>
    );
  }
}

function SetVaDropDownItem (props) {
  const vaUserInfo = props.vaInfo;
  return (<option value={vaUserInfo.authId} >{vaUserInfo.firstName+' '+vaUserInfo.lastName}</option>)
}

export default taskList;