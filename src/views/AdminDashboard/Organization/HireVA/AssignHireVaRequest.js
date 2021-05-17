import React, { Component } from 'react';
import { Card, CardBody, Col, Row, Button, Input, Label, InputGroup, InputGroupAddon } from 'reactstrap';
// import { Card, CardBody, CardHeader, Col, Row, Button, Input, FormGroup, Label, FormFeedback, InputGroup, InputGroupAddon } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';
import { Link } from 'react-router-dom';
import ClientAreaNeed from './clientNeedAreaList.json';
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



  componentDidMount() {
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
    this.getSkillList();
    this.parentChildrenDataHandler();
    // this.onChangeSelectHandler();
    // this.assignObjectPaths(ClientAreaNeed);

    this.setState({ SelectedClientAreaNeed: ClientAreaNeed.clientArea.map(item => { return ({ parentId: item.parentId, parentName: item.parentName }) }) })

    //   this.assignObjectPaths(this.state.SelectedClientAreaNeed);
    // this.onNodeToggle()
    // this.onAction()


    // this.scrollToMyRef()

    // tree view selection 
    // ClientAreaNeed.clientArea

  }
  // scrollToMyRef = () => window.scrollTo(0, this.myRef.current.offsetTop)   

  // tree select 

  // onChangeSelectHandler = (currentNode, selectedNodes) => {
  //   console.log("path::", selectedNodes,"====curentNode===>",currentNode);
  //   // console.log("selectedNodes",selectedNodes._children)
  //   if(selectedNodes !=undefined){
  //     console.log("selectedNodes",selectedNodes._children)
  //   }
  // };

  // assignObjectPaths = (obj, stack) => {
  //   console.log("obje-------->",obj,"Stack",stack)
  //   Object.keys(obj).forEach(k => {
  //     const node = obj[k];
  //     if (typeof node === "object") {
  //       node.path = stack ? `${stack}.${k}` : k;
  //       this.assignObjectPaths(node, node.path);
  //     }
  //   });
  // };

  // onNodeToggle(currentNode) {
  //   console.log("currentNode On===>>>>>>>>>",currentNode)
  //   // currentNode: { label, value, children, expanded, checked, className, ...extraProps }
  // }
  //  onAction = (node, action) => {
  //   console.log('onAction::>>>>>>>>', action, node)
  // }

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
    let seletedVaList = ClientAreaNeed.clientArea.filter(item => selectedList.some(o => item.parentId === o.parentId)).map(skill => skill.vADesignation.map(e => { return ({ profileName: e.profileName, id: e.id, parentId: skill.parentId, parentName: skill.parentName }) }))
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

  filterVaMemberList() {
    const filterItem = this.state.filterItem;
    const skillSearch = this.state.childSelectedItem;
    filterItem.filter_Parent_Skills = this.state.selectedParentSkill.length > 0 ? this.state.selectedParentSkill[0].parentId : [];
    filterItem.filter_Skills = this.state.childSelectedItem.id;
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
      // console.log("userData.skillSet",userData.ParentSkillSet)

      let userInfo = {
        SNo: i,
        authId: userData.authId,
        userName: userData.firstName + ' ' + userData.lastName,
        email: userData.email,
        // Area: userData.ParentSkillSet1.map(e=>e.parentName) + ',' + userData.ParentSkillSet2.map(e=>e.parentName)  + ',' + userData.ParentSkillSet3.map(e=>e.parentName),
        Area: userData.ParentSkillSet.map(e => e.parentName).toString(),
        skillSet: userData.skillSet1.map(e => e.profileName) + ',' + userData.skillSet2.map(e => e.profileName) + ',' + userData.skillSet3.map(e => e.profileName),
      }
      rowsItem.push(userInfo);
    }
    let list = rowsItem.map((user, index) => {
      return (
        <tr key={user.SNo}>
          {/* {assignedVaList.includes(user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>} */}
          { assignedVaList.find(el => el.authId === user.authId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>}
          <td>{user.SNo + 1}</td>
          <td>{user.userName}</td>
          <td>{user.email}</td>
          <td>{user.Area}</td>
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
                                {/* <Input type = "select" placeholder="Filter by skills" name="filter_Skills" value={this.state.filterItem.filter_Skills} onChange={this.changeFilterHandler}>
                                    <option value="">All</option>
                                        {skillList.map((skillInfo, index) =>
                                            <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                        )}
                                        </Input> */}
                                {/* <Input type = "select" placeholder="Filter by skills" name="filter_Skills" value={this.state.filterItem.filter_Skills} onChange={this.changeFilterHandler}>
                                       <option value="">All</option> */}
                                {/* {ClientAreaNeed.clientArea.map((skillInfo, index) =>
                                            <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                        )} */}
                                {/* <CheckboxTree
                                             checked={checked}
                                             expanded={expanded}
                                            //  iconsClass="fa5"
                                             nodes={nodes}
                                             onCheck={checked => this.setState({ checked })}
                                             onExpand={expanded => this.setState({ expanded })}
                                           /> */}
                                {/* </Input> */}
                                {/* 
                                        <Input type = "select" placeholder="Filter by skills" name="filter_Skills" value={this.state.filterItem.filter_Skills} onChange={this.changeFilterHandler}>
                                       <option value="">All</option> */}
                                <Label htmlFor="area">Area</Label>
                                <Multiselect
                                  options={SelectedClientAreaNeed}
                                  // groupBy="cat"
                                  onChange={this.changeHandler}
                                  singleSelect
                                  id="css_custom"
                                  style={{chips: {background: "#4bb8f9" }, searchBox: {border: "1px solid grey", "borderBottom": "1px solid grey", "borderRadius": "0px" } }}
                                               

                                  // .searchBox#css_custom_input::placeholder {{color: red} }
                                  onSelect={this.onSelectIndstry}
                                  onRemove={this.onRemoveIndustry}
                                  // groupBy="parentName"
                                  // selectedValues={SelectedClientAreaNeed}
                                  displayValue="parentName"
                                  showCheckbox={true}
                                />
                              </Col>
                              <Col md={4}>
                                <Label htmlFor="skills">Skills</Label>
                                <Multiselect
                                  options={childList}
                                  // groupBy="cat"
                                  onChange={this.changeHandler}
                                  singleSelect
                                  onSelect={this.onSelectSubIndstry}
                                  onRemove={this.onRemoveSubIndustry}
                                  groupBy="parentName"
                                  // selectedValues={SelectedClientAreaNeed}
                                  id="css_custom"
                                  style={{chips: {background: "#4bb8f9" }, searchBox: {border: "1px solid grey", "borderBottom": "1px solid grey", "borderRadius": "0px" } }}
                                  displayValue="profileName"
                                  showCheckbox={true}
                                />
                                {/* <div ref={this.myRef} className="AddScroll">
                                <DropdownTreeSelect
                                texts={{ placeholder: 'Select' }}
                                  data={SelectedClientAreaNeed}
                                  onChange={this.onChangeSelectHandler}
                                  className="bootstrap-demo"
                                  onAction={this.onAction} 
                                  onNodeToggle={this.onNodeToggle}
                                  // showDropdown= {showDropdown}
                                  // inlineSearchInput={true}
                                />
                                </div> */}
                                {/* </Input> */}

                              </Col>
                              <Col md={1}>
                                <Label htmlFor="area">Search</Label>
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
                                    <th>Area</th>
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
  // console.log("skillInfo",skillInfo)
  return (<option value={skillInfo.parentId} >{skillInfo.parentName}</option>)
}

export default AssignHireVaRequest;

