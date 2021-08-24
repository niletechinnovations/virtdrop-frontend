import React from "react";
//import  { Link } from 'react-router-dom';
import { Col, Row, Form, FormGroup,FormFeedback, Label, Input, Button, Container, Alert, Card, CardHeader, CardBody } from 'reactstrap';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../../views/Loader/Loader';

import "./BecomeVirtdropPage.css";
import { Multiselect } from 'multiselect-react-dropdown';

//const skillArr = ['ECommerce','Data Entry and Research','SEO','Content Writing and Copywriting','Photo & Video Editing','Customer Support','Social Media Marketing and Management','Real Estate','Web Development and Graphics','Telesales and Telemarketing','Lead Generation','Others'];

class BecomeVirtdropPage extends React.Component {
  constructor( props ){
    super( props );

    this.state = {
      formField: { firstName: '', lastName: '', email:'', mobileNumber:'', skypeID:'', socialMediaID:'', platform:'', portfolioLink:'', skillSet: '', skillSet1: '', skillSet2: '', skillSet3: '', rateSkill1: '', rateSkill2: '', rateSkill3: '', referenceName: '', referenceEmail: '', notes: '' },
      audioFile:'',
      resumeCV:'',
      intentLetter:'',
      internetSpeedScreenshot:'',
      skillList: [],
      successMessage: '',
      loading: false,
      errors: {},
      SelectedClientAreaNeed: [],
      SelectedClientAreaNeed1: [],
      SelectedClientAreaNeed2: [],
      childList: [],
      childList1: [],
      childList2: [],
      childSelectedItem: [],
      childSelectedItem1: [],
      childSelectedItem2: [],

      childSelectedItem: [],
      childSelectedItem1: [],
      childSelectedItem2: [],

    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitMemberForm = this.submitMemberForm.bind(this);

    this.onSelectIndstry = this.onSelectIndstry.bind(this);
    this.onRemoveIndustry = this.onRemoveIndustry.bind(this);
    this.onSelectSubIndstry = this.onSelectSubIndstry.bind(this);
    this.onRemoveSubIndustry = this.onRemoveSubIndustry.bind(this);

    // Skill-2 
    this.onSelectIndstry1 = this.onSelectIndstry1.bind(this);
    this.onRemoveIndustry1 = this.onRemoveIndustry1.bind(this);
    this.onSelectSubIndstry1 = this.onSelectSubIndstry1.bind(this);
    this.onRemoveSubIndustry1 = this.onRemoveSubIndustry1.bind(this);

    // Skill-3
    this.onSelectIndstry2 = this.onSelectIndstry2.bind(this);
    this.onRemoveIndustry2 = this.onRemoveIndustry2.bind(this);
    this.onSelectSubIndstry2 = this.onSelectSubIndstry2.bind(this);
    this.onRemoveSubIndustry2 = this.onRemoveSubIndustry2.bind(this);
  }

  componentDidMount() {
    this.SkillList();
    window.scrollTo(0, 0);
    this.SkillListData();
    
  }

   /*Skill List API*/
   SkillListData() {
    this.setState({ loading: true }, () => {
      commonService.getAPI('skill')
        .then(res => {
          if (undefined === res.data.data || !res.data.status) {
            this.setState({ loading: false });
            toast.error(res.data.message);
            return;
          }
          this.setState({ loading: false, skillList: res.data.data });
        })
        .catch(err => {
          this.setState({ loading: false });
          toast.error(err.message);
        })
    })
  }

  onSelectSubIndstry(selectedList, selectedItem) {
    console.log("LLLLL", selectedList, "---------------", selectedItem)
    const childList = this.state.childList;
    this.setState({ childSelectedItem: selectedList })
  }

  onRemoveSubIndustry(selectedList, removedItem) {
    console.log("child oN Sub REmove", selectedList)
    this.setState({ childSelectedItem: selectedList })


  }

  onSelectIndstry(selectedList, selectedItem) {
      console.log("selectedList************************>", selectedList)
      let seletedVaList = this.state.ClientAreaNeed.filter(item => selectedList.some(o => item.areaId === o.areaId)).map  (skill => skill.vADesignation.map(e => { return ({ skillName: e.skill, skill: e.skillId, areaId: skill.areaId,   areaName: skill.areaName }) }))
      var merged = [].concat.apply([], seletedVaList);
      console.log("merged----s>", merged);
      this.setState({ childList: merged })
  }

  onRemoveIndustry(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList = this.state.childList;
    const result = childList.filter(el=>{return(el.areaId!==removedItem.areaId)})
    console.log("Rwsult Chnn--------", result)
    this.setState({ childList: result })
  }

  // Skill 2

  onSelectSubIndstry1(selectedList, selectedItem) {
    console.log("LLLLL", selectedList, "---------------", selectedItem)
    const childList1 = this.state.childList1;
    this.setState({ childSelectedItem1: selectedList })
  }

  onRemoveSubIndustry1(selectedList, removedItem) {
    console.log("child oN Sub REmove", selectedList)
    this.setState({ childSelectedItem1: selectedList })


  }

  onSelectIndstry1(selectedList, selectedItem) {
    console.log("selectedList************************>", selectedList)
    let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
      var merged = [].concat.apply([], seletedVaList);
              console.log("merged----s>",merged);   
    this.setState({ childList1: merged })
  }

  onRemoveIndustry1(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList1 = this.state.childList1;
    const result = childList1.filter(el=>{return(el.areaId!==removedItem.areaId)})
    console.log("Rwsult Chnn--------", result)
    this.setState({ childList1: result })
  }

  // Skill 3

  onSelectSubIndstry2(selectedList, selectedItem) {
    console.log("LLLLL", selectedList, "---------------", selectedItem)
    const childList1 = this.state.childList1;
    this.setState({ childSelectedItem2: selectedList })
  }

  onRemoveSubIndustry2(selectedList, removedItem) {
    console.log("child oN Sub REmove", selectedList)
    this.setState({ childSelectedItem2: selectedList })


  }

  onSelectIndstry2(selectedList, selectedItem) {
    console.log("selectedList************************>", selectedList)
    let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
      var merged = [].concat.apply([], seletedVaList);
              console.log("merged----s>",merged);  
    this.setState({ childList2: merged })
  }

  onRemoveIndustry2(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList2 = this.state.childList2;
    const result = childList2.filter(el=>{return(el.areaId!==removedItem.areaId)})
    console.log("Rwsult Chnn--------", result)
    this.setState({ childList2: result })
  }

  // ************************
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
          let unique = []
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
          console.log("NEW DATA", newdata)
          this.setState({ ClientAreaNeed: newdata })
          // this.setState({ SelectedClientAreaNeed: this.state.ClientAreaNeed.map(item => { return ({ parentId: item.areaId, parentName: item.areaName }) }) })

          this.setState({ SelectedClientAreaNeed: this.state.ClientAreaNeed.map(e => { return ({ areaId: e.areaId, areaName: e.areaName, vaDesignation: e.vADesignation.map(va => { return ({ areaId: e.areaId, areaName: e.areaName, skillName: va.skillName, skill: va.skill }) }) }) }) })
          this.setState({ SelectedClientAreaNeed1: this.state.ClientAreaNeed.map(e => { return ({ areaId: e.areaId, areaName: e.areaName, vaDesignation: e.vADesignation.map(va => { return ({ areaId: e.areaId, areaName: e.areaName, skillName: va.skillName, skill: va.skill }) }) }) }) })
          this.setState({ SelectedClientAreaNeed2: this.state.ClientAreaNeed.map(e => { return ({ areaId: e.areaId, areaName: e.areaName, vaDesignation: e.vADesignation.map(va => { return ({ areaId: e.areaId, areaName: e.areaName, skillName: va.skillName, skill: va.skill }) }) }) }) })

          // this.setState({SelectedClientAreaNeed1:this.state.ClientAreaNeed.map(e=>{return({parentId:e.parentId,parentName:e.parentName, vaDesignation:e.vADesignation.map(va=>{return({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})})})})})
          // this.setState({SelectedClientAreaNeed2:this.state.ClientAreaNeed.map(e=>{return({parentId:e.parentId,parentName:e.parentName, vaDesignation:e.vADesignation.map(va=>{return({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})})})})})

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
  

  submitMemberForm(e) {
    e.preventDefault();
    e.target.className += " was-validated";
    console.log("Before Validate");
      if (this.validateForm()) {
        console.log("After Validate");
        const formInputField = this.state.formField;
        const formData = new FormData();
        formData.append('firstName', formInputField.firstName);
        formData.append('lastName', formInputField.lastName);
        formData.append('email', formInputField.email.toLowerCase());
        formData.append('mobileNumber', formInputField.mobileNumber);
        formData.append('skypeID', formInputField.skypeID);
        formData.append('socialMediaID', formInputField.socialMediaID);
        formData.append('platform', formInputField.platform);
        formData.append('portfolioLink', formInputField.portfolioLink);

        if (this.state.childSelectedItem !== "")
          formData.append('skillSet1', JSON.stringify(this.state.childSelectedItem));
        if (this.state.childSelectedItem1 !== "")
          formData.append('skillSet2', JSON.stringify(this.state.childSelectedItem1));
        if (this.state.childSelectedItem2 !== "")
          formData.append('skillSet3', JSON.stringify(this.state.childSelectedItem2));

        if (formInputField.rateSkill1 !== "")
          formData.append('rateSkill1', formInputField.rateSkill1);
        if (formInputField.rateSkill2 !== "")
          formData.append('rateSkill2', formInputField.rateSkill2);
        if (formInputField.rateSkill3 !== "")
          formData.append('rateSkill3', formInputField.rateSkill3);
        
        if(formInputField.referenceName !== "")
          formData.append('referenceName', formInputField.referenceName);
        if(formInputField.referenceEmail !== "")
          formData.append('referenceEmail', formInputField.referenceEmail);
        
        if(this.state.audioFile !== "")
          formData.append('audioFile', this.state.audioFile);
        if(this.state.resumeCV !== "")
          formData.append('resumeCV', this.state.resumeCV);
        if(this.state.intentLetter !== "")
          formData.append('intentLetter', this.state.intentLetter);
        if(this.state.internetSpeedScreenshot !== "")
          formData.append('internetSpeedScreenshot', this.state.internetSpeedScreenshot);
        
        
        console.log(formData);

        this.setState( { loading: true }, () => {
          commonService.postAPI( `va-application`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              this.setState({loading: false, successMessage:res.data.message, errors:'' });
              toast.success(res.data.message);
              window.scrollTo(0, 0);
            } )
            .catch( err => {
              toast.error(err.message);
              this.setState( { loading: false} );
            } )
        } )
      }else{
        //console.log("Outside validation area.");
      }
    console.log("Ouside Validate");
     
  };

  changeHandler = event => {
    const name = event.target.name;
    const value = event.target.value;
    const formField = this.state.formField
    formField[name] = value;
    this.setState({ formField: formField, } );
  };

  
  handleSkillChange = e => {
    const { name } = e.target;
    this.setState(prevState => ({
      checkboxes: {
        ...prevState.checkboxes,
        [name]: !prevState.checkboxes[name]
      }
    }));
  };

  handleAudioFileChange = (e) => { this.setState({ audioFile: e.target.files[0] }) };
  handleResumeCVeChange = (e) => { this.setState({ resumeCV: e.target.files[0] }) };
  handleIntentLetterChange = (e) => { this.setState({ intentLetter: e.target.files[0] }) };
  handleInternetSpeedScreenshotChange = (e) => { this.setState({ internetSpeedScreenshot: e.target.files[0] }) };
  

  validateForm() {
    let errors = {};
    let formIsValid = true;
    let formField = this.state.formField;
    if (!formField.firstName) {
        formIsValid = false;
        errors["firstName"] = "*Please enter first name.";
    }
    if (typeof formField.firstName !== "undefined") {
        if (!formField.firstName.match(/^[a-zA-Z ]*$/)) {
            formIsValid = false;
            errors["firstName"] = "*Please enter alphabet characters only.";
        }
    }
    if (!formField.lastName) {
      formIsValid = false;
      errors["lastName"] = "*Please enter last name.";
    }
    if (!formField.email) {
        formIsValid = false;
        errors["email"] = "*Please enter your email-ID.";
    }
    if (typeof formField.email !== "undefined") {
        //regular expression for email validation
        var pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i);
        if (!pattern.test(formField.email)) {
            formIsValid = false;
            errors["email"] = "*Please enter valid email-ID.";
        }
    }
  
    if (!formField.mobileNumber) {
      formIsValid = false;
      errors["mobileNumber"] = "*Please enter your mobile no.";
    }
    if (typeof formField.mobileNumber !== "undefined") {
      if (!formField.mobileNumber.match(/^[0-9]{10}$/)) {
          formIsValid = false;
          errors["mobileNumber"] = "*Please enter valid mobile no.";
      }
    }
   
    if (!formField.skypeID) {
      formIsValid = false;
      errors["skypeID"] = "*This field is required";
    }
    
    if (!formField.platform) {
      formIsValid = false;
      errors["platform"] = "*This field is required";
    }
    
    if(formIsValid=== false)
      window.scrollTo(0, 0);
    
    this.setState({
      loading: false,
      errors: errors
    });
    //console.error(errors);
    return formIsValid;
  }

  render() {
    const { loading, formField, errors, SelectedClientAreaNeed, SelectedClientAreaNeed1, SelectedClientAreaNeed2, childList, childList1, childList2, childSelectedItem, childSelectedItem1, childSelectedItem2} = this.state;
    
    console.log("ChildList11--1", childSelectedItem)
    console.log("ChildList11--2", childSelectedItem1)
    console.log("ChildList11--3", childSelectedItem2)


    let loaderElement = '';
    if(loading)
      loaderElement = <Loader />

      return (
        <>
        
        <div className="page-wrapper">
          <Container>
            <section className="dashboard-section mb-5">
              <ToastContainer />
              {loaderElement} 
              <Row>
                  <Col md="12">
                    <Card className="vd-card">
                      <CardHeader>
                        <div className="d-flex align-items-center">
                          <div className="mr-auto">
                            <h4 className="card-title">{ this.state.successMessage!=='' ? 'Thank you for applying' : 'VIRTDROP VA Application'}</h4>
                          </div>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <div className="form-info">
                          { this.state.successMessage!=='' ?
                            <Alert color="success">
                              <h4 className="text-center mt-4">Thank you for applying as a Virdrop VA.</h4>
                              <h4 className="text-center mb-4">We will get in touch with you as soon as possible for next step.</h4>
                            </Alert>
                          :
                          <Form onSubmit={this.submitMemberForm} noValidate>
                            <div  className="form-service-listing">
                              <h2>Personal Information</h2>
                              <Row>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label htmlFor="firstName">First Name *</Label>
                                    <Input type="text" name="firstName" id="firstName" invalid={errors['firstName'] !== undefined && errors['firstName'] !== ""} value={formField.firstName} onChange={this.changeHandler} placeholder="First Name" required />
                                    <FormFeedback>{errors['firstName']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={6}>
                                  <FormGroup>
                                    <Label htmlFor="lastName">Last Name *</Label>
                                    <Input type="text" name="lastName" id="lastName" value={formField.lastName} invalid={errors['lastName'] !== undefined && errors['lastName'] !== ""} onChange={this.changeHandler} placeholder="Last Name" required />
                                    <FormFeedback>{errors['lastName']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={3}>
                                  <FormGroup>
                                    <Label htmlFor="mobileNumber">Mobile Number *</Label>
                                      <Input type="number" name="mobileNumber" min={1} step="1" id="mobileNumber" invalid={errors['mobileNumber'] !== undefined && errors['mobileNumber'] !== ""} placeholder="Mobile no." value={formField.mobileNumber} onChange={this.changeHandler} required />
                                      <FormFeedback>{errors['mobileNumber']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={3}>
                                  <FormGroup>
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input type="email" name="email" id="email" placeholder="Email Address" invalid={errors['email'] !== undefined && errors['email'] !== ""} value={formField.email} onChange={this.changeHandler} required />
                                    <FormFeedback>{errors['email']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={3}>
                                  <FormGroup>
                                    <Label htmlFor="skypeID">Skype ID *</Label>
                                    <Input type="text" name="skypeID" invalid={errors['skypeID'] !== undefined && errors['skype'] !== ""} id="skypeID" value={formField.skypeID} onChange={this.changeHandler} placeholder="Skype ID" required />
                                    <FormFeedback>{errors['skypeID']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md={3}>  
                                  <FormGroup>
                                    <Label htmlFor="socialMediaID">Social Media IDs (optional)</Label>
                                    <Input type="text" name="socialMediaID" id="socialMediaID" value={formField.socialMediaID} placeholder="Social Media IDs" onChange={this.changeHandler} />
                                  </FormGroup>
                                </Col>
                                <Col md="12">
                                  <FormGroup>
                                    <Label>Platforms, Tools, Systems , CRM *</Label>
                                    <Input type="textarea" name="platform" value={formField.platform} placeholder="Platforms, Tools, Systems, CRM" onChange={this.changeHandler} required />
                                    <FormFeedback>{errors['platform']}</FormFeedback>
                                  </FormGroup>
                                </Col>
                                <Col md="12">
                                  <FormGroup>
                                    <Label>Website/ Portfolio Links </Label>
                                    <Input type="text" name="portfolioLink" value={formField.portfolioLink} placeholder="Website/ Portfolio Links" onChange={this.changeHandler} />
                                  </FormGroup>
                                </Col>
                              </Row>
                            </div>
                          
                            <div className="form-service-listing">
                              <h4>Skills Set</h4>
                              <Row>
                                <Col md="12" sm="12">
                                  <Row>
                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="area">Area 1</Label>
                                        <Multiselect
                                          options={SelectedClientAreaNeed}
                                          ref={this.multiselectRef}
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectIndstry}
                                          onRemove={this.onRemoveIndustry}
                                          // groupBy="parentName"
                                          selectedValues={formField.AreaSkillSet1}
                                          displayValue="areaName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet1']}</FormFeedback>
                                      </FormGroup>
                                    </Col>

                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="skillSet1">Skill Set 1</Label>
                                        <Multiselect
                                          options={childList}
                                          // groupBy="cat"
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectSubIndstry}
                                          onRemove={this.onRemoveSubIndustry}
                                          groupBy="AreaName"
                                          selectedValues={formField.skillSet1}
                                          displayValue="skillName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet1']}</FormFeedback>
                                      </FormGroup>
                                    </Col>
                                    <Col md="2" sm="6">
                                      <FormGroup>
                                        <Label htmlFor="area">Rating</Label>
                                        <Input type="number" name="rateSkill1" value={formField.rateSkill1} placeholder="Rating" min="1" max="5" onChange={this.changeHandler} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Skill-2  */}

                                <Col md="12" sm="12">
                                  {/* <h4>Skill Set 1</h4> */}
                                  <Row>
                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="area">Area 2</Label>
                                        <Multiselect
                                          options={SelectedClientAreaNeed1}
                                          ref={this.multiselectRef}
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectIndstry1}
                                          onRemove={this.onRemoveIndustry1}
                                          // groupBy="parentName"
                                          selectedValues={formField.AreaSkillSet2}
                                          displayValue="areaName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet1']}</FormFeedback>
                                      </FormGroup>
                                    </Col>

                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="skillSet2">Skill Set 2</Label>
                                        <Multiselect
                                          options={childList1}
                                          // groupBy="cat"
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectSubIndstry1}
                                          onRemove={this.onRemoveSubIndustry1}
                                          groupBy="areaName"
                                          selectedValues={formField.skillSet2}
                                          displayValue="skillName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet2']}</FormFeedback>
                                      </FormGroup>
                                    </Col>
                                    <Col md="2" sm="6">
                                      <FormGroup>
                                        <Label htmlFor="area">Rating 2</Label>
                                        <Input type="number" name="rateSkill2" value={formField.rateSkill2} placeholder="Rating" min="1" max="5" onChange={this.changeHandler} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Col>
                                {/* Skill-3 */}

                                <Col md="12" sm="12">
                                  {/* <h4>Skill Set 1</h4> */}
                                  <Row>
                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="area">Area 3</Label>
                                        <Multiselect
                                          options={SelectedClientAreaNeed2}
                                          ref={this.multiselectRef}
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectIndstry2}
                                          onRemove={this.onRemoveIndustry2}
                                          // groupBy="parentName"
                                          selectedValues={formField.AreaSkillSet3}
                                          displayValue="areaName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet3']}</FormFeedback>
                                      </FormGroup>
                                    </Col>

                                    <Col md="5" sm="6">
                                      <FormGroup>

                                        <Label htmlFor="skillSet3">Skill Set 3</Label>
                                        <Multiselect
                                          options={childList2}
                                          // groupBy="cat"
                                          onChange={this.changeHandler}
                                          onSelect={this.onSelectSubIndstry2}
                                          onRemove={this.onRemoveSubIndustry2}
                                          groupBy="areaName"
                                          selectedValues={formField.skillSet3}
                                          displayValue="skillName"
                                          showCheckbox={true}
                                        />
                                        <FormFeedback>{errors['skillSet3']}</FormFeedback>
                                      </FormGroup>
                                    </Col>
                                    <Col md="2" sm="6">
                                      <FormGroup>
                                        <Label htmlFor="area">Rating 3</Label>
                                        <Input type="number" name="rateSkill3" value={formField.rateSkill3} placeholder="Rating" min="1" max="5" onChange={this.changeHandler} />
                                      </FormGroup>
                                    </Col>
                                  </Row>
                                </Col>
                              </Row>
                            </div>

                          <div className="form-service-listing">
                            <h2>Upload</h2>
                            <div className="row">
                                <div className="col-md-3">
                                    <div className="file-box">
                                      <h3>Audio Clip/File</h3>
                                      <Input type="file" id="audioFile" name="audioFile" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleAudioFileChange} />
                                      <label htmlFor="audioFile">
                                        <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                        <span>{ this.state.audioFile!=='' ? this.state.audioFile.name : 'Choose a file' }&hellip;</span>
                                    </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                    <div className="file-box">
                                      <h3>Resumes/CVS</h3>
                                      <Input type="file" id="resumeCV" name="resumeCV" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleResumeCVeChange} />
                                      <label htmlFor="resumeCV">
                                        <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                        <span>{ this.state.resumeCV!=='' ? this.state.resumeCV.name : 'Choose a file' }&hellip;</span>
                                    </label>
                                    </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="file-box">
                                    <h3>Intent Letter </h3>
                                    <Input type="file" id="intentLetter" name="intentLetter" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleIntentLetterChange} />
                                    <label htmlFor="intentLetter"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                      <span>{ this.state.intentLetter!=='' ? this.state.intentLetter.name : 'Choose a file' }&hellip;</span>
                                    </label>
                                  </div>
                                </div>
                                <div className="col-md-3">
                                  <div className="file-box">
                                    <h3>Internet Connection Speed screenshot </h3>
                                    <Input type="file" id="internetSpeedScreenshot" name="internetSpeedScreenshot" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleInternetSpeedScreenshotChange} />
                                    <label htmlFor="internetSpeedScreenshot">
                                      <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure>
                                      <span>{ this.state.internetSpeedScreenshot!=='' ? this.state.internetSpeedScreenshot.name : 'Choose a file' }&hellip;</span>
                                    </label>
                                  </div>
                                </div>
                            </div>
                          </div>
                          <div  className="form-service-listing">
                            <h2>References</h2>
                            <Row>
                              <Col md={6}>
                                <FormGroup>
                                  <Label htmlFor="referenceName">Name</Label>
                                  <Input type="text" name="referenceName" id="referenceName" value={formField.referenceName} onChange={this.changeHandler} placeholder="Reference Name" />
                                </FormGroup>
                              </Col>
                              <Col md={6}>
                                <FormGroup>
                                  <Label htmlFor="referenceEmail">Email</Label>
                                  <Input type="email" name="referenceEmail" id="referenceEmail" value={formField.referenceEmail} onChange={this.changeHandler} placeholder="Reference Email" />
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>  
                          <div className="form-service-listing">
                            <div className="row">
                                <div className="col-md-2">
                                    <div className="form-group">
                                      <Button className="submit-btn">Submit</Button>
                                    </div>
                                </div>
                            </div>
                          </div>

                        
                        </Form>
                        }
                        </div>
                      </CardBody>
                    </Card>
                  </Col>
                  
                </Row>
                
            </section>
          </Container>
        </div>
        </>
      );
  }
}

function SetSkillDropDownItem (props) {
  const skill = props.skillInfo;
  return (<option value={skill.skillId} >{skill.skillName}</option>)
}

export default BecomeVirtdropPage;
