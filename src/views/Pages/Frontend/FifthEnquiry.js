import React, { Component, Suspense } from "react";
import "./Enquiry.css";
import axios from "axios";
import logo from "../../../assets/images/virtlogo-2.png";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TimeRangeSlider from "react-time-range-slider";
import { motion } from "framer-motion";

class FifthEnquiry extends Component {
  constructor(props) {
    super(props);
    this.state = {
      howMuchTime: "",
      firstname: "",
      lastname: "",
      companyname: "",
      email: "",
      companyAddress: "",
      phone: "",
    };
  }
  componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  changeHandle = (e) => {
    this.setState({ [e.target.name]: e.target.value }, () => {});
    setTimeout(() => {
      this.props.fifthValue(this.state);
    }, 500);
  };

  // handleSubmit = (e) => {
  //   e.preventDefault();
  //   axios
  //     .post("https://jsonplaceholder.typicode.com/posts", this.state)
  //     .then((resp) => {
  //       this.setState({ formData: resp });
  //       this.handleform();
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // };

  render() {
    const {
      firstname,
      lastname,
      companyname,
      email,
      companyAddress,
      phone,
      howMuchTime,
    } = this.state;
    return (
      <>
        <div className="Multistep_container container va_page5">
          <div>
            <div>
              <h4 className="heading mt_30">
                How quickly do you need someone?
              </h4>
              <section>
                <div className="lastHead  row">
                  <motion.div
                    //  animate={{rotate:360,opacity:1}}
                    //  initial={{opacity:0.1}}
                    
                    animate={{ x: 0 }}
                    initial={{ x: 1000 }}
                    transition={{}}
                    whileHover={{ scale: 1.1 }}
                    className="imageSectionDays selectDayFifth offset-md-2 col-md-4 col-lg-4 col-sm-12"
                    onClick={(e) => {
                      this.setState({
                        howMuchTime: "Need Someone Urgently",
                        hours: true,
                        days: false,
                      });
                      this.changeHandle(e);
                    }}
                  >
                    <div className="imageSectionFifth"  style={{boxShadow:this.state.hours ? "11px 22px 44px #7e70a221" : null }}>
                      <img src="/images/seasonUndraw.png" />
                    </div>
                    <div className="imageSectionhours">
                      <h5 style={{ color: this.state.days ? "gray" : null,backgroundColor: this.state.hours ? "lightgray" : null,borderRadius:38  }}>
                      Need Someone Urgently
                      </h5>
                    </div>
                  </motion.div>

                  <motion.div
                    className="imageSectionDays selectDayFifth col-md-4 col-lg-4 col-sm-12"
                    // animate={{rotate:360,opacity:1}}
                    animate={{ x: 0 }}
                    initial={{ x: -1000 }}
                    //  transition={{
                    //   type: "spring",
                    //   stiffness: 60,
                    // }}
                    whileHover={{ scale: 1.1 }}
                    onClick={(e) =>
                      {this.setState({
                        howMuchTime: "No rush,wait best candidates",
                        hours: false,
                        days: true,
                      })
                      this.changeHandle(e);

                    }}
                  >
                    <div className="imageSectionFifth" style={{boxShadow:this.state.days ? "11px 22px 44px #7e70a221" : null }}>
                      <img src="/images/bookingUndraw.png" />
                    </div>
                    <div>
                      <h5 style={{ color: this.state.hours ? "gray" : null,backgroundColor: this.state.days ? "lightgray" : null,borderRadius:38 }}>
                        No rush,wait best candidates
                      </h5>
                    </div>
                  </motion.div>
                  <section className="offset-md-2"></section>
                </div>

                <h5 className="heading mt_30">Tell Us Something about you</h5>

                <div className="insideapp mt_30 row">
                  <div className="formField">
                    <h5>Firstname</h5>
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="firstname"
                        value={firstname}
                        name="firstname"
                        onChange={this.changeHandle}
                      />
                    </div>
                    <h5> Company Name</h5>
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Company Name"
                        value={companyname}
                        name="companyname"
                        onChange={this.changeHandle}
                      />
                    </div>
                    <h5>Email Addrress</h5>
                    <div>
                      <input
                        type="email"
                        autoComplete="off"
                        placeholder="Email Address"
                        value={email}
                        name="email"
                        onChange={this.changeHandle}
                      />
                    </div>
                  </div>

                  <div className="formField">
                    <h5>Last Name</h5>
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Last Name"
                        value={lastname}
                        name="lastname"
                        onChange={this.changeHandle}
                      />
                    </div>
                    <h5>Company Addrress</h5>
                    <div>
                      <input
                        type="text"
                        autoComplete="off"
                        placeholder="Compnay Address"
                        value={companyAddress}
                        name="companyAddress"
                        onChange={this.changeHandle}
                      />
                    </div>
                    <h5>Phone Number </h5>
                    <div>
                      <input
                        type="phone"
                        autoComplete="off"
                        placeholder="Phone Number"
                        value={phone}
                        name="phone"
                        onChange={this.changeHandle}
                      />
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </>
    );
  }
}

export default FifthEnquiry;
