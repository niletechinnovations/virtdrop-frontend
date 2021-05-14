import React, { Component } from 'react';
import { 
  Card, CardHeader, CardBody, Input
} from 'reactstrap';

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import ReactDragListView from 'react-drag-listview/lib/index.js';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

class VaTaskData extends Component {
  constructor(props){
    super(props);
    this.state = {
      modal: false,
      dataLists: [],
      formProccessing: false,
      loading: false,
      rowIndex: -1,
      formField: { taskId: '', vaAuthId: '', projectId: '', title: '', description:'', completionTime:'', dueDate:'' },
      filterItem: { filterProjectId:'', filterTitle: '', filterCompletionTime:'',  filterFrom:'',  filterTo:''}
    } 
    this.filterItemList = this.filterItemList.bind(this);
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
  };

  resetfilterForm = () => {
    this.setState({
      filterItem: { filterFrom:'',  filterTo:'', filterProjectId:'', filterTitle:'', filterCompletionTime:''}
    });
    this.itemLists();
  }

  getFormatDate(date) {
    var year = date.getFullYear().toString();
    var month = (date.getMonth() + 101).toString().substring(1);
    var day = (date.getDate() + 100).toString().substring(1);
    return year + "-" + month + "-" + day;
  }

  dragRowItem(fromIndex, toIndex) {
    const data = this.state.dataLists;
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        this.setState({ dataLists: data });
  }
  
  render() {
    const { dataLists, loading, filterItem } = this.state;
    //const processingBtnText = <>Submit <i className="fa fa-spinner"></i></>;
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
                  
        <Card className="vd-card">
          <CardHeader>
            <div className="d-flex align-items-center">
              <div className="mr-auto">
                <h4 className="card-title"><img src="/images/task.svg" height="30" alt="" /> Manage Task</h4>
              </div>
            </div>
          </CardHeader>
          <CardBody className="item-list-section">
            <div className="Search-filter">
              <div className="row">
                  <div className="col-md-3">
                    <div className="form-group">
                      <Input type="select" name="filterProjectId" value={filterItem.filterProjectId} onChange={this.changeFilterHandler}>
                        <option value="">Filter by Project</option>
                        <option value="1">Project 1</option>
                        <option value="2">Project 2</option>
                        <option value="3">Project 3</option>
                        <option value="4">Project 4</option>
                      </Input>
                    </div>
                  </div>
                  <div className="col-md-3">
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
                      <th>Assigned By</th>
                      <th>Notes</th>
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
                        <td>{dataInfo.clientName}</td>
                        <td>{dataInfo.description}</td>
                      </tr>                      
                    )}

                  </tbody>
                </table>
              </ReactDragListView>
            </div>
          </CardBody>
        </Card>

      </div>
    );
  }
}


export default VaTaskData;