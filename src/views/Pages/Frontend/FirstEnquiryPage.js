import React, { Component, Suspense } from "react";
import "./Enquiry.css";
import logo from "../../../assets/images/inquiry.svg";
import apparel from "../../../assets/images/Apparel.png";
import advertising from "../../../assets/images/Advertising.png";
import designs from "../../../assets/images/Designs.png";
import softwareDeveloper from "../../../assets/images/SoftwareDevelopers.png";
import graphicDesigner from "../../../assets/images/GraphicDesigners.png";
import logoDesigner from "../../../assets/images/LogoDesigners.png";
import webDesigner from "../../../assets/images/WebDesigners.png";
import translator from "../../../assets/images/Translators.png";
import webDeveloper from "../../../assets/images/WebDevelopers.png";
import marketing from "../../../assets/images/InternetMarketing.png";
import mobileApp from "../../../assets/images/MobileAppDevelopers.png";
import financial from "../../../assets/images/FinancialExperts.png";
import writers from "../../../assets/images/Writers.png";
import sound from "../../../assets/images/sound3.wav";

import insurance from "../../../assets/images/Industry/Insurance.png";
import ecommerce from "../../../assets/images/Industry/ecommerce.png";
import healthcare from "../../../assets/images/Industry/Healthcare.png";
import retail from "../../../assets/images/Industry/Ratail.png";
import developement from "../../../assets/images/Industry/Development.png";
import logistics from "../../../assets/images/Industry/Logistics.png";
import accounting from "../../../assets/images/Industry/accounting.png";
import mortgages from "../../../assets/images/Industry/Mortgages.png";
import service from "../../../assets/images/Industry/servicebusiness.png";
import wholesale from "../../../assets/images/Industry/wholesale.png";
import realestate from "../../../assets/images/Industry/realestate.png";



import {
  setLoading,
  selectIndustry,
  selectMannual,
  skillSet,
} from "../../../redux/actions/helpers";
import { connect } from "react-redux";
import { motion } from "framer-motion";

class FirstEnquiryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showComponent: false,
      other: "",
      checkbox: [],
      industry: "",
      changeBack: false,
      color: "",
      industry:localStorage.getItem('industry')|| '',
      // other: localStorage.getItem('input') || "",
      // checkbox: JSON.parse(localStorage.getItem('checkbox')) || [],
    };
  }

  componentDidMount() {
    // this.props.selectMannual(null);
    // this.props.skillSet([]);

    // this.setState({
    //   checkbox: localStorage.getItem("checkbox") ? JSON.parse(localStorage.getItem("checkbox")) : []
    // }, ()=>{
    // })
    window.onunload = function () {
      localStorage.clear();
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  render() {
    const object = [
      { heading: "Wholesale/Manufacturing,", image: wholesale },
      { heading: "E-commerce", image: ecommerce },
      { heading: "Retail", image: retail },
      { heading: "Sales and Marketing", image: marketing },
      { heading: "Real estate", image: realestate },
      { heading: "Finance/Accounting", image: accounting },
      { heading: "Healthcare", image: healthcare },
      { heading: "Development", image: developement },
      { heading: "Insurance", image: insurance },
      { heading: "Mortgages", image: mortgages },
      { heading: "Logistics", image: logistics },
      { heading: "Service Business", image: service },

      // { heading: "Manufacture", image: manufacture },
    ];

    return (
      <>
        <motion.div
          animate={{ x: 0 }}
          initial={{ x: -1000}}
          // initial='out'
          // animate='in'
          // exit='out'

          className="Multistep_container container va_page1"
        >
          <div className="topHeader">
            <h4 className="heading mt_30">Industry You Belong ?</h4>
            <ul className="productsFirst row ">
              {object.map((item, i) => {
                return (
                  <>
                    <li className="col-md-3 col-lg-3 col-sm-3 col-xs-6 ">
                      <div
                        className="product"
                        onClick={() =>{ this.handleprops(item.heading);this.playAudio()}}
                      >
                        <motion.div
                          className="imageProp"
                          onClick={() => {
                            this.setState({
                              changeBack: !this.state.changeBack,
                              color: item.heading,
                            });
                            localStorage.setItem('industry',item.heading)
                            localStorage.removeItem('lockInput')
                          }}
                          style={{
                            backgroundColor:
                            localStorage.getItem('industry') === item.heading
                                ? "#005382"
                                : null,
                            transition:"1s"
                          }}
                         
                        >
                          <motion.img
                             animate={{
                              rotate: [0, 0, 270, 270, 0],
                              opacity: 0.9,
                              scale: [1, 1.1, 1.1, 1, 1],
                            }}
                            whileTap={{scale:0.9}}
                            initial={{ opacity: 0.1 }}
                            whileHover={{ rotate: 360,scale:1.6 }}
                           
                            src={item.image}
                            onMouseOver={this.mouseOver}
                            onMouseOut={this.mouseOut}
                          />
                        </motion.div>
                        <div className="productName">
                          <h6 style={{color:"rgb(0, 83, 130)"}}>
                            <b>{item.heading}</b>
                          </h6>
                        </div>
                      </div>
                    </li>
                  </>
                );
              })}
            </ul>
            <div className="OtherInput">
              <h4 className="mb-mobile-10">Other </h4>
              <motion.form
                animate={{x:0}}
                initial={{x:1000}}
                 transition={{
                  type: "spring",
                  stiffness: 60,
                  duration:1
                }}
                onSubmit={(e) => {
                  this.submit(e);
                }}
              >
                <input
                  className="otherIn"
                  type="text"
                  onChange={(e) => {
                    this.handle(e);
                  }}
                  value={this.state.other}
                  placeholder="Type"
                />
              </motion.form>
            </div>
          </div>
        </motion.div>
      </>
    );
  }

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

  //Getting Value From Checkbox.
  getValue = (e, item) => {
    this.setState({ industry: item }, () => {
      {
      }
    });
    // let data = this.state.checkbox;
    // if (!this.state.checkbox.includes(
    //   item.heading
    // )) {
    //   if (!data.includes(item)) {
    //     data.push(item);
    //     this.setState({ checkbox: data},()=>{localStorage.setItem('secondPageCheckbox',JSON.stringify(this.state.checkbox))});
    //   }
    //   else {
    //     console.log("elkse");
    //     this.setState(
    //       {
    //         checkbox: this.state.checkbox.filter((items) => items != item),
    //       },
    //       () => {localStorage.setItem('secondPageCheckbox',JSON.stringify(this.state.checkbox))}
    //     );
    //      }
    // }
  };

  // getValue = (e, item) => {
  //   let data = this.state.checkbox;
  //   if (e.target.checked) {
  //     if (!data.includes(item)) {
  //       data.push(item);
  //       this.setState({ checkbox: data },()=>{localStorage.setItem('checkbox',JSON.stringify(this.state.checkbox))});
  //     }
  //   } else {
  //     this.setState(
  //       {
  //         checkbox: this.state.checkbox.filter((items) => items != item),
  //         head: "",
  //       },
  //       () => {localStorage.setItem('checkbox',JSON.stringify(this.state.checkbox))}
  //     );
  //   }

  //InputTag  code
  handle = (e) => {
    const setInput = e.target.value;
    localStorage.removeItem('industry')
    // localStorage.removeItem('secondPageSkill')

    this.setState({ other: setInput,industry:null }, () => {
      this.props.selectMannual(this.state.other);
    });
  
    setTimeout(() => {
      this.props.firstEnquiry(this.state.industry, this.state.other);
    }, 1000);
  };

  //form Code
  submit = (e) => {
    e.preventDefault();
  };

  //passing data to parent
  handleprops = (item) => {
    this.setState({ industry: item }, () => {
      localStorage.removeItem('secondPageSkill')
      localStorage.removeItem('UserInput')
      this.props.selectMannual(null)
      
      this.props.selectIndustry(this.state.industry);
    });

    setTimeout(() => {
      this.props.firstEnquiry(this.state.industry, this.state.other);
    }, 1000);
  };
}
const mapStates = (state) => {
  const { enquiry } = state;
  return enquiry;
};

const actions = {
  setLoading,
  selectIndustry,
  selectMannual,
  skillSet,
};
const connectedFirstEnquiryPage = connect(mapStates, actions)(FirstEnquiryPage);
export { connectedFirstEnquiryPage as FirstEnquiryPage };
