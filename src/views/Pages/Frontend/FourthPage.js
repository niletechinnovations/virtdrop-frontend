import React, { Component, Suspense } from "react";
import "./Enquiry.css";
import logo from "../../../assets/images/virtlogo-2.png";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TimeRangeSlider from "react-time-range-slider";
import { motion } from "framer-motion";

class FourthPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plan: "",
      onhover: false,
      select: localStorage.getItem("selectedPrice") || "",
    };
  }
  componentDidMount() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  MonthlyPlan = (rate) => {
    setTimeout(() => {
      this.props.fourthValue(this.state.plan);
    }, 1000);
    this.setState({ plan: rate });
  };
  render() {
    const standard = [
      { head: "Entry Level tasks" },
      { head: "Virtual Assistant" },
      { head: "Customer Services" },
      { head: "Email Support" },
      { head: "Basic Social Media" },
      { head: "Bookeeping" },
      { head: "Admin Tasks" },
    ];
    const gold = [
      { head: "Mid Level tasks" },
      { head: "Video Editing" },
      { head: "Customer Services" },
      { head: " Graphic Design" },
      { head: "Client Relations" },
      { head: "Project Management" },
      { head: " Web Developement" },
      { head: " Accounting " },
      { head: " Executive Assistant " },
    ];
    const premium = [
      { head: "Expert Level tasks" },
      { head: " Brand Strategist" },
      { head: " Amazon Admin" },
      { head: " Sales/Cold Calling" },
      { head: "Product Design/Developement" },
      { head: "PPC/Social Media Advertising" },
    ];

    const rateObj = [
      { top: "Standard", rate: "12", includes: standard },
      { top: "Gold", rate: "15", includes: gold },
      { top: "Premium", rate: "20", includes: premium },
    ];

    return (
      <>
        <div className="Multistep_container container va_page4">
          <h2 class="heading mt_30 ">Choose Your Plan?</h2>
          <div class="select_plans mt_30 row">
            {rateObj.map((item, id) => {
              return (
                <>
                  <div className="col-md-4 col-lg-4 col-sm-12">
                    <div
                      onMouseOver={this.mouseOver}
                      onMouseOut={this.mouseOut}
                      class={
                        this.state.onhover
                          ? "plan-top-sec selecthover"
                          : "plan-top-sec"
                      }
                      onClick={() => {
                        this.MonthlyPlan(item.top);
                        this.setState({ select: id }, () => {
                          localStorage.setItem("selectedPrice", id);

                        });
                      }}
                      style={{
                        border:
                          this.state.select === id ? "3px solid black" : null,
                      }}
                    >

                      <h3>{item.top}</h3>
                      {item.top === "Gold" ? (
                        <img src="images/bestdeal.png" />
                      ) : null}
                      <h4 class="price">
                        <span>
                          <sup>$</sup>
                        </span>
                        {item.rate}
                      </h4>
                      <p>per month</p>
                      <h3 class="time-period"></h3>
                      <div class="plan-btn">Select</div>
                    </div>
                    <div class="plan-bottom-sec">
                      <p>INCLUDES:</p>
                      <div class="plan-decs">
                        {item?.includes?.map((item) => {
                          return <p>{item.head}</p>;
                        })}
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </div>
      </>
    );
  }

  mouseOut = (event) => {
    // event.target.style.background = null;
    this.setState({
      onhover: false,
    });
  };

  mouseOver = (event) => {
    // event.target.className="zoom"
    this.setState({
      onhover: true,
    });
    // event.target.className="imageaPropafter"
  };
}

export default FourthPage;
