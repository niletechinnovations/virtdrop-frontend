import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
// import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';
import { Link } from 'react-router-dom';
// import ClientAreaNeed from './clientNeedAreaList.json';
import CheckboxTree from 'react-checkbox-tree';
import 'react-checkbox-tree/lib/react-checkbox-tree.css';
import './AssignHireVaRequest.css';
import { Multiselect } from 'multiselect-react-dropdown';
import DropdownTreeSelect from 'react-dropdown-tree-select'
import 'react-dropdown-tree-select/dist/styles.css'

class AssignHireVaRequest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ClientAreaNeed:[],
      clientId: '',
      formField: { organizationId: '', organizationName: '', userName: '', hireVARequestId: '', vaType: '', natureOfBusiness: '', engagementType: '', engagementDescription: '', numberOfVA: '', skillSet: '' },
      filterItem: { emailOrName: '', filter_Parent_Skills: '', filter_Skills: '' },
      vaApplicationList: [],
      skillList: [],
      assignedVaList: [],
      loading: false,
      checkAll: false,
      checkedItems: [],
      errors: {},
      checked: [],
      expanded: [],
      nodes: [],
      SelectedClientAreaNeed: [],
      vADesignation: [],
      childList: [],
      childSelectedItem: [],
      selectedParentSkill: [],
      // showDropdown: "always"
    }
    this.myRef = React.createRef()
    this.multiselectRef = React.createRef();
    this.multiselectRef1 = React.createRef();
    this.handleChange = this.handleChange.bind(this);
    this.filterVaMemberList = this.filterVaMemberList.bind(this);
    // this.onCheck = this.onCheck.bind(this);
    // this.onExpand = this.onExpand.bind(this);
    this.onSelectIndstry = this.onSelectIndstry.bind(this);
    this.onRemoveIndustry = this.onRemoveIndustry.bind(this);
    this.onSelectSubIndstry = this.onSelectSubIndstry.bind(this);
    this.onRemoveSubIndustry = this.onRemoveSubIndustry.bind(this);
    // this.onChangeSelectHandler =this.onChangeSelectHandler.bind(this);
    // this.assignObjectPaths = this.assignObjectPaths.bind(this);
  }

/*New Skill List API*/
SkillList() {
  this.setState({ loading: true }, () => {
    commonService.getAPIWithAccessToken('skill/get-new-skill')
      .then(res => {
        // console.log("Get Skill List===========>", res)
        if (undefined === res.data.data || !res.data.status) {
          this.setState({ loading: false });
          toast.error(res.data.message);
          return;
        }
        this.setState({ loading: false, skillList: res.data.data });
        
        const newArray = []
        let unique=[]
        let obj = {}

        // console.log("ressss",JSON.stringify(res.data.data))
        var newdata = [];
for (let i = 0; i < res.data.data.length; i++) {

  if (newdata && newdata.length > 0) {
      var checkNotExist = false;
      for (let k = 0; k < newdata.length; k++) {
          if (newdata[k].areaId == res.data.data[i].areaId) {
              checkNotExist = false;
              if (newdata[k].vADesignation && newdata[k].vADesignation.length > 0) {
                  // console.log(typeof newdata[k].va, 'insid11e');
                  newdata[k].vADesignation.push({ skill: res.data.data[i].skillName, skillId: res.data.data[i].skillId });
              } else {
                  // console.log('insid2');
                  newdata[k].vADesignation = [{ skill: res.data.data[i].skillName, skillId: res.data.data[i].skillId }];
              }
              // console.log('inside');
              break;
          } else {
              checkNotExist = true;
          }
      }
      if (checkNotExist == true) {
          newdata.push({ areaId: res.data.data[i].areaId, areaName: res.data.data[i].areaName, 'vADesignation': [{ skill: res.data.data[i].skillName, skillId: res.data.data[i].skillId }] });
      }
      // console.log(checkNotExist);
  } else {
      newdata.push({ areaId: res.data.data[i].areaId, areaName: res.data.data[i].areaName, 'vADesignation': [{ skill: res.data.data[i].skillName, skillId: res.data.data[i].skillId }] });
  }

}
console.log("NEW DATA",newdata)
this.setState({ ClientAreaNeed: newdata})
this.setState({ SelectedClientAreaNeed: this.state.ClientAreaNeed.map(item => { return ({ areaId: item.areaId, areaName: item.areaName }) }) })
// this.setState({ SelectedClientAreaNeed: newdata})

// console.log("Hello======",this.state.SelectedClientAreaNeed)

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
// *****************New Skill List End**************

  componentDidMount() {
    this.SkillList();
    const { history: { location: { state } } } = this.props;
    console.log("local..............", state)
    const client_AuthId = state;
    const { match: { params } } = this.props;
    console.log("clientId-------------->", this.props)
    const formField = this.state.formField;
    formField.hireVARequestId = params.hireVARequestId;
    if (params.hireVARequestId !== undefined && params.hireVARequestId !== "") {
      this.setState({ clientId: client_AuthId, formField: formField });
      this.getAssignedVA(params.hireVARequestId);
    }
    this.itemList();
    this.parentChildrenDataHandler();
  }

  onSelectSubIndstry(selectedList, selectedItem) {
    console.log("LLLLL", selectedList, "---------------", selectedItem)
    const childList = this.state.childList;
    this.setState({ childSelectedItem: selectedItem })
  }
  onRemoveSubIndustry(selectedList, removedItem) {
    // const result =  this.state.childList.filter(el=>el.parentName!==removedItem.parentName)
    // console.log("Rwsult",result)
    console.log("child oN Sub REmove", selectedList)
    this.setState({ childSelectedItem: selectedList })

  }

  onSelectIndstry(selectedList, selectedItem) {
    // console.log("selectedList****yuyuy********************>", selectedList)

    // let arr=[]
    let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
    var merged = [].concat.apply([], seletedVaList);

    console.log("merged", merged);
    this.setState({ childList: merged, selectedParentSkill: selectedList })
  }

  onRemoveIndustry(selectedList, removedItem) {
    console.log("remove", selectedList)
    let childList = this.state.childList;
    let childSelectedItem = this.state.childSelectedItem;

    // console.log("Chield", childSelectedItem.parentId, "-------REVOVE-------", removedItem.parentId)
    // if (childSelectedItem.parentId === removedItem.parentId) {
    // console.log("childSelectedItem=IFIIFFI=", childSelectedItem)
    // this.setState({ childSelectedItem: '' })
    // }
    const result = childList.filter(el => { return (el.parentId !== removedItem.parentId) })
    console.log("Rwsult", result)

    this.setState({ childList: result, selectedParentSkill: selectedList })
  }

  // tree View
  parentChildrenDataHandler = () => {
    const parents = [];
    // console.log("ClientAreaNeed.clientArea", ClientAreaNeed.clientArea[0].vADesignation[0].profileName)



    // for (let i = 0; i < ClientAreaNeed.clientArea.length; i += 1) {
    //   const children = [];

    //   for (let j = 0; j < ClientAreaNeed.clientArea[i].vADesignation.length; j += 1) {
    //     children.push({
    //       value: ClientAreaNeed.clientArea[i].vADesignation[j].id,
    //       label: ClientAreaNeed.clientArea[i].vADesignation[j].profileName,
    //     });
    //   }

    //   parents.push({
    //     value: ClientAreaNeed.clientArea[i].parentId,
    //     label: ClientAreaNeed.clientArea[i].parentName,
    //     children,
    //   });
    // }

    // const nodes = [{
    //   value: 'parentId',
    //   label: 'Client Area List',
    //   children: parents,
    // }];

    // this.setState({ nodes: parents })


  }

  resetfilterForm = (event) => {
    event.preventDefault()
    event.stopPropagation()
    // childList:'', childSelectedItem:''
    console.log("childList", this.state.childList)
    this.multiselectRef.current.resetSelectedValues();
    this.multiselectRef1.current.resetSelectedValues();
    this.setState({
      filterItem: { filterFirstName: '', filterEmail: '', filterSkill: '', filterSkill1: '', filterRating: '', filterFrom: '', filterTo: '', filterStatus: '' }
    });
    this.itemList();
  }

  onCheck(checked) {
    this.setState({ checked });
  }

  onExpand(expanded) {
    this.setState({ expanded });
  }

  getAssignedVA(clientId) {

    this.setState({ loading: true }, () => {
      commonService.getAPIWithAccessToken('va-assignment/assigned-clients/?clientId=' + clientId)
        .then(res => {
          console.log("Assignd VA---------------------", res)
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
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

  /*VA Member List API*/
  itemList(filterItem = {}) {
    let filterQuery = "?pageSize=50";
    if (filterItem.emailOrName !== undefined && filterItem.emailOrName !== "")
      filterQuery += (filterQuery !== "") ? "&emailOrName=" + filterItem.emailOrName : "&emailOrName=" + filterItem.emailOrName;

    // if (filterItem.filter_Skills !== undefined && filterItem.filter_Skills !== "") {
    //   filterQuery += (filterQuery !== "") ? "&filterSkills=" + filterItem.filter_Skills : "&filterSkills=" + filterItem.filter_Skills;
    //   console.log("filterQuery+++",filterQuery)
    // }

    if (filterItem.filter_Parent_Skills !== undefined && filterItem.filter_Parent_Skills !== "") {
      filterQuery += (filterQuery !== "") ? "&filterParentSkills=" + filterItem.filter_Parent_Skills : "&filterParentSkills=" + filterItem.filter_Parent_Skills;
      console.log("filterQuery+++", filterQuery)
    }

    if (filterItem.filter_Skills !== undefined && filterItem.filter_Skills !== "") {
      filterQuery += (filterQuery !== "") ? "&filterSkills=" + filterItem.filter_Skills : "&filterSkills=" + filterItem.filter_Skills;
      console.log("filterQuery+++", filterQuery)
    }
    this.setState({ loading: true }, () => {
      // va-assignment/clients-va
      commonService.getAPIWithAccessToken('va-application/va-member' + filterQuery)
        .then(res => {
          console.log("res VA MEMBER", res)
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false, vaApplicationList: res.data.data.requestList });
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


  filterVaMemberList() {
    const filterItem = this.state.filterItem;
    const skillSearch = this.state.childSelectedItem;
    filterItem.filter_Parent_Skills = this.state.selectedParentSkill.length > 0 ? this.state.selectedParentSkill[0].areaId : [];
    filterItem.filter_Skills = this.state.childSelectedItem.skillId;
    console.log("Test Search************", filterItem.filter_Parent_Skills)
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
    } else {
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
    console.log(this.state.formField.hireVARequestId, "hireva request")
    const formData = {
      "clientId": this.state.clientId,
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

    const { loading, vaApplicationList, assignedVaList, skillList, checked, expanded, nodes, SelectedClientAreaNeed, vADesignation, showDropdown, childList, childSelectedItem } = this.state;
    let loaderElement = '';
    // console.log("childSelectedItem****RENSD*********", childSelectedItem)

    if (loading)
      loaderElement = <Loader />

    let rowsItem = [];

    for (const [i, userData] of vaApplicationList.entries()) {
      console.log("userData.skillSet",userData)

      let userInfo = {
        SNo: i,
        authId: userData.authId,
        userName: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        vaApplicationId: userData.vaApplicationId,
        // Area: userData.ParentSkillSet1.map(e=>e.parentName) + ',' + userData.ParentSkillSet2.map(e=>e.parentName)  + ',' + userData.ParentSkillSet3.map(e=>e.parentName),
        // Area: userData.ParentSkillSet.map(e => e.areaName).toString(),
        Area: userData.skillSet1 ? ([ ...new Set(userData.ParentSkillSet.map(e => e.areaName))]).toString() : "",
        //skillSet: userData.skillSet1? userData.skillSet1.map(e => e.skillName) + ',' + userData.skillSet2.map(e => e.skillName) + ',' + userData.skillSet3.map(e => e.skillName) : " ",
        skillSet1: userData.skillSet1.map(e=>e.skillName) + (userData.rateSkill1 !=='' ? " ("+userData.rateSkill1+")" :''  ) || " ",
        skillSet2: userData.skillSet2.map(e=>e.skillName) + (userData.rateSkill2 !=='' ? " ("+userData.rateSkill2+")" :''  ) || " ",
        skillSet3: userData.skillSet3.map(e=>e.skillName) + (userData.rateSkill3 !=='' ? " ("+userData.rateSkill3+")" :''  ) || " ",
        audioFile: userData.audioFile!=='' ? <a href={ userData.audioFile } target="_blank" rel="noopener noreferrer">Audio Clip</a> : '' ,
        resumeCV: userData.resumeCV!=='' ? <a href={ "https://view.officeapps.live.com/op/embed.aspx?src="+userData.resumeCV+"&embedded=true" } target="_blank" rel="noopener noreferrer">Resume</a> : '',
        status: ( userData.statusText !==''  ? userData.statusText : "Pending")
 
      }
      rowsItem.push(userInfo);
    }
    let list = rowsItem.map((user, index) => {
      return (
        <tr key={user.SNo}>
          {/* {assignedVaList.includes(user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>} */}
          { assignedVaList.find(el => el.authId === user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>}
          <td>{user.SNo + 1}</td>
          <td><Link to={"/admin/va-application/"+user.vaApplicationId}>{user.userName}</Link></td>
          <td>{user.Area}</td>
          <td>{user.skillSet1}</td>
          <td>{user.skillSet2}</td>
          <td>{user.skillSet3}</td>
          <td>{user.resumeCV} {user.audioFile}</td>
          <td>{user.status}</td>
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
                <div className="form-service-listing">
                  <button className="btn btn-sm btn-secondary pull-right" onClick={() => this.props.history.goBack()}>Go Back</button>
                  <h2 className="mt-1">Assign Hire VA Request</h2>
                  <div className="Enquiries-info">
                    {/* New Enquiries Data */}
                    <Row>
                      <Col md="12">
                        <Card className="vd-card">
                          <div className="card-header">
                            <Row className="mr-auto">
                              <Col md="3">
                                <Label htmlFor="vaNameEmail">Name or Email</Label>
                                <Input id="vaNameEmail" placeholder="Filter by name or email..." name="emailOrName" value={this.state.filterItem.emailOrName} onChange={this.changeFilterHandler} />
                              </Col>
                              <Col className="dropdown-scrollbar" md="4">
                                <Label htmlFor="area">Area</Label>
                                <Multiselect
                                  options={SelectedClientAreaNeed}
                                  ref={this.multiselectRef1}
                                  onChange={this.changeHandler}
                                  singleSelect
                                  id="css_custom"
                                  style={{ chips: { background: "#4bb8f9" }, searchBox: { border: "1px solid grey", "borderBottom": "1px solid grey", "borderRadius": "0px" } }}
                                  onSelect={this.onSelectIndstry}
                                  onRemove={this.onRemoveIndustry}
                                  displayValue="areaName"
                                  showCheckbox={true}
                                />
                              </Col>
                              <Col md={3}>
                                <Label htmlFor="skills">Skills</Label>
                                <Multiselect
                                  options={childList}
                                  ref={this.multiselectRef}
                                  onChange={this.changeHandler}
                                  singleSelect
                                  onSelect={this.onSelectSubIndstry}
                                  onRemove={this.onRemoveSubIndustry}
                                  groupBy="areaName"
                                  // selectedValues={SelectedClientAreaNeed}
                                  id="css_custom"
                                  style={{ chips: { background: "#4bb8f9" }, searchBox: { border: "1px solid grey", "borderBottom": "1px solid grey", "borderRadius": "0px" } }}
                                  displayValue="skillName"
                                  showCheckbox={true}
                                />
                              </Col>
                              <Col md={2}  style={{ marginTop: "30px" }}>
                                <Label htmlFor="area" >&nbsp;</Label>
                                <Button onClick={this.filterVaMemberList}><i className="fa fa-search"></i></Button>
                                <Label htmlFor="area" >&nbsp;</Label>
                                <Button color="danger" type="reset" onClick={event => this.resetfilterForm(event)} title="Reset Fields"><i className="fa fa-refresh"></i></Button>
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
                                    <th>Area</th>
                                    <th>Skill Set 1 (Rating)</th>
                                    <th>Skill Set 2 (Rating)</th>
                                    <th>Skill Set 3 (Rating)</th>
                                    <th>Documents</th>
                                    <th>Status</th>
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
  // console.log("skillInfo",skillInfo)
  return (<option value={skillInfo.parentId} >{skillInfo.parentName}</option>)
}

export default AssignHireVaRequest;

