import React, { Component, Suspense } from "react";
import "./Enquiry.css";
import logo from "../../../assets/images/virtlogo-2.png";
import Notfound from "./page404/Notfound";

import dataentry from "../../../assets/images/dataentry.svg";
import frame from "../../../assets/images/Frame.svg";
import executive from "../../../assets/images/executive.svg";
import bookkeeping from "../../../assets/images/bookkeeping.svg";
import coldcalling from "../../../assets/images/coldcalling.svg";
import socialmedia from "../../../assets/images/socialmedia.svg";
import customersupport from "../../../assets/images/customersupport.svg";
import adminis from "../../../assets/images/adminins.svg";
import graphic from "../../../assets/images/graphicdes.svg";
import ecom from "../../../assets/images/ecom.svg";
import sound from "../../../assets/images/sound3.wav";




//AppDevelopement
import android from "../../../assets/images/Android.png";
import flutter from "../../../assets/images/Flutter.png";
import iphone from "../../../assets/images/Ios .png";
import xamarin from "../../../assets/images/xamarin.png";
import phonegap from "../../../assets/images/Phonegap.png";

//Graphic Design.
import animation2d from "../../../assets/images/Animationtwod.png";
import animation3d from "../../../assets/images/Animationthreed.png";
import modeler3d from "../../../assets/images/modelerthreed.png";
import fashion from "../../../assets/images/fashion.png";
import graphicdesign from "../../../assets/images/graphicdesinger.png";
import illustrator from "../../../assets/images/illustrator.png";
import photoshop from "../../../assets/images/photoshop.png";
import mobilegraphics from "../../../assets/images/mobilegraphics.png";
import stationary from "../../../assets/images/stationary.png";
import tatto from "../../../assets/images/tattodesigner.png";
import renderers from "../../../assets/images/renderers.png";

//Language
import english from "../../../assets/images/English.png";
import german from "../../../assets/images/French.png";
import french from "../../../assets/images/german.png";
import spanish from "../../../assets/images/Spanish.png";
import portguese from "../../../assets/images/portguese.png";

//software dev
import objitivc from "../../../assets/images/objtiveCdev.png";
import database from "../../../assets/images/database.png";
import linux from "../../../assets/images/linux.png";
import python from "../../../assets/images/python.png";
import cpp from "../../../assets/images/cp.png";

//web designer
import shopify from "../../../assets/images/Shopify.png";
import wordpress from "../../../assets/images/wordpress.png";
import magento from "../../../assets/images/magento.png";

//web developer
import css from "../../../assets/images/css.png";
import html from "../../../assets/images/HTML.png";
import js from "../../../assets/images/JS.png";
import node from "../../../assets/images/Node.png";
import react from "../../../assets/images/react.png";

//writer
import artical from "../../../assets/images/Artical.png";
import copy from "../../../assets/images/Copy.png";
import ghost from "../../../assets/images/ghost.png";

import Checkbox from "@material-ui/core/Checkbox";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import { toast } from "react-toastify";
import {
  setLoading,
  selectIndustry,
  skillSet,
  selectMannual,
  AddUserInput,
} from "../../../redux/actions/helpers";
import { connect } from "react-redux";
import { UserInputSecondPage } from "./UserInputSecondPage";
import { motion } from "framer-motion";
import { DataUsageSharp } from "@material-ui/icons";

const all = [
  //Graphic Designers
  {
    heading: "Photoshop Designers",
    image: photoshop,
    type: "graphic designers",
  },
  { heading: "Illustrators", image: illustrator, type: "graphic designers" },
  {
    heading: "Mobile Graphics Designers",
    image: mobilegraphics,
    type: "graphic designers",
  },
  { heading: "2D Animations", image: animation2d, type: "graphic designers" },
  { heading: "3D Animations", image: animation3d, type: "graphic designers" },
  { heading: "Tatto Designers", image: tatto, type: "graphic designers" },
  {
    heading: "Stationary Designers",
    image: stationary,
    type: "graphic designers",
  },
  { heading: "Fashion Designers", image: fashion, type: "graphic designers" },
  // 3D Graphic Designers
  { heading: "3D Modelers", image: modeler3d, type: "3d graphic designers" },
  { heading: "3D Renderers", image: renderers, type: "3d graphic designers" },
  {
    heading: "3D Graphic Designers",
    image: graphicdesign,
    type: "3d graphic designers",
  },

  //Web Designers
  {
    heading: "WordPress Web Designers",
    image: wordpress,
    type: "web designers",
  },
  { heading: "SquareSpace Web Designers", image: logo, type: "insurance" },
  { heading: "Wix", image: logo, type: "insurance" },
  { heading: "Shopify", image: shopify, type: "insurance" },
  { heading: "Magento", image: magento, type: "insurance" },

  //Web Developers
  { heading: "HTML5 Web Developers", image: html, type: "web developers" },
  { heading: "CSS Web Developers", image: css, type: "web developers" },
  { heading: "Javascript Web Developers", image: js, type: "web developers" },
  {
    heading: "Ruby on RailsWeb Developers",
    image: logo,
    type: "web developers",
  },
  { heading: "node.jsWeb Developers", image: node, type: "web developers" },
  { heading: "Angular.js Web Developers", image: logo, type: "web developers" },
  { heading: "React.js Web Developers", image: react, type: "web developers" },

  //Mobile App Developers
  {
    heading: "iPhone Mobile App Developers",
    image: iphone,
    type: "mobile app developers",
  },
  {
    heading: "Android Mobile App Developers",
    image: android,
    type: "mobile app developers",
  },
  {
    heading: "PhoneGap Mobile App Developers",
    image: phonegap,
    type: "mobile app developers",
  },
  {
    heading: "Flutter Mobile App Developers",
    image: flutter,
    type: "mobile app developers",
  },
  {
    heading: "Xamarin Mobile App Developers",
    image: xamarin,
    type: "mobile app developers",
  },

  //Writers
  { heading: "Copy Writers", image: copy, type: "writers" },
  { heading: "GhostWriters", image: ghost, type: "writers" },
  { heading: "Article Writers", image: artical, type: "writers" },

  //Internet Marketing
  {
    heading: "Other Internet Marketing",
    image: logo,
    type: "internet marketing specialists",
  },

  //Software Developers
  {
    heading: "C++ Software Developers",
    image: cpp,
    type: "software developers",
  },
  {
    heading: "Python Software Developers",
    image: python,
    type: "software developers",
  },
  {
    heading: "Database Software Developers",
    image: database,
    type: "software developers",
  },
  {
    heading: "Linux Software Developers",
    image: linux,
    type: "software developers",
  },
  {
    heading: "Objective C Software Developers",
    image: objitivc,
    type: "software developers",
  },

  //Translators
  { heading: "English Translators", image: english, type: "translators" },
  { heading: "Spanich Translators", image: spanish, type: "translators" },
  { heading: "French Translators", image: french, type: "translators" },
  { heading: "Portguese Translators", image: portguese, type: "translators" },
  { heading: "German Translators", image: german, type: "translators" },

  //Consultation

  { heading: "Lawyer Consultation", image: modeler3d, type: "lawyers" },
  { heading: "Logistics Consultation", image: modeler3d, type: "logistics" },
  {
    heading: "Financial Experts Consultation",
    image: modeler3d,
    type: "financial experts",
  },
];

const nineSkills = [
  { heading: "Administrative Task",image: adminis },
  { heading: "Data Entry task", image: dataentry },
  { heading: "E Commerce Related tasks",image:ecom },
  { heading: "Customer support/Service",image:customersupport },
  { heading: "Graphic Designing",image: graphic },
  { heading: "Social Media Management",image:socialmedia },
  { heading: "Cold Calling",image: coldcalling },
  { heading: "Bookkeeping",image: bookkeeping},
  { heading: "Executive Assistant",image: executive },
];

// const data={
//   management:[{image:logo,heading: ""},{image:logo,heading: ""}],
//   writers:[{image:logo,heading: ""},{image:logo,heading: ""}]
//  }

class SecondEnquiryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      head: "",
      // items:JSON.parse(localStorage.getItem('skillFrelancer')) || [],
      name: "",
      // checkbox:JSON.parse(localStorage.getItem('secondPageCheckbox')) || [],
      refer: "",
      checkbox: JSON.parse(localStorage.getItem("secondPageSkill")) || [],
      newUser: [],
      items: [],
      inp:"",
      checkedValue: false,
      prevState: "",
      onhover: false,
      hoverprop: false,
      extraSkill: "",
      otherInput: localStorage.getItem("lockInput")||"",
    };
  }

  componentDidMount() {
    this.setState({ prevState: this.props.industry }, () => {});
    if (this.props.industry) {
      this.props.AddUserInput(null);
    }
    // this.setState({
    //   checkbox: localStorage.getItem("secondPageCheckbox") ? JSON.parse(localStorage.getItem("secondPageCheckbox")) : [],
    //   items:localStorage.getItem('skillFrelancer') ? JSON.parse(localStorage.getItem('skillFrelancer')) : []
    // }, ()=>{
    // })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  handleprops = () => {
    setTimeout(() => {
      this.props.inputValue(this.state.checkbox, this.state.items);
    }, 1000);
  };
  render() {
    const selectLocalStorageData = JSON.parse(localStorage.getItem("UserInput"))
      ? JSON.parse(localStorage.getItem("UserInput"))
      : this.props.adduser;
    const smallHeadSelector = selectLocalStorageData ? (
      selectLocalStorageData
    ) : this.state.checkbox ? (
      this.state.checkbox
    ) : (
      <UserInputSecondPage />
    );
    // const smallHead = [
    //   { head: "Live Chat Agent" },
    //   { head: "Call Center Agent" },
    //   { head: "Customer And Technical Support" },
    //   { head: "Emails Phone Call Support" },
    //   { head: "Voice Actor" },
    // ];
    // const coldCalling = [
    //   { head: "Adminstrativr Task " },
    //   { head: "xyz" },
    //   { head: " Support" },
    //   { head: "Emails " },
    //   { head: " Actor" },
    // ];

    //   //  if(this.state.prevState==='Advertising'){
    //   //    this.setState({mapObj:this.state.prevState})
    //   //  }

    return (
      <>
        <div className="Multistep_container container va_page2">
          <div className="topHeader ">
            <h4 className="heading mt_30">Area Where You Need Help</h4>

            {!this.props.userInput && !this.props.industry ? (
              <Notfound />
            ) : (
              <ul className="productsFirst row " onClick={this.handleprops}>
                {this.props.userInput ? (
                  <UserInputSecondPage />
                ) : this.props.industry ? (
                  nineSkills.map((item, index) => {
                    return (
                      <>
                        <li className="col-md-4 col-lg-4 col-sm-4 col-xs-6 ">
                          <div className="product">
                            <motion.div
                              className="imageProp"
                              onClick={(e) => {
                                this.getValue(e, item.heading);
                                this.playAudio()
                              }}
                              style={{
                                backgroundColor: this.state.checkbox.includes(
                                  item.heading
                                )
                                  ? "#005382"
                                  : null,
                                  transition:"1s"
                              }}
                              animate={{  opacity: 1 }}
                               initial={{ opacity: 0.1 }}
                              
                            >
                              <motion.img
                                onMouseOver={this.mouseOver}
                                onMouseOut={this.mouseOut}
                                src={item.image}
                                onClick={() =>
                                  this.itemHead(item.heading, item.ref)
                                }
                                // initial={{ opacity: 0.1 }}
                                whileHover={{ rotate: 360,scale:1.5 }}

                              />
                            </motion.div>
                            <div className="productName">
                              <h6 style={{ color: "rgb(0, 83, 130)" }}>
                                <b>{item.heading}</b>
                              </h6>
                            </div>
                          </div>
                        </li>
                      </>
                    );
                  })
                ) : null}
              </ul>
            )}
            <h2 className="heading ">Skills Freelancers Need</h2>


            <div className="skillSelect">
              {this.props.userInput ? null : (
                <form onSubmit={(e) => this.submitForm(e)}>
                  <input
                    minlength="1"
                    maxlength="50"
                    id="inputSkill"
                    autoComplete="off"
                    placeholder="Other"
                    onChange={(e) => this.getValueInput(e)}
                    disabled={this.state.otherInput}
                  />
                  <button className="skillButton btn1Add b1Add" type="submit" onClick={()=>{this.setState({inp:this.state.extraSkill})}}>
                    Add
                  </button>
                  <div><span>(Note: Single Input allowed & After Entering Input, Field will get locked ,To unlock Go back And select Industry)</span></div>
                </form>
              )}

              <h4>{this.props.userInput ? this.props.userInput : null}</h4>
              {/* {this.smallHeadMap(this.state.refer)} */}
              {/* {smallHead.map((item) => {
                return (
                  <div
                    className="smallhead"
                    onClick={() => {
                      this.smallHeadFunc(item.head,this.state.head);
                    }}
                  >
                    {item.head}
                  </div>
                );
              })} */}
            </div>
            {smallHeadSelector ? (
              <motion.div
                className={this.state.inp || this.props.adduser ? "option":null}
                animate={{ x: 0 }}
                initial={{ x: 1000 }}
                transition={{
                  type: "spring",
                  stiffness: 60,
                  duration: 1,
                }}
              >
                {this.state.inp ? <div>                 
                      <div className="insideOption">
                        {this.state.inp}
                        <span
                          onClick={() => this.smallHeadRemoverFunc()}
                        >
                          {/* <CancelTwoToneIcon color="disabled" /> */}
                        </span>
                      </div>                              
                </div>:null}

                {this.props.adduser ?this.props.adduser.map((item,index)=>{
                     return <div>                 
                     <div className="insideOption">
                       {item}
                       <span
                         onClick={() => this.smallHeadRemoverFunc(item,index)}
                       >
                        
                         <CancelTwoToneIcon color="disabled" />
                       </span>
                     </div>                              
               </div>
                }):null}
                
              </motion.div>
            ) : null}
          </div>
          <div className="downButton"></div>
        </div>
      </>
    );
  }

  // checkBoxChecked=(item)=>{
  // if(this.state.checkbox.includes(item)){
  //  this.setState({checkbox: this.state.checkbox.filter((items) => items != item)},()=>{localStorage.setItem('secondPageCheckbox',JSON.stringify(this.state.checkbox))});
  // }
  // console.log(this.state.head)
  // }

  // smallHeadMap=(tags)=>{
  // return this.state.checkbox.map((item) => {
  //     return (
  //       <div
  //         className="smallhead"
  //         onClick={() => {
  //           this.smallHeadFunc(item.head,this.state.head);
  //         }}
  //       >
  //         {item.name}
  //       </div>
  //     );
  //   })
  // }

  getValueInput = (e) => {
    e.preventDefault();
    if (e.target.value.length >= 50) {
      toast.error("Character limit should not be grtr thn 50");
    }
  

    let inputSkill = e.target.value;
    this.setState({ extraSkill: inputSkill });
  };

  submitForm = (e) => {
     e.preventDefault();
    if(this.state.extraSkill){
      this.setState({ otherInput:true }, () => {
        localStorage.setItem("lockInput",this.state.otherInput)
       });
  
    }
    
    let data = this.state.checkbox;
    if (data.includes(this.state.extraSkill)) {
      toast.error("Go to first page and Select Industry again!");
    }
    if (this.state.extraSkill) {
      if (!data.includes(this.state.extraSkill)) {
        data.push(this.state.extraSkill);
        this.setState({ checkbox: data,});
        this.props.inputValue(this.state.checkbox, this.state.items);
        localStorage.setItem(
          "secondPageSkill",
          JSON.stringify(this.state.checkbox)
        );
        document.getElementById("inputSkill").value = "";
      }
    }
  };

  RemoverFuncOutside = () => {
    this.setState({ otherInput: null });
  };

  getValue = (e, item) => {
    e.preventDefault();
    let data = this.state.checkbox;
    if (!this.state.checkbox.includes(item.heading)) {
      this.setState({ head: item });
      if (!data.includes(item)) {
        data.push(item);
        this.setState({ checkbox: data }, () => {
          this.props.skillSet(this.state.checkbox);
          localStorage.setItem(
            "secondPageSkill",
            JSON.stringify(this.state.checkbox)
          );
        });
      } else {
        this.setState(
          {
            checkbox: this.state.checkbox.filter((items) => items != item),
            head: null,
          },
          () => {
            this.props.skillSet(this.state.checkbox);
            localStorage.setItem(
              "secondPageSkill",
              JSON.stringify(this.state.checkbox)
            );
          }
        );
      }
    }
    // else {
    //   this.setState(
    //     {
    //       checkbox: this.state.checkbox.filter((items) => items != item),
    //       head: "",
    //     },
    //     () => {localStorage.setItem('secondPageCheckbox',JSON.stringify(this.state.checkbox))}
    //   );
    //    }
  };

  playAudio=()=>{
    new Audio(sound).play();
  }

  mouseOut = (event) => {
    event.target.style.background = null;
  };

  mouseOver = (event) => {
    event.target.className = "zoom";
    // event.target.className="imageaPropafter"
  };

  smallHeadFunc = (item, skillFrelancer) => {
    if (this.state.head) {
      let items = [...this.state.items];
      let pushItem = true;
      for (let listitem of items) {
        if (listitem.name === item) {
          pushItem = false;
        }
      }
      if (this.state.head) {
        if (pushItem) {
          items.push({
            head: skillFrelancer,
            name: item,
          });
        }
      }
      this.setState({ items: items, name: item }, () => {
        localStorage.setItem(
          "skillFrelancer",
          JSON.stringify(this.state.items)
        );
      });
      setTimeout(() => {
        this.props.inputValue(this.state.checkbox, this.state.items);
      }, 1000);
    } else {
      toast.error("Select Area Where You Need Help!");
    }
  };

  smallHeadRemoverFunc = (itemName, index) => {
    let items = [...this.state.checkbox];
    let newItem = items.filter((item) => {
      if (item != itemName) {
        return item;
      }
    });

    if (localStorage.getItem("UserInput")) {
      // let itemsuser = [...this.props.adduser];
      // console.log("itemuser",itemsuser)
      const skillset = JSON.parse(localStorage.getItem("UserInput"));
      skillset.splice(index, 1);
      localStorage.setItem("UserInput", JSON.stringify(skillset));
      this.props.AddUserInput(skillset);
    }

    this.setState({ checkbox: newItem }, () => {
      localStorage.setItem(
        "secondPageSkill",
        JSON.stringify(this.state.checkbox)
      );
    });
    setTimeout(() => {
      this.props.inputValue(this.state.checkbox, this.state.items);
    }, 1000);
  };

  itemHead = (head, ref) => {
    this.setState({ head: head, refer: ref }, () => {});
  };
}

//redux
const mapStates = (state) => {
  const { enquiry } = state;
  return enquiry;
};

const actions = {
  selectIndustry,
  skillSet,
  selectMannual,
  AddUserInput,
};
const connectedSecondEnquiryPage = connect(
  mapStates,
  actions
)(SecondEnquiryPage);
export { connectedSecondEnquiryPage as SecondEnquiryPage };

// all
// .filter(
//   (x) => x.type === this.state.prevState.toLowerCase()
// )
// .map((item, index) => {
