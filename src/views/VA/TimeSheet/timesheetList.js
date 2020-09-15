import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Col, Row, Button, Form, Input, FormGroup, Label,
  Modal, ModalHeader, ModalBody, ModalFooter, 
  UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Table
} from 'reactstrap';

import Moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import ReactDragListView from 'react-drag-listview/lib/index.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ReactStopwatch from 'react-stopwatch';
import Checkbox from "../../../core/commonComponent/Checkbox";

class timesheetList extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      subTaskModal: false,
      dataLists: [],
      vaLists: [],
      subTaskList: [],
      formProccessing: false,
      quickFormProccessing: false,
      loading: false,
      rowIndex: -1,
      formField: { taskId: '', clientId: '', projectId: '', taskName: '', startDate:'', startTime:'', endTime:'' },
      quickItem: { quickTaskId:'', quickTaskName: '', quickClientId:'',  quickProjectId:'', quickStartTime:'', quickEndTime:'' },
      quickBtnClass: 'success',
      taskState: 0,
      currentTaskId: '',
      currentSubTaskId: '',
      currentRowIndex: -1,
      rowTaskState:0,
      rowProcessing: false,
      checkedItems: new Map(),
    } 
    this.quickStart = this.quickStart.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.handleDeleteData = this.handleDeleteData.bind(this);
    this.dragRowItem = this.dragRowItem.bind(this);
    this.continueTask = this.continueTask.bind(this);
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this);
    this.completeSelectedRecord = this.completeSelectedRecord.bind(this);
    this.viewTaskDetails = this.viewTaskDetails.bind(this);
    
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
    let filterQuery = "?pageSize=1000&status=0";
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
    
    if(filterItem.filterTaskName !== undefined && filterItem.filterTaskName !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&taskName="+filterItem.filterTaskName: "?taskName="+filterItem.filterTaskName;
    
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('timesheet'+filterQuery)
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
      commonService.getAPIWithAccessToken('organization?pageSize=1000')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, vaLists: res.data.data.profileList}); 
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
        "clientId": formInputField.clientId,
        "projectId": formInputField.projectId,
        "taskName": formInputField.taskName,
        "notes": formInputField.notes,
        "taskType": 1,
        "subTask": [{startTime: formInputField.startTime , endTime:formInputField.endTime } ],
      };
      const rowIndex = this.state.rowIndex;
      if(rowIndex > -1) {
        formData['vaTaskId'] = formInputField.vaTaskId;
       
        commonService.putAPIWithAccessToken('timesheet', formData)
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
        commonService.postAPIWithAccessToken('timesheet', formData)
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
      formField: { taskId:'', vaAuthId:this.state.formField.vaAuthId, projectId: '', taskName: '', startDate:'', startTime:'', endTime:'' },
    });
  }

  subTaskToggle = () => {
    this.setState({
      subTaskModal: !this.state.subTaskModal
    });
  }

  quickStart (event) {
    event.preventDefault();
    const quickField = this.state.quickItem;
    if(quickField.quickClientId==='' && quickField.quickTaskName==='' && quickField.quickProjectId==='' ){
      toast.error("Please fill all required fields!");
      return;
    }
    var quickProcessingBtnText = <><i className="fa fa-spinner"></i> Start</>;
    if(this.state.currentSubTaskId==='') {
      this.setState( { quickFormProccessing: true, quickProcessingBtnText: quickProcessingBtnText}, () => {
        const formData = {
          "clientId": quickField.quickClientId,
          "projectId": quickField.quickProjectId,
          "taskName": quickField.quickTaskName,
          "taskType": 0,
          "subTask": [{startTime: new Date() , endTime:'' } ],
        };

        commonService.postAPIWithAccessToken('timesheet', formData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            }
            const taskData = res.data.data;
            const quickProcessingStopBtnText = <><i className="fa fa-stop"></i> Stop</>;
            this.setState({ taskState: 1, currentTaskId: taskData._id, currentSubTaskId: taskData.subTask[0]._id, loading: false, quickFormProccessing: true, quickBtnClass:'danger', quickProcessingBtnText:quickProcessingStopBtnText });
            //this.itemLists({});
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
        } );
    }else{
      quickProcessingBtnText = <><i className="fa fa-spinner"></i> Stop</>;
      this.setState( { quickFormProccessing: true, quickProcessingBtnText: quickProcessingBtnText}, () => {
     
          const updateData = {
            "taskId": this.state.currentTaskId,
            "subTaskId": this.state.currentSubTaskId,
            "endTime": new Date()
          };
          commonService.putAPIWithAccessToken('timesheet/subtask', updateData).then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { formProccessing: false} );
              toast.error(res.data.message);
              return;
            } 
            this.setState({ modal: false, formProccessing: false});
            this.itemLists();        
            this.setState({ taskState: 0, currentTaskId: '', currentSubTaskId: '', loading: false, quickFormProccessing: false, quickBtnClass:'success', quickProcessingBtnText:'' });
            toast.success('Your task has been completed.');
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
      } );  
    }
  };

  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const quickItem = this.state.quickItem;
    quickItem[name] = value;
    this.setState({ quickItem: quickItem });
  };
  
  setStartDate = date => {
    let taskField = this.state.formField;
    taskField.startDate = date;
    this.setState({ formField: taskField });
  };
  
  /* To edit details */
  handleEditData(rowIndex){
    const rowData = this.state.dataLists[rowIndex];
    //console.log(rowData); return;
    const formField = {
      clientId: rowData.clientId,
      vaTaskId: rowData.vaTaskId,
      projectId: rowData.projectId,
      taskName: rowData.taskName,
      notes: rowData.notes
    }
    this.setState({rowIndex: rowIndex, formField: formField, modal: true });
  }

  /* To view task details */
  viewTaskDetails(vaTaskId){
    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('timesheet/'+vaTaskId)
      .then( res => {
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading: false} );
          toast.error(res.data.message);
          return;
        } 
        const taskDetails = res.data.data;
        this.setState({ loading: false, subTaskModal: true, subTaskList: taskDetails.subTaskList });
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
    } );
  }

  handleDeleteData(rowIndex){
    const rowInfo = this.state.dataLists[rowIndex];
    const delFormData = {
      "vaTaskId": rowInfo.vaTaskId,
    };
    this.setState( { loading: true}, () => {
      commonService.deleteAPIWithAccessToken( `timesheet`, delFormData)
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
    
    commonService.postAPIWithAccessToken('timesheet/update-order', {vaTaskId: taskInfo.vaTaskId, organizationId: taskInfo.organizationId, previousPosition: taskInfo.rowOrder || 0, currentPosition: parseInt(updatedPosition) + 1})
      .then( res => {
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading: false} );
          toast.error(res.data.message);
          return;
        }
        
        this.setState({ loading: false, modal: false, formProccessing: false });
        this.itemLists({});
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

  
  continueTask(rowIndex){
    const rowTaskState = this.state.rowTaskState;
    const taskInfo = this.state.dataLists[rowIndex];
    
    const taskData = {
      "taskId": taskInfo.vaTaskId,
      "subTaskId": (rowTaskState===0 ? '' : this.state.currentSubTaskId),
    };
    
    if(rowTaskState===0){
      taskData['startTime'] = new Date();
    }else{
      taskData['endTime'] = new Date();
    }
    this.setState( { currentRowIndex: rowIndex, rowProcessing: true, loading: true}, () => {
     
      commonService.putAPIWithAccessToken('timesheet/subtask', taskData).then( res => {
        if ( undefined === res.data.data || !res.data.status ) {           
          this.setState( { rowProcessing: false} );
          toast.error(res.data.message);
          return;
        }
        const subTaskData = res.data.data;
        if(rowTaskState===0){
          this.setState({ rowTaskState: 1, currentSubTaskId: subTaskData._id, loading: false, rowProcessing: false});
          toast.success('Task Started...');
        }else{
          this.itemLists();        
          this.setState({ rowTaskState: 0, currentSubTaskId: '', currentRowIndex: -1, loading: false, rowProcessing: false });
          toast.success('Task has been completed.');
        }
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
    } );
    
  }
  
  handleCheckboxChange(e) {
    const item = e.target.name;
    const isChecked = e.target.checked;
    this.setState(prevState => ({ checkedItems: prevState.checkedItems.set(item, isChecked) }));
  }

  completeSelectedRecord (event) {
    event.preventDefault();
    const selectedItem = this.state.checkedItems;
    
    var checkedData = [];
    for(let i of selectedItem.keys()){
      if(selectedItem.get(i))
        checkedData.push(i);
      }

    if(checkedData.length === 0)
      return false;
    this.setState( { loading: true}, () => {
      commonService.putAPIWithAccessToken( `timesheet/complete-task`, {taskId: checkedData})
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

  render() {
    const { dataLists, vaLists, loading, modal, subTaskModal, formField, formProccessing, quickFormProccessing, quickBtnClass, quickProcessingBtnText, quickItem, currentRowIndex, subTaskList } = this.state;
    const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
    const defaultQuickButton = <><i className="fa fa-play"></i>&nbsp; Start</>;
    console.log(this.state.checkedItems);
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

    return (
      <div className="dashboard-section">
        {loaderElement}
        
        <div className="Search-filter">
          
          <Form onSubmit={this.quickStart} noValidate className="quick-form">
            <Row>
              <Col md="7" className="pl-0">
                <FormGroup>
                  <Input type="text" name="quickTaskName" value={quickItem.quickTaskName} onChange={this.changeFilterHandler} placeholder="What task have you done?" />
                </FormGroup>
              </Col>
              <Col md={"3"}>
                <FormGroup>
                  <Input type="select" id="quickClientId" name="quickClientId" value={quickItem.quickClientId} onChange={this.changeFilterHandler} required >
                    <option value="">Select Client</option>
                    {vaLists.map((vaInfo, index) =>
                      <SetVaDropDownItem key={index} vaInfo={vaInfo} />
                    )}
                  </Input>
                </FormGroup>  
              </Col>
              {/* <Col md="2">
                <FormGroup>
                  <Input type="select" name="quickProjectId" value={quickItem.quickProjectId} onChange={this.changeFilterHandler}>
                    <option value="">Select Project</option>
                    <option value="1">Project 1</option>
                    <option value="2">Project 2</option>
                    <option value="3">Project 3</option>
                    <option value="4">Project 4</option>
                  </Input>
                </FormGroup>
              </Col> */}
              <Col md="1" className="pr-0">
                <FormGroup>
                  { (this.state.taskState===1) && 
                  <ReactStopwatch seconds={0} minutes={0} hours={0} onCallback={() => console.log('Finish')} withLoop >
                    {({ formatted }) => (
                      <div className="timer">{ formatted }</div>
                    )}
                  </ReactStopwatch>
                  }
                </FormGroup>
              </Col>
              <Col md="1" className="pr-0">
                <FormGroup>  
                  <Button type="submit" color={quickBtnClass} size="lg" className="quickStart">{quickFormProccessing ? quickProcessingBtnText : defaultQuickButton }</Button>
                </FormGroup>
              </Col>
            </Row>
          </Form>
        </div>

        <Card className="vd-card">
          <CardHeader>
            <div className="d-flex align-items-center">
              <div className="mr-auto">
                <h4 className="card-title"><img src="/images/task.svg" height="30" alt="" /> Timesheet List</h4>
              </div>
              <div className="add-option-info">
                <Button color="success" type="button" onClick={this.completeSelectedRecord}><i className="fa fa-check"></i> Complete Selected Task</Button> &nbsp;
                <Button color="primary" type="button" onClick={this.toggle}><i className="fa fa-plus"></i> Add Manual Task</Button>
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
            <div className="card-table table-responsive">
              <ReactDragListView {...dragProps}>
                <table className="table table-orders table-dragable">
                  <thead>
                    <tr>
                      <th className="text-center">#</th>
                      <th>S.No</th>
                      <th>Task Name</th>
                      <th>Client</th>
                      <th>Total Hour(s)</th>
                      <th></th>
                      <th colSpan="2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    
                      {dataLists.map((dataInfo, index) => 
                      <tr key={index}>
                        <td className="text-center" style={{width:'50px'}}>
                          <Checkbox name={dataInfo.vaTaskId} checked={this.state.checkedItems.get(dataInfo.vaTaskId)} onChange={this.handleCheckboxChange} />
                        </td>
                        <td>
                          <span className="sno">{index+1}</span>
                        </td>
                        <td>{dataInfo.taskName}</td>
                        <td>{dataInfo.clientName}</td>
                        <td>{dataInfo.duration}</td>
                        <td style={ {width:'80px'} }>
                          { (currentRowIndex === index && this.state.currentSubTaskId!=='') &&
                            <ReactStopwatch seconds={0} minutes={0} hours={0} onCallback={() => console.log('Finish')} withLoop >
                            {({ formatted }) => (
                              <div className="timer">{ formatted }</div>
                            )}
                            </ReactStopwatch>
                          }
                        </td>
                        <td style={ {width:'70px'} }>
                          { (currentRowIndex !== index) ? 
                          <Button type="button" color="primary" className="edit-btn" title="Continue Task" onClick={() => { this.continueTask(index) }}>
                            { (currentRowIndex === index && this.state.rowProcessing) ? <i className="fa fa-spinner"></i> : <i className="fa fa-play"></i>
                            }
                            </Button>
                          :
                          <Button type="button" color="danger" className="delete-btn" title="Complete Task" onClick={() => { this.continueTask(index) }}>
                            { (currentRowIndex === index && this.state.rowProcessing) ? <i className="fa fa-spinner"></i> : <i className="fa fa-stop"></i>
                            }
                          </Button>
                          }
                        </td>
                        <td style={ {width:'60px'} }>
                          <UncontrolledDropdown>
                            <DropdownToggle color="default" className="btn-trigger">
                              <img src="/images/more.svg" width="20" alt="more" />
                            </DropdownToggle>
                            <DropdownMenu className="action-dropdown">
                              <DropdownItem onClick={() => { this.viewTaskDetails(dataInfo.vaTaskId) }} className="edit-btn"><i className="fa fa-eye"></i> Details</DropdownItem>
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
                    <label htmlFor="title">Task name *</label>
                    <input type="text" name="taskName" id="title" className="form-control" placeholder="Task Name" value={formField.taskName} onChange={this.changeHandler} required />
                  </FormGroup>
                </Col>
                <Col md={"12"}>
                  <FormGroup>
                    <Label htmlFor="clientId">Client *</Label>            
                    <Input type="select" id="clientId" name="clientId" value={formField.clientId} onChange={this.changeHandler} required >
                      <option value="">Select Client</option>
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
                      <option value="">Select Project</option>
                      <option value="1">Project 1</option>
                      <option value="2">Project 2</option>
                      <option value="3">Project 3</option>
                      <option value="4">Project 4</option>
                    </Input>
                    <Button type="button" size="sm" color="primary" className="btn-add pull-right">+ Add New Project</Button>
                  </div>
                </Col> */}
                <Col md={"4"}>
                  <FormGroup>
                    <Label htmlFor="description">Date *</Label>
                    <DatePicker className="form-control" selected={ formField.startDate } placeholderText="Start Date" onChange={this.setStartDate} dateFormat="MM/dd/yyyy" />
                  </FormGroup>
                </Col>
                <Col md={"4"}>
                  <FormGroup>
                  <Label htmlFor="startTime">Start Time *</Label>
                    <Input type="time" name="startTime" className="form-control" id="startTime" value={formField.startTime} onChange={this.changeHandler}></Input>
                  </FormGroup>
                </Col>
                <Col md={"4"}>
                  <FormGroup>
                    <Label htmlFor="endTime">End Time *</Label>
                    <Input type="time" name="endTime" className="form-control" id="endTime" value={formField.endTime} onChange={this.changeHandler}></Input>
                  </FormGroup>
                </Col>
              </Row>
             </ModalBody>
            <ModalFooter>
                <Button color="primary" type="submit">{formProccessing ? processingBtnText : 'Submit' }</Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Form>
        </Modal>

        {/* Sub Task Modal */}
        <Modal isOpen={subTaskModal} toggle={this.subTaskToggle} className="full-width-modal-section">
          <ModalHeader toggle={this.subTaskToggle} className="pb-0">Task Details</ModalHeader>
            <ModalBody>
              <Row>
                <Col md={"12"}>
                  <Table size="sm">
                    <thead>
                      <tr>
                        <th>S.No</th>
                        <th>Start Time</th>
                        <th>End Time</th>
                        <th>Duration</th>
                      </tr>
                    </thead>
                    <tbody>
                    {subTaskList.map((subTask, subIndex) => 
                      <tr key={subIndex}>
                        <th scope="row">{subIndex+1}</th>
                        <td>{Moment(subTask.startTime).format('MM-DD-YYYY h:mm:ss a')}</td>
                        <td>{Moment(subTask.endTime).format('h:mm:ss A')}</td>
                        <td>{subTask.duration}</td>
                      </tr>
                    )}
                    </tbody>
                  </Table>
                </Col>
              </Row>
             </ModalBody>
        </Modal>
      </div>
    );
  }
}

function SetVaDropDownItem (props) {
  const vaUserInfo = props.vaInfo;
  return (<option value={vaUserInfo.authId} >{vaUserInfo.firstName+' '+vaUserInfo.lastName}</option>)
}

export default timesheetList;