import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Input, InputGroup, InputGroupAddon } from 'reactstrap';
// import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';
import { Link } from 'react-router-dom';

class AssignHireVaRequest extends Component {
  constructor(props){
    super(props);
    this.state = {
      clientId: '',
      formField: { organizationId: '', organizationName:'', userName:'', hireVARequestId:'', vaType: '', natureOfBusiness: '', engagementType:'', engagementDescription: '', numberOfVA:'', skillSet:'' },
      filterItem: { emailOrName: '', filter_Skills:''  },
      vaApplicationList: [],
      skillList:[],
      assignedVaList: [],
      loading: false,
      checkAll: false,
      checkedItems: [],
      errors: {}
    } 
    this.handleChange = this.handleChange.bind(this);
    this.filterVaMemberList = this.filterVaMemberList.bind(this);
  }

  componentDidMount() { 
    const {history:{location:{state}}} =this.props;
    console.log("local..............",state)
    const client_AuthId=state;
    const { match: { params } } = this.props;  
    console.log("clientId-------------->",this.props) 
    const formField =this.state.formField;
    formField.hireVARequestId = params.hireVARequestId;
    if(params.hireVARequestId !== undefined && params.hireVARequestId !=="") {
      this.setState({clientId : client_AuthId, formField: formField});
      this.getAssignedVA(params.hireVARequestId);
    }
    this.itemList();
    this.getSkillList();
  }
  getAssignedVA(clientId){
  // getAssignedVA(hireVARequestId){
    // console.log("hireVARequestId------------999999------>",hireVARequestId)  

    this.setState( { loading: true}, () => {
      commonService.getAPIWithAccessToken('va-assignment/assigned-clients/?clientId='+clientId)
      .then( res => {
        console.log("Assignd VA---------------------",res)
        if ( undefined === res.data.data || !res.data.status ) {
          this.setState( { loading: false} );
          toast.error(res.data.message);
          return;
        }
        const itemInfo = res.data.data;
        var checkedApi = [];
        if (res.data.data.profileList) {
            for (var i = 0; i < itemInfo.profileList.length; i++) {
                checkedApi.push(itemInfo.profileList[i].authId);
            }
        }
        this.setState({ assignedVaList: itemInfo.profileList, checkedItems: checkedApi, loading: false });
      } )
      .catch( err => {               
        if(err.response !== undefined && err.response.status === 401) {
          localStorage.clear();
          this.props.history.push('/login');
        }else
          this.setState( { loading: false } );
          toast.error(err.message);
      } )
    } );
  }

  /*VA Member List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=50";
    if(filterItem.emailOrName !== undefined && filterItem.emailOrName !== "" ) 
      filterQuery += (filterQuery !=="" ) ? "&emailOrName="+filterItem.emailOrName: "&emailOrName="+filterItem.emailOrName;

      if (filterItem.filter_Skills !== undefined && filterItem.filter_Skills !== "") {
        filterQuery += (filterQuery !== "") ? "&filterSkills=" + filterItem.filter_Skills : "&filterSkills=" + filterItem.filter_Skills;
    }
    
    this.setState( { loading: true}, () => {
      // va-assignment/clients-va
      commonService.getAPIWithAccessToken('va-application/va-member'+filterQuery)
        .then( res => {
          console.log("res VA MEMBER",res)
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( { loading: false } );
            toast.error(res.data.message);
            return;
          }
          this.setState({loading:false, vaApplicationList: res.data.data.requestList});
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

  getSkillList = () => {
    commonService.getAPIWithAccessToken('skill')
        .then(res => {
          // console.log("Skilssss",res)
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

  filterVaMemberList(){
    const filterItem = this.state.filterItem;
    this.itemList(filterItem);
  }
  
  changeFilterHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const filterItem = this.state.filterItem
    filterItem[name] = value;
    this.setState({ filterItem: filterItem });
  };

  handleChange = (index, e) => {

    let checkedItems = this.state.checkedItems;
    let checkAll = this.state.checkAll;
    if (index === "All") {
        checkAll = e.target.checked;
        checkedItems = checkAll ? this.state.vaApplicationList.map((info, i) => { return info.authId; }) : [];
    }else {
      if (e.target.checked && checkedItems.indexOf(index) < 0) {
        checkedItems.push(index);
      } else if (!e.target.checked)
        checkedItems.splice(checkedItems.indexOf(index), 1);
    }
    this.setState({ checkedItems: checkedItems, checkAll: checkAll });
  };

  assignVaUser = () => {
    let authIds = this.state.checkedItems;
    if (authIds.length === 0) {
        toast.error('Please select at least one VA User');
        return;
    }
    console.log(this.state.formField.hireVARequestId,"hireva request")
    const formData = {
         "clientId":this.state.clientId,
        "hireVARequestId": this.state.formField.hireVARequestId,
        "authIds": authIds,
    };
    
    this.setState({ loading: true }, () => {
      commonService.postAPIWithAccessToken(`va-assignment`, formData)
        .then(res => {
            if (undefined === res.data || !res.data.status) {
                this.setState({ loading: false });
                toast.error(res.data.message);
                return;
            }
            //this.props.history.push('/admin/va-request/');
            this.setState({ loading: false });
            toast.success(res.data.message);
            this.itemList();
            window.scrollTo(0, 0);
        })
        .catch(err => {
            toast.error(err.message);
            this.setState({ loading: false });
        })
    })
  }



 
  render() {
    
    const { loading,  vaApplicationList, assignedVaList,skillList } = this.state;
    let loaderElement = '';
    if (loading)
        loaderElement = <Loader />
        
        let rowsItem = [];        
        for (const [i, userData] of vaApplicationList.entries() ) {
          // console.log("userData.skillSet",userData)
            let userInfo = {
                SNo: i,
                authId: userData.authId,
                userName: userData.firstName + ' ' + userData.lastName,
                email: userData.email,
                skillSet: userData.skillSet1 +','+ userData.skillSet2+','+ userData.skillSet3,
            }
            rowsItem.push(userInfo);
        }
        let list = rowsItem.map((user, index) => {
          return (
            <tr key={user.SNo}>
              {/* {assignedVaList.includes(user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>} */}
              { assignedVaList.find(el => el.authId ===user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>}
              <td>{user.SNo + 1}</td>
              <td>{user.userName}</td>
              <td>{user.email}</td>
              <td>{user.skillSet}</td>
            </tr>)
          }
        );

    return (
      <div className="animated fadeIn">
        <Row>
          
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardBody>
                    <div  className="form-service-listing">
                       <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}>Go Back</button>
                      <h2 className="mt-1">Assign Hire VA Request</h2>
                      <div className="Enquiries-info">
                        {/* New Enquiries Data */}
                        <Row>
                          <Col md="12">
                            <Card className="vd-card">
                              <div className="card-header">
                                <Row className="mr-auto">
                                  <Col md="4">
                                    <Input placeholder="Filter by name or email..." name="emailOrName" value={this.state.filterItem.emailOrName} onChange={this.changeFilterHandler} />
                                  </Col>
                                  <Col md="4">
                                    <Input type = "select" placeholder="Filter by skills" name="filter_Skills" value={this.state.filterItem.filter_Skills} onChange={this.changeFilterHandler}>
                                    <option value="">All</option>
                                        {skillList.map((skillInfo, index) =>
                                            <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                        )}
                                        </Input>
                                  </Col>
                                  <Col>
                                    <Button onClick={this.filterVaMemberList}><i className="fa fa-search"></i></Button>
                                  </Col>
                                </Row>
                              </div>
                              <CardBody>
                                <div className="table-responsive card-table">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th><input type="checkbox" name="checkAll" checked={this.state.checkAll} onChange={(e) => { this.handleChange("All", e) }} /></th>
                                                <th>S&nbsp;no.</th>
                                                <th>User</th>
                                                <th>Email</th>
                                                <th>Skills</th>
                                            </tr>
                                        </thead>
                                        <tbody>{list}</tbody>
                                    </table>
                                </div>
                                <div className="form-group mt-3">
                                  <Link className="btn btn-danger" to="/admin/hire-va-assignment-list">Cancel</Link> &nbsp;
                                  <button className="btn btn-success" onClick={() => this.assignVaUser()}>Assign</button>
                                </div>
                              </CardBody>              
                            </Card>
                          </Col>
                          
                        </Row>
                      </div>
                    </div>  
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

function SetSkillDropDownItem(props) {
  const skillInfo = props.skillInfo;
  return (<option value={skillInfo.skillId} >{skillInfo.skillName}</option>)
}

export default AssignHireVaRequest;

