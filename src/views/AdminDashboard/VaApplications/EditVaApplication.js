import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, Row, Form, Button, Input, FormGroup, Label, FormFeedback, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../core/services/commonService';
import Loader from '../../Loader/Loader';
import "./../../Pages/Frontend/BeAVirtdropVA/BecomeVirtdropPage.css";
// import ClientAreaNeed from '../Organization/HireVA/clientNeedAreaList.json';
import { Multiselect } from 'multiselect-react-dropdown';

//const skillArr = ['ECommerce','Data Entry and Research','SEO','Content Writing and Copywriting','Photo & Video Editing','Customer Support','Social Media Marketing and Management','Real Estate','Web Development and Graphics','Telesales and Telemarketing','Lead Generation','Others'];


class EditVaApplication extends Component {
  constructor(props){
    super(props);
    this.state = {
      ClientAreaNeed:[],
      vaApplicationId: '',
      requestStatus:'',
      formField: { authId:'', firstName: '', lastName: '', email:'', mobileNumber:'', skypeID:'', socialMediaID:'', platform:'', portfolioLink:'', status:'', skillSet:'',skillSet1:[], skillSet2:[], skillSet3:[], AreaSkillSet1:[],AreaSkillSet2:[], AreaSkillSet3:[], rateSkill1:'', rateSkill2:'', rateSkill3:'', referenceName:'', referenceEmail:'', notes:'', statusText:'' },
      applicationFiles: {audioFile:'', resumeCV:'', intentLetter:'', internetSpeedScreenshot:'' },
      audioFile:'',
      resumeCV:'',
      intentLetter:'',
      internetSpeedScreenshot:'',
      skillList: [],
      successMessage: '',
      dropDownOpen: '',
      loading: false,
      errors: {},
      SelectedClientAreaNeed:[],
      SelectedClientAreaNeed1:[],
      SelectedClientAreaNeed2:[],
      childList:[],
      childList1:[],
      childList2:[],
      childSelectedItem:[],
      childSelectedItem1:[],
      childSelectedItem2:[],

      AreaSelectedList:[],
    } 
    this.multiselectRef = React.createRef();

    this.submitFormData = this.submitFormData.bind(this);

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

  onSelectSubIndstry(selectedList, selectedItem){
    console.log("LLLLL",selectedList,"---------------",selectedItem)
    const childList = this.state.childList;
    this.setState({childSelectedItem:selectedList})
  }

  onRemoveSubIndustry(selectedList, removedItem){
    console.log("child oN Sub REmove",selectedList)
    this.setState({childSelectedItem:selectedList})


  }

  onSelectIndstry(selectedList, selectedItem) {
    console.log("selectedList***********888*************>", selectedList,this.state.ClientAreaNeed)
      let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
      var merged = [].concat.apply([], seletedVaList);
              console.log("merged----s>",merged);   
              this.setState({childList:merged})             
  }

  onRemoveIndustry(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList= this.state.childList;
        const result =  childList.filter(el=>{return(el.areaId!==removedItem.areaId)})
        console.log("Rwsult Chnn--------",result)
      this.setState({childList:result})
  }

  // Skill 2

  onSelectSubIndstry1(selectedList, selectedItem){
    console.log("LLLLL",selectedList,"---------------",selectedItem)
    const childList1 = this.state.childList1;
    this.setState({childSelectedItem1:selectedList})
  }

  onRemoveSubIndustry1(selectedList, removedItem){
    console.log("child oN Sub REmove",selectedList)
    this.setState({childSelectedItem1:selectedList})


  }

  onSelectIndstry1(selectedList, selectedItem) {
    console.log("selectedList**********1**************>", selectedList)
    let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
    var merged = [].concat.apply([], seletedVaList);
              // console.log("merged",merged);   
              this.setState({childList1:merged})             
  }

  onRemoveIndustry1(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList1= this.state.childList1;
        const result =  childList1.filter(el=>{return(el.areaId!==removedItem.areaId)})
        console.log("Rwsult Chnn--------",result)
      this.setState({childList1:result})
  }

  // Skill 3

  onSelectSubIndstry2(selectedList, selectedItem){
    console.log("LLLLL",selectedList,"---------------",selectedItem)
    const childList1 = this.state.childList1;
    this.setState({childSelectedItem2:selectedList})
  }

  onRemoveSubIndustry2(selectedList, removedItem){
    console.log("child oN Sub REmove",selectedList)
    this.setState({childSelectedItem2:selectedList})


  }

  onSelectIndstry2(selectedList, selectedItem) {
    console.log("selectedList************************>", selectedList)
    let seletedVaList = this.state.ClientAreaNeed.filter(item =>selectedList.some(o=>item.areaId===o.areaId)).map(skill =>skill.vADesignation.map(e=>{return({skillName:e.skill, skill:e.skillId , areaId:skill.areaId,areaName:skill.areaName})}))
    var merged = [].concat.apply([], seletedVaList);
              // console.log("merged",merged);   
              this.setState({childList2:merged})          
  }

  onRemoveIndustry2(selectedList, removedItem) {
    console.log("remove---------", selectedList)
    let childList2= this.state.childList2;
        const result =  childList2.filter(el=>{return(el.areaId!==removedItem.areaId)})
        console.log("Rwsult Chnn--------",result)
      this.setState({childList2:result})
  }
 
  componentDidMount() { 
    this.SkillList();
    const { match: { params } } = this.props;    
    if(params.vaApplicationId !== undefined && params.vaApplicationId !=="") {
      this.setState({vaApplicationId: params.vaApplicationId});
      this.getApplicationInfo(params.vaApplicationId);
    }else 
      this.props.history.push('/admin/va-application');

    this.SkillListData();
    console.log("ClientAreaNeed-------------::::::",this.state.ClientAreaNeed.map(e=>{return(e.vADesignation.map(va=>
      ({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})))}))

    // this.setState({SelectedClientAreaNeed:this.state.ClientAreaNeed.map(e=>{return({parentId:e.parentId,parentName:e.parentName, vaDesignation:e.vADesignation.map(va=>{return({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})})})})})
    // this.setState({SelectedClientAreaNeed1:this.state.ClientAreaNeed.map(e=>{return({parentId:e.parentId,parentName:e.parentName, vaDesignation:e.vADesignation.map(va=>{return({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})})})})})
    // this.setState({SelectedClientAreaNeed2:this.state.ClientAreaNeed.map(e=>{return({parentId:e.parentId,parentName:e.parentName, vaDesignation:e.vADesignation.map(va=>{return({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})})})})})

    // this.setState({childList:ClientAreaNeed.clentArea.map(e=>{return(e.vADesignation.map(va=>
    //   ({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})))})})
    // this.setState({childList1:ClientAreaNeed.clientArea.map(e=>{return(e.vADesignation.map(va=>
    //   ({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})))})})
    // this.setState({childList2:ClientAreaNeed.clientArea.map(e=>{return(e.vADesignation.map(va=>
    //   ({parentId:e.parentId,parentName:e.parentName, profileName:va.profileName, id:va.id})))})})
    
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
// this.setState({ SelectedClientAreaNeed: this.state.ClientAreaNeed.map(item => { return ({ parentId: item.areaId, parentName: item.areaName }) }) })

this.setState({SelectedClientAreaNeed:this.state.ClientAreaNeed.map(e=>{return({areaId:e.areaId,areaName:e.areaName, vaDesignation:e.vADesignation.map(va=>{return({areaId:e.areaId,areaName:e.areaName, skillName:va.skillName, skill:va.skill})})})})})
this.setState({SelectedClientAreaNeed1:this.state.ClientAreaNeed.map(e=>{return({areaId:e.areaId,areaName:e.areaName, vaDesignation:e.vADesignation.map(va=>{return({areaId:e.areaId,areaName:e.areaName, skillName:va.skillName, skill:va.skill})})})})})
this.setState({SelectedClientAreaNeed2:this.state.ClientAreaNeed.map(e=>{return({areaId:e.areaId,areaName:e.areaName, vaDesignation:e.vADesignation.map(va=>{return({areaId:e.areaId,areaName:e.areaName, skillName:va.skillName, skill:va.skill})})})})})

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

  // ************************
  
  /*Skill List API*/
  SkillListData() {  
    this.setState( { loading: true}, () => {
      commonService.getAPI('skill')
        .then( res => {
          if ( undefined === res.data.data || !res.data.status ) {
            this.setState( {  loading: false } );
            toast.error(res.data.message);    
            return;
          }   
          this.setState({loading:false, skillList: res.data.data});              
        } )
        .catch( err => {         
          this.setState( { loading: false } );
          toast.error(err.message);    
        } )
    } )
  }
  
  getApplicationInfo(vaApplicationId){
    this.setState( { loading: true}, () => {
        commonService.getAPIWithAccessToken('va-application/'+vaApplicationId)
        .then( res => {
          // console.log("Get",res)
          if ( undefined === res.data.data || !res.data.status ) {
           
            this.setState( { loading: false} );
            toast.error(res.data.message);
            return;
          } 
          const appDetail = res.data.data;
          let formField = this.state.formField;
          formField.firstName = appDetail.firstName;
          formField.lastName = appDetail.lastName;
          formField.email = appDetail.email;
          formField.mobileNumber = appDetail.mobileNumber;
          formField.skypeID = appDetail.skypeID;
          formField.socialMediaID = appDetail.socialMediaID;
          formField.platform = appDetail.platform;
          formField.portfolioLink = appDetail.portfolioLink;
          formField.status = appDetail.status;
          formField.status = appDetail.statusText;

// console.log("eeeee", [... new Set(appDetail.skillSet1.map(e=>e.parentName))])

// skill 1
const uniqueObjectArray1=[]
const uniqueObjectSet1 = new Set()
for(const object1 of appDetail.skillSet1){
  const objectJSON1 = JSON.stringify(object1.areaId);
  if(!uniqueObjectSet1.has(objectJSON1)){
    uniqueObjectArray1.push(object1)
  }
  uniqueObjectSet1.add(objectJSON1)

}
// console.log("uniqueObjectArray",...uniqueObjectArray1)

// skill 2
const uniqueObjectArray2=[]
const uniqueObjectSet2 = new Set()
for(const object2 of appDetail.skillSet2){
  var objectJSON2 = JSON.stringify(object2.areaId);
  if(!uniqueObjectSet2.has(objectJSON2)){
    uniqueObjectArray2.push(object2)
  }
  uniqueObjectSet2.add(objectJSON2)

}
// console.log("uniqueObjectArray",uniqueObjectArray2)

// skill 3
const uniqueObjectArray3=[]
const uniqueObjectSet3 = new Set()
for(const object3 of appDetail.skillSet3){
  var objectJSON3 = JSON.stringify(object3.areaId);
  if(!uniqueObjectSet3.has(objectJSON3)){
    uniqueObjectArray3.push(object3)
  }
  uniqueObjectSet3.add(objectJSON3)

}
// console.log("uniqueObjectArray",...uniqueObjectArray3)

          formField.skillSet1 = appDetail.skillSet1;
          formField.skillSet2 = appDetail.skillSet2;
          formField.skillSet3 = appDetail.skillSet3;

          formField.AreaSkillSet1 = uniqueObjectArray1;
          formField.AreaSkillSet2 = uniqueObjectArray2;
          formField.AreaSkillSet3 = uniqueObjectArray3;

          formField.rateSkill1 = appDetail.rateSkill1;
          formField.rateSkill2 = appDetail.rateSkill2;
          formField.rateSkill3 = appDetail.rateSkill3;
          formField.referenceName = appDetail.referenceName;
          formField.referenceEmail = appDetail.referenceEmail;
          formField.notes = appDetail.notes;
          formField.statusText = appDetail.statusText;
         
          let applicationFiles = this.state.applicationFiles;
          applicationFiles.audioFileName = appDetail.audioFileName;
          applicationFiles.audioFile = appDetail.audioFile;
          applicationFiles.resumeCVName = appDetail.resumeCVName;
          applicationFiles.resumeCV = appDetail.resumeCV;
          applicationFiles.intentLetterName = appDetail.intentLetterName;
          applicationFiles.intentLetter = appDetail.intentLetter;
          applicationFiles.internetSpeedScreenshotName = appDetail.internetSpeedScreenshotName;
          applicationFiles.internetSpeedScreenshot = appDetail.internetSpeedScreenshot;
          
          const statusBtn = <Button type="button" size="sm" className={ ( appDetail.status ? 'btn-danger' : 'btn-success' )} onClick={() => 
            this.changeFoodTruckStatus(appDetail.vaApplicationId, appDetail.status )} >{ ( appDetail.status ? 'Un-Approve Application' : 'Approve Application' )}</Button>
          
          this.setState({ loading: false, appDetail: appDetail, changeStatusBtn:statusBtn, formValid: true, formField: formField, applicationFiles: applicationFiles});
        } )
        .catch( err => {               
          if(err.response !== undefined && err.response.status === 401) {
            localStorage.clear();
            this.props.history.push('/login');
          }
          else
            this.setState( { loading: false } );
            toast.error(err.message);
        } )
    } );
  }

  submitFormData(e) {
    e.preventDefault();
    e.target.className += " was-validated";
      if (this.validateForm()) {
        const formInputField = this.state.formField;
        const formData = new FormData();
        formData.append('vaApplicationId', this.state.vaApplicationId);
        formData.append('firstName', formInputField.firstName);
        formData.append('lastName', formInputField.lastName);
        formData.append('email', formInputField.email.toLowerCase());
        formData.append('mobileNumber', formInputField.mobileNumber);
        formData.append('skypeID', formInputField.skypeID);
        formData.append('socialMediaID', formInputField.socialMediaID);
        formData.append('platform', formInputField.platform);
        formData.append('portfolioLink', formInputField.portfolioLink);
        formData.append('status', formInputField.status);
        
        // if(formInputField.skillSet1 !== "")
        //   formData.append('skillSet1', formInputField.skillSet1);
        // if(formInputField.skillSet2 !== "")
        //   formData.append('skillSet2', formInputField.skillSet2);
        // if(formInputField.skillSet3 !== "")
        //   formData.append('skillSet3', formInputField.skillSet3);

        
        // if(formInputField.skillSet1 !== "")
        //   formData.append('skillSet1', this.state.formField.skillSet1.length>0? JSON.stringify(this.state.formField.skillSet1): JSON.stringify(this.state.childSelectedItem));
        // if(formInputField.skillSet2 !== "")
        //   formData.append('skillSet2', this.state.formField.skillSet2.length>0? JSON.stringify(this.state.formField.skillSet2): JSON.stringify(this.state.childSelectedItem1));
        // if(formInputField.skillSet3 !== "")
        //   formData.append('skillSet3',  this.state.formField.skillSet3.length>0? JSON.stringify(this.state.formField.skillSet3): JSON.stringify(this.state.childSelectedItem2));

        console.log("this.state.childSelectedItem",this.state.childSelectedItem,"----SkillSee-----",this.state.formField.skillSet1)
       
       if(formInputField.skillSet1 !== "")
        formData.append('skillSet1', this.state.childSelectedItem.length>0? JSON.stringify(this.state.childSelectedItem):JSON.stringify(this.state.formField.skillSet1) );
      if(formInputField.skillSet2 !== "")
        formData.append('skillSet2', this.state.childSelectedItem1.length>0? JSON.stringify(this.state.childSelectedItem1):JSON.stringify(this.state.formField.skillSet2));
      if(formInputField.skillSet3 !== "")
        formData.append('skillSet3',  this.state.childSelectedItem2.length>0? JSON.stringify(this.state.childSelectedItem2):JSON.stringify(this.state.formField.skillSet3));

        if(formInputField.rateSkill1 !== "")
          formData.append('rateSkill1', formInputField.rateSkill1);
        if(formInputField.rateSkill2 !== "")
          formData.append('rateSkill2', formInputField.rateSkill2);
        if(formInputField.rateSkill3 !== "")
          formData.append('rateSkill3', formInputField.rateSkill3);
        if(formInputField.referenceName !== "")
          formData.append('referenceName', formInputField.referenceName);
        if(formInputField.referenceEmail !== "")
          formData.append('referenceEmail', formInputField.referenceEmail);
        if(formInputField.notes !== "")
          formData.append('notes', formInputField.notes);
        
        if(this.state.audioFile !== "")
          formData.append('audioFile', this.state.audioFile);
        if(this.state.resumeCV !== "")
          formData.append('resumeCV', this.state.resumeCV);
        if(this.state.intentLetter !== "")
          formData.append('intentLetter', this.state.intentLetter);
        if(this.state.internetSpeedScreenshot !== "")
          formData.append('internetSpeedScreenshot', this.state.internetSpeedScreenshot);
        
        this.setState( { loading: true }, () => {
           commonService.putAPIWithAccessToken( `va-application/`, formData )
            .then( res => {
              if ( undefined === res.data || !res.data.status ) {
                this.setState( { loading: false } );
                toast.error(res.data.message);
                return;
              }
              this.setState({loading: false, successMessage:res.data.message, errors:'' });
              this.props.history.push('/admin/va-application/');
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
    return formIsValid;
  }
  
  toggle = () => {
    this.setState({
      dropDownOpen: !this.state.dropDownOpen,
    })
  }

  changeApplicationStatus = (requestStatus) => {
    
    this.setState( { loading: true}, () => {
      
      const statusFormData = {
        "vaApplicationId": this.state.vaApplicationId,
        "status": requestStatus,
      };
      
      //create profile if not created 
      const formField = this.state.formField;
      const userData = {
        "email": formField.email.toLowerCase(),
        "firstName": formField.firstName, 
        "lastName": formField.lastName, 
        "mobileNumber": formField.mobileNumber,
        "role": 'va_member'
      }
      let authId = this.state.formField.authId;
      if(authId==='' && requestStatus===2){
        commonService.postAPIWithAccessToken('organization', userData)
        .then( res => {
          if ( undefined === res.data.data || !res.data.status || !res.data.authInfo ) { 
            //this.setState( { formProccessing: false} );
            //toast.error(res.data.message);
            //return;
          }
          if( res.data.authInfo ) { 
            authId = res.data.authInfo.authId;
          }else{
            authId = res.data.data.authId;
          }
          
          statusFormData.authId = authId;
          commonService.putAPIWithAccessToken('va-application/status', statusFormData)
          .then( res => {
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            } 
            this.setState({ loading: false});
            toast.success(res.data.message);
            this.getApplicationInfo(this.state.vaApplicationId);        
          } )
          .catch( err => {         
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else
              this.setState( { loading: false } );
              toast.error(err.message);
          } )

        } )
      }else{
        if(requestStatus !== undefined && requestStatus===3){
          let deleteFormdata = { "vaApplicationId":this.state.vaApplicationId }
          commonService.deleteAPIWithAccessToken( 'va-application',deleteFormdata)
          .then( res => {
            this.setState({loading: false});
            if ( undefined === res.data || !res.data.status ) {            
              toast.error(res.data.message);
              return;
            } 
            this.props.history.push('/admin/va-application');  
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
        }else{
        commonService.putAPIWithAccessToken('va-application/status', statusFormData)
          .then( res => {
            console.log("PUT2", res)
            if ( undefined === res.data.data || !res.data.status ) {           
              this.setState( { loading: false} );
              toast.error(res.data.message);
              return;
            } 
            this.setState({ loading: false});
            toast.success(res.data.message);
            this.getApplicationInfo(this.state.vaApplicationId);        
          } )
          .catch( err => {         
            if(err.response !== undefined && err.response.status === 401) {
              localStorage.clear();
              this.props.history.push('/login');
            }else
              this.setState( { loading: false } );
              toast.error(err.message);
          } )
        }
      }

      
    } );
  }

  render() {

    const { loading, formField, applicationFiles, skillList, errors, SelectedClientAreaNeed,SelectedClientAreaNeed1,SelectedClientAreaNeed2, childList, childList1, childList2, childSelectedItem, childSelectedItem1,childSelectedItem2, AreaSelectedList  } = this.state;
    // console.log("ChildList11--1", childSelectedItem)
    // console.log("ChildList11--2", childSelectedItem1)
    // console.log("ChildList11--3", childSelectedItem2)
    // console.log("formField.skillSet1",[... new Set(formField.skillSet1.map(e=>({parentName:e.parentName})))])
    // console.log("formField.skillSet1",(new Set(Object.entries(formField.skillSet1))))
    let loaderElement = '';
    if(loading)        
      loaderElement = <Loader />

    return (
      <div className="animated fadeIn">
        <Row>
          
          {loaderElement}
          <Col lg={12}>
            <Card>
              <CardHeader className="mainHeading">
                <strong>Edit VA Application</strong>
              </CardHeader>
              <CardBody>
                <Form onSubmit={this.submitFormData} noValidate>
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
                      <Row>
                        <Col md="12" sm="12">
                          {/* <h4>Skill Set 1</h4> */}
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
                                  // groupBy="areaName"
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
                                  groupBy="areaName"
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
                                  // groupBy="areaName"
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
                                  // groupBy="areaName"
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
                        {/* <Col md="4" sm="12">
                          <h4>Skill Set 2</h4>
                          <Row>
                            <Col md="8" sm="6">
                              <FormGroup>
                                <Input type="select" name="skillSet2" value={formField.skillSet2} onChange={this.changeHandler}>
                                  <option value="">Select Skill 2</option>
                                  {skillList.map((skillInfo, index) =>
                                    <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                  )} */}
                                  {/* { ClientAreaNeed.clientArea.map((skillInfo, index) =>
                                    <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                  )} */}
                                {/* </Input>
                              </FormGroup>
                            </Col>
                            <Col md="4" sm="6">
                              <FormGroup>
                                <Input type="number" name="rateSkill2" value={formField.rateSkill2} placeholder="Rating" min="1" max="5" onChange={this.changeHandler} />
                              </FormGroup>
                            </Col>  
                          </Row>
                        </Col> */}
                        {/* <Col md="4" sm="12">
                          <h4>Skill Set 3</h4>
                          <Row>
                            <Col md="8" sm="6">
                              <FormGroup>
                                <Input type="select" name="skillSet3" value={formField.skillSet3} onChange={this.changeHandler}>
                                  <option value="">Select Skill 3</option>
                                  {skillList.map((skillInfo, index) =>
                                    <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                  )} */}
                                  {/* { ClientAreaNeed.clientArea.map((skillInfo, index) =>
                                    <SetSkillDropDownItem key={index} skillInfo={skillInfo} />
                                  )} */}
                                {/* </Input>
                              </FormGroup>
                            </Col>
                            <Col md="4" sm="6">
                              <FormGroup>
                                <Input type="number" name="rateSkill3" value={formField.rateSkill3} placeholder="Rating" min="1" max="5" onChange={this.changeHandler} />
                              </FormGroup>
                            </Col>  
                          </Row>
                        </Col>   */}
                      </Row>
                    </div>

                    <div className="form-service-listing">
                    <h2>Upload</h2>
                    <div className="row">
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Audio Clip/File</h3>
                                { applicationFiles.audioFile!=='' ? <p className="text-center"><a href={ applicationFiles.audioFile } target="_blank" rel="noopener noreferrer">{ applicationFiles.audioFileName }</a></p> : '' }
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
                                { applicationFiles.resumeCV!=='' ? <p className="text-center"><a href={ applicationFiles.resumeCV } target="_blank" rel="noopener noreferrer">{ applicationFiles.resumeCVName }</a></p> : '' }
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
                            { applicationFiles.intentLetter!=='' ? <p className="text-center"><a href={ applicationFiles.intentLetter } target="_blank" rel="noopener noreferrer">{ applicationFiles.intentLetterName }</a></p> : '' }
                            <Input type="file" id="intentLetter" name="intentLetter" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleIntentLetterChange} />
                            <label htmlFor="intentLetter">
                                <figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                <span>{ this.state.intentLetter!=='' ? this.state.intentLetter.name : 'Choose a file' }&hellip;</span>
                            </label>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="file-box">
                                <h3>Internet Connection Speed screenshot </h3>
                                { applicationFiles.internetSpeedScreenshot!=='' ? <p className="text-center"><a href={ applicationFiles.internetSpeedScreenshot } target="_blank" rel="noopener noreferrer">{ applicationFiles.internetSpeedScreenshotName }</a></p> : '' }
                                <Input type="file" id="internetSpeedScreenshot" name="internetSpeedScreenshot" className="inputfile inputfile-4" data-multiple-caption="{count} files selected" onChange={this.handleInternetSpeedScreenshotChange} />
                                <label htmlFor="internetSpeedScreenshot"><figure><svg xmlns="http://www.w3.org/2000/svg" width="20" height="17" viewBox="0 0 20 17"><path d="M10 0l-5.2 4.9h3.3v5.1h3.8v-5.1h3.3l-5.2-4.9zm9.3 11.5l-3.2-2.1h-2l3.4 2.6h-3.5c-.1 0-.2.1-.2.1l-.8 2.3h-6l-.8-2.2c-.1-.1-.1-.2-.2-.2h-3.6l3.4-2.6h-2l-3.2 2.1c-.4.3-.7 1-.6 1.5l.6 3.1c.1.5.7.9 1.2.9h16.3c.6 0 1.1-.4 1.3-.9l.6-3.1c.1-.5-.2-1.2-.7-1.5z"/></svg></figure> 
                                    <span>{ this.state.internetSpeedScreenshot!=='' ? this.state.internetSpeedScreenshot.name : 'Choose a file' }&hellip;</span>
                                </label>
                            </div>
                        </div>
                        {/* <Col md="6">
                          <FormGroup>
                            <Label>Status *</Label>
                            <Input type="select" name="status" value={formField.status} onChange={this.changeHandler} required>
                              <option value="1">Pending</option>
                              <option value="2">Approve</option>
                              <option value="3">Reject</option>
                            </Input>
                          </FormGroup>
                        </Col> */}
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
                      <Col md={12}>
                        <FormGroup>
                          <Label htmlFor="notes">Notes</Label>
                          <Input type="textarea" name="notes" id="notes" value={formField.notes} onChange={this.changeHandler} placeholder="Notes" />
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                  <hr />
                  <div className="form-service-listing">
                      <div className="row">
                          <div className="col-md-6">
                            <strong>Application Status</strong> : &nbsp; 
                            <ButtonDropdown isOpen={this.state.dropDownOpen===true? true:false} toggle={this.toggle}>
                              <DropdownToggle caret size="md" color={ (formField.status===2) ? "success" : ((formField.status ===3 )  ? "danger" : "warning") }>
                                { (formField.statusText !== '' ? formField.statusText : "Rejected") }
                              </DropdownToggle>
                              <DropdownMenu>
                                <DropdownItem onClick={() => this.changeApplicationStatus(2)}>Approve Application</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(3)}>Reject Application</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(1)}>Pending</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(4)}>Passed Initial</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(5)}>Passed Second Assessment</DropdownItem>
                                <DropdownItem onClick={() => this.changeApplicationStatus(6)}>Passed Final Assessment</DropdownItem>
                              </DropdownMenu>
                            </ButtonDropdown>
                          </div>
                          <div className="col-md-6">
                              <div className="form-group pull-right">
                                  <Button className="submit-btn">Save Changes</Button>
                              </div>
                          </div>
                      </div>
                  </div>

                </Form>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>

    )
  }
}

// function SetSkillDropDownItem (props) {
//   const skill = props.skillInfo;
//   // console.log("Skills", skill)
//   return (<option value={skill.parentId} >{skill.parentName}</option>)
// }
function SetSkillDropDownItem (props) {
  const skill = props.skillInfo;
  // console.log("Skills", skill)
  return (<option value={skill.skillId} >{skill.skillName}</option>)
}

export default EditVaApplication;
