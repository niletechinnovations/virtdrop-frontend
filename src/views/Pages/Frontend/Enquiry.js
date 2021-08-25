import React, { Component } from "react";
import "./Enquiry.css";
import logo from "../../../assets/images/virtlogo-2.png";
import Tabs from "./Tabs";
import { toast } from "react-toastify";
import { FirstEnquiryPage } from "./FirstEnquiryPage";
import { ThirdEnquiryPage } from "./ThirdEnquiryPage";
import { SecondEnquiryPage } from "./SecondEnquiryPage";
import FifthEnquiry from "./FifthEnquiry";
import axios from "axios";
import FourthPage from "./FourthPage";
import commonService from "../../../core/services/commonService";
import { Redirect, Switch } from "react-router";
import { motion } from "framer-motion";
import Particles from "react-particles-js";
import Loader from "react-loader-spinner";

import {
  setLoading,
  selectIndustry,
  skillSet,
  AddUserInput,
} from "../../../redux/actions/helpers";
import { connect } from "react-redux";

class Enquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 1,
      loading: false,
      show: false,
      secondpage: "",
      count: "",
      userInputSkills: [],
      start: "",
      saveVa: false,
      end: "",
      vaDays: "",
      formData: "",
      firstpage: "",
      price: "",
      FristpageinputVal: "",
      itemTag: "",
      redirect: false,
      vaCount: {},
      vaTime: [],
    };
  }
  render() {
    const list = [{ tab: 1 }, { tab: 2 }, { tab: 3 }, { tab: 4 }, { tab: 5 }];
    const { tabValue } = this.state;

    // const tab =
    //   tabValue < 1
    //     ? this.setState({ tabValue: 1 })
    //     : tabValue > 5
    //     ? this.setState({ tabValue: 5 })
    //     : null;
    return (
      <>
        {this.state.redirect ? <Redirect to="/" /> : null}
        <div className="multiStep_section">
          {/* <Particles
          params={{
            particles: {
              number: {
                value: 50
              },
              size: {
                value: 3
              }
            },
            interactivity: {
              events: {
                onhover: {
                  enable: true,
                  mode: "repulse"
                }
              }
            }
          }}
        /> */}
          <ul id="progressbar">
            {list.map((item) => {
              return (
                <li
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                  className={tabValue == item.tab ? "active" : null}
                  onClick={() => {
                    this.setState({ tabValue: item.tab });
                    this.SelectTab(item.tab);
                  }}
                ></li>
              );
            })}
          </ul>
          {tabValue == 1 ? (
            <FirstEnquiryPage firstEnquiry={this.firstEnquiry} />
          ) : tabValue == 2 ? (
            <SecondEnquiryPage inputValue={this.handleprops} />
          ) : tabValue == 3 ? (
            <ThirdEnquiryPage thirdValue={this.thirdProp} />
          ) : tabValue == 4 ? (
            <FourthPage fourthValue={this.fourthProp} />
          ) : tabValue === 5 ? (
            <FifthEnquiry fifthValue={this.fifthProp} />
          ) : null}
          <div className="downButton">
            {this.state.tabValue === 1 ? null : (
              <button className="previous common" onClick={this.handlePrev}>
                Previous
              </button>
            )}
            {tabValue === 5 ? (
              <button
                className="skip common"
                onClick={(e) => {
                  this.skipTo();
                  this.submit(e);
                }}
              >
                {this.state.loading ? (
                  <Loader
                    type="ThreeDots"
                    color="white"
                    height={27}
                    width={27}
                    timeout={3000} //3 secs
                  />
                ) : (
                  "Finish"
                )}
              </button>
            ) : (
              <motion.button
                animate={{ rotate: 360, opacity: 1 }}
                initial={{ opacity: 0.1 }}
                transition={{ type: "tween", duration: 1 }}
                className="skip common"
                onClick={this.skipTo}
              >
                Skip to 5
              </motion.button>
            )}
            {tabValue === 5 ? null : (
              <motion.button
                animate={{ rotate: 360, opacity: 1 }}
                initial={{ opacity: 0.1 }}
                transition={{ type: "tween", duration: 1 }}
                className="next common"
                onClick={this.handleButton}
              >
                Next
              </motion.button>
            )}
          </div>
          <div className="social_Icons">
            <div className="Icons">
              <img src="/images/Image 3.png " height={43} />
            </div>
            <div className="Icons">
              <img src="/images/Image 4.png " height={43} />
            </div>

            <div className="Icons">
              <img src="/images/Image 5.png  " height={43} />
            </div>
          </div>
        </div>
      </>
    );
  }

  submit = (e) => {
    const { formData } = this.state;
       this.setState({loading:true})
      commonService.postAPI('hireva',this.state)
      .then((resp) => {
        if (!formData.howMuchTime) {
          toast.error("Please Select In How Much Time You Want VA !");
          this.setState({ loading: false });
        }
        if (formData.phone.length < 10) {
          toast.error(" Please Enter 10 digit Number Only !");
          this.setState({ loading: false });
        }
        if (isNaN(formData.phone)) {
          toast.error(" Please Enter Number Only !");
          this.setState({ loading: false });
        }
        if (!formData.lastname) {
          toast.error(" Please Enter Lastname !");
          this.setState({ loading: false });
        }
        if (!formData.phone) {
          toast.error(" Please Enter ContactNumber !");
          this.setState({ loading: false });
        }
        if (!formData.companyAddress) {
          toast.error(" Please Enter Company Address !");
          this.setState({ loading: false });
        }
        if (!formData.companyname) {
          toast.error(" Please Enter Company Name !");
          this.setState({ loading: false });
        }
        if (!formData.email) {
          toast.error(" Please Enter Email !");
          this.setState({ loading: false });
        }
        if (!formData.firstname) {
          toast.error(" Please Enter FirstName !");
          this.setState({ loading: false });
        } else {
          if (
            formData.firstname &&
            !isNaN(formData.phone) &&
            formData.phone &&
            formData.phone.length >= 10 &&
            formData.howMuchTime &&
            formData.lastname &&
            formData.companyname &&
            formData.email &&
            formData.companyAddress
          ) {
            this.setState({ loading: false });
            this.setState({ redirect: true });
            // console.log("this is main ", resp);
            // console.log("state", this.state);
            toast.success("SuccessFully Saved!");
            localStorage.clear();
          }
        }
      })
      .catch((error) => {
        this.setState({ loading: false });
        toast.error("Some Error Occured on Server side! ");
        console.log(error);
      });
      // axios.get("https://api.virtdrop.com/api/hireva")
      // .then(res=>{
      //   console.log("resposnseeee",res)
      // })
      // .catch(err=>{
      //   console.log("errorrr",err)
      // })
      console.log("this.state",this.state)
  };

  redirectfirst = () => {
    this.setState({ saveVa: !this.state.saveVa });
  };

  skipTo = () => {
    this.setState({ tabValue: 5 });
  };

  handlePrev = () => {
    this.setState({ tabValue: this.state.tabValue - 1 });
  };

  handleButton = () => {
    this.setState({ tabValue: this.state.tabValue + 1 }, () => {});
  };

  firstEnquiry = (first, inputVal) => {
    this.setState({ firstpage: first, FristpageinputVal: inputVal });
  };
  fourthProp = (price) => {
    this.setState({ price: price });
  };
  fifthProp = (formData) => {
    this.setState({ formData: formData }, () => {});
  };
  thirdProp = (days, skills, vaCount, vaTime) => {
    this.setState({
      vaDays: days,
      vaCount: vaCount,
      vaTime: vaTime,
    });
  };
  handleprops = (value, itemTag) => {
    this.setState({
      secondpage: value,
      itemTag: itemTag,
      userInputSkills: this.props.adduser,
    });
    if(this.state.userInputSkills){
      this.setState({
        secondpage:null
      })
    }
  };

  // tagvalue = (tag) => {
  //   this.setState({ secondTags: tag });
  // };
  SelectTab = (value) => {
    this.setState({ tabValue: value }, () => {});
  };
}

const mapStates = (state) => {
  const { enquiry } = state;
  return enquiry;
};

const actions = {
  selectIndustry,
  skillSet,
  AddUserInput,
};
const connectedEnquiryPage = connect(mapStates, actions)(Enquiry);
export { connectedEnquiryPage as Enquiry };

// export default Enquiry;
