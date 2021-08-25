import React, { Component, Suspense } from "react";
import "./Enquiry.css";
import logo from "../../../assets/images/virtlogo-2.png";
import { Link } from "react-router-dom";
import AddCircleOutlineOutlinedIcon from "@material-ui/icons/AddCircleOutlineOutlined";
import RemoveCircleOutlineOutlinedIcon from "@material-ui/icons/RemoveCircleOutlineOutlined";
import TimeRangeSlider from "react-time-range-slider";
import { skillSet, AddUserInput } from "../../../redux/actions/helpers";
import { connect } from "react-redux";
import { CodeSharp, HighlightSharp, NoteTwoTone } from "@material-ui/icons";
import { motion } from "framer-motion";
import Notfound from "./page404/Notfound";

class ThirdEnquiryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: [],
      items: [],
      dayu: {},
      industry: "",
      setday: "",
      skills: [],
      vaTime: {},
      vatimeStart: "",
      vatimeEnd: "",
      demoCount:  {},
      demoTIme: [],
      skill: [],
      day: [],
      demodays: [],
      demoStart: "9:00",
      demoend: "17:00",
      vacnt: 0,
      nameOf: "",
      selectMap: [],
      value: {
        start: "9:00",
        end: "17:00",
        bgcolor: "",
        selected: "lightgray",
        days: "",
      },
    };
  }

  componentDidMount() {
    const { demoCount } = this.state;
    if (this.props.skill && this.props.skill.length > 0) {
      let allSkill = this.props.skill.flatMap((x, index) => [
        {
          id: index,
          name: x,
          count: 0,
          value: {
            start: "9:00",
            end: "17:00",
            bgcolor: "",
            selected: "lightgray",
            days: "",
          },
        },
      ]);
      this.setState(
        {
          skill: allSkill,
        },
        () => {
          // console.log(this.state.skill);
        }
      );
    }
    const selectMap = this.props.adduser
      ? this.props.adduser
      : JSON.parse(localStorage.getItem("secondPageSkill"));

    this.setState(
      {
        industry: this.props.industry,
        skills: this.props.industry ? this.props.skill : null,
        selectMap: selectMap,
      },
      () => {
        return this.state.selectMap
          ? this.setState({
              demoCount: this.state.selectMap.reduce(
                (acc, _, index) => ({ ...acc, [index]: 0 }),
                {}
              ),
            })
          : null;
      }
    );

    // this.setState({
    //   ...this.state.value, start: localStorage.getItem("startTime") ? JSON.parse(localStorage.getItem("startTime")) : [],
    //   ...this.state.end,end:localStorage.getItem('endTime') ? JSON.parse(localStorage.getItem('endTime')) : []
    // }, ()=>{
    // })
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }
  render() {
    const list = [
      { tab: "M" },
      { tab: "T" },
      { tab: "W" },
      { tab: "Th" },
      { tab: "F" },
      { tab: "S" },
    ];
    const { demoCount, demodays, nameOf } = this.state;
    return (
      <>
        <div className="Multistep_container container va_page3">
          {this.state.selectMap
            ? this.state.selectMap.map((item, index) => {
                return (
                  <div
                    className="Maindiv rows"
                    onClick={() => this.handleprops(index)}
                  >
                    <motion.section
                      animate={{ x: 0 }}
                      initial={{ x: 1000 }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        duration: 1,
                      }}
                      className="secondHead col-md-3 col-lg-3 col-sm-12"
                    >
                      <h5>
                        <b>{item}</b>
                      </h5>
                    </motion.section>
                    <section
                      className="leftSection offset-md-1 col-md-4 col-lg-4 col-sm-12"
                      onClick={() => this.handleprops(index)}
                    >
                      <h3 className="heading mt_30">
                         VA's do you need?
                      </h3>
                      <div className="va_middle mt_30">
                        <div className="subIcon">
                          <RemoveCircleOutlineOutlinedIcon
                            onClick={() => {
                              this.decrementCount(index,item)
                              this.setState(
                                {
                                  demoCount: {
                                    ...demoCount,
                                    [index]: demoCount[index] - 1,
                                  },
                                },
                                () => {
                                  if (demoCount[index] == 0) {
                                    this.setState({
                                      demoCount: {
                                        ...demoCount,
                                        [index]: 0,
                                      },
                                    });
                                  }
                                  // console.log(
                                  //   "dempocount",
                                  //   this.state.demoCount
                                  // );
                                }
                              );
                              // this.setState({ `count`: this.state.count - 1 });
                              // this.demoCountVa(item, index);
                            }}
                          />
                        </div>
                        <div className="counterdiv">
                          <div className="va_image">
                            <img src="/images/userMannual.svg" />
                          </div>
                          <div className="count_va">
                            <h3>{demoCount[index]}</h3>
                          </div>
                        </div>
                        <div className="addicon">
                          <AddCircleOutlineOutlinedIcon
                            onClick={(e) => {
                              this.incrementCount(index, item);
                              this.setState(
                                {
                                  demoCount: {
                                    ...demoCount,
                                    [index]: demoCount[index] + 1,
                                  },
                                },
                                () => {
                                  localStorage.setItem(
                                    "countva",
                                    JSON.stringify(demoCount[index])
                                  );
                                  // console.log(
                                  //   "dempocount",
                                  //   this.state.demoCount
                                  // );
                                }
                              );
                              // this.setState({ count: this.state.count + 1 });
                              // this.demoCountVa(item, index);
                            }}
                          />
                        </div>
                      </div>
                      <div className="va-subheading">
                        <h6>How many VA's do you need?</h6>
                      </div>
                    </section>
                    <motion.section
                      animate={{ x: 0 }}
                      initial={{ x: -1000 }}
                      transition={{
                        type: "spring",
                        stiffness: 60,
                        duration: 1,
                      }}
                      className="rightSection  col-md-4 col-lg-4 col-sm-12"
                    >
                      <h3 className="heading mt_30">Give Specifications</h3>
                      <h6 className="mt_30">Which days of the week?</h6>

                      <div className="days">
                        <ul>
                          {list.map((day, id) => {
                            return (
                              <li>
                                <div
                                  className="round"
                                  style={{
                                    backgroundColor:
                                      item === nameOf &&
                                      day.tab === this.state.setday &&
                                      demodays.some(
                                        (itemss) => itemss[item] === day.tab
                                      )
                                        ? "#182c44"
                                        : !demodays.some(
                                            (itemss) => itemss[item] === day.tab
                                          )
                                        ? "#F2F2F2"
                                        : "null",
                                    color:
                                      item === nameOf &&
                                      day.tab === this.state.setday &&
                                      demodays.some(
                                        (itemss) => itemss[item] === day.tab
                                      )
                                        ? "white"
                                        : !demodays.some(
                                            (itemss) => itemss[item] === day.tab
                                          )
                                        ? "gray"
                                        : "null",
                                  }}
                                  // style={{
                                  //   backgroundColor: this.state.items.includes(
                                  //     day.tab
                                  //   )
                                  //     ? "#182c44"
                                  //     : "",
                                  //   color: this.state.items.includes(day.tab)
                                  //     ? "white"
                                  //     : "",
                                  //   // boxShadow: this.state.items.includes(item.tab)
                                  //   //   ? "0px 3px 6px #00000029"
                                  //   //   : null,
                                  // }}
                                  onClick={() => {
                                    this.handleDays(id, day.tab, item, index);
                                    this.setState(
                                      { nameOf: item, setday: day.tab },
                                      () => {
                                        {
                                        }
                                      }
                                    );
                                  }}
                                >
                                  {day.tab}
                                </div>
                              </li>
                            );
                          })}
                        </ul>
                        <h6>How many hours a day?</h6>
                        {/* {console.log("insidejsx",[this.state.vatimeStart][index])}
                        <span>
                          Start Time: <b>{[this.state.vatimeStart][index]}</b>
                          End Time:
                          <b> {[this.state.vatimeEnd][index]}</b>
                        </span> */}
                      </div>
                      <div>
                        <form onChange={this.submitForm}>
                          <input
                            style={{ margin: 12 }}
                            placeholder="12:00"
                            type="time"
                            min="12:00"
                            max="00:00"
                            name="vatimeStart"
                            value={[this.state.vatimeStart][item]}
                            onChange={(e) => this.inputHandle(e, item, index)}
                          />
                          <b>To</b>
                          <input
                            style={{ margin: 12 }}
                            placeholder="00:00"
                            type="time"
                            min="12:00"
                            max="00:00"
                            name="vatimeEnd"
                            value={[this.state.vatimeEnd][item]}
                            onChange={(e) => this.inputHandle(e, item, index)}
                          />
                        </form>
                      </div>

                      <div className="rangeSlider">
                        {/* <TimeRangeSlider
                          disabled={false}
                          width={50}
                          format={24}
                          maxValue={"23:59"}
                          minValue={"00:00"}
                          name={"time_range"}
                          onChangeStart={this.changeStartHandler}
                          onChangeComplete={this.changeCompleteHandler}
                          onChange={this.timeChangeHandler}
                          step={1}
                          value={this.state.value}
                        /> */}
                      </div>
                    </motion.section>
                  </div>
                );
              })
            : null}
        </div>
      </>
    );
  }

  //Handling VA Count

  incrementCount = (index, item) => {
    let count = this.state.count;
    count[item]={[item]:this.state.demoCount[index] + 1}
    this.setState({ count: count }, () => {
      const values=Object.values(count)
    localStorage.setItem("vacount",JSON.stringify(values));
    });
  };

  decrementCount=(index,item)=>{
    let count = this.state.count;
    count[item]={[item]:this.state.demoCount[index] - 1}
    this.setState({ count: count }, () => {
    const values=Object.values(count)
    localStorage.setItem("vacount",JSON.stringify(values));
    });
  }

  submitForm = (e) => {
    e.preventDefault();
  };

  //Handling Time Input
  inputHandle = (e, item, index) => {
    const { name, value } = e.target;
    let va = this.state.vaTime;
    va[item] = { ...va[item], [name]: value };
    this.setState({
      vaTime: va,
      [e.target.name]: e.target.value,
    });
    this.handleprops();
    setTimeout(() => {}, 500);
  };

  handleDays = (id, tab, increment, index) => {
    let items = [...this.state.items];
    const { demodays } = this.state;
    let toggle = true;

    //   items.push([tab,increment]);

    // // items.push(tab);

    // this.setState({ items: items }, () => {
    //   console.log("items", items);
    // });

    demodays.push({ [increment]: tab });
    //we are filtering that no object with same key value should enter in array.
    const filteredObject = demodays.reduce((res, itm) => {
      // Test if the item is already in the new array
      let result = res.find(
        (item) => JSON.stringify(item) == JSON.stringify(itm)
      );
      // If not lets add it
      if (!result) {
        return res.concat(itm);
      } else {
        // If we have and we click on same day then it will get deleted from array of object.
        const removeDayObject = res.filter(
          (item) => JSON.stringify(item) !== JSON.stringify(itm)
        );
        toggle = false;
        this.setState({ demodays: removeDayObject }, () => {});
        return res;
      }
    }, []);

    Object.keys(demodays);

    if (toggle === true) {
      this.setState({ demodays: filteredObject }, () => {});
    }

    //   let items = [...this.state.items];
    //   let pushItem = true;
    //  for (let listitem of items) {
    //     if (listitem === tab) {
    //       pushItem = false;
    //     }
    //   }
    //   if (pushItem) {
    //     items.push(tab);
    //   }
    // this.setState({ selected: id, days: tab, items: items }, () => {
    //   localStorage.setItem("selectedDays", JSON.stringify(this.state.items));
    // });
    // // }, 1000);

    // if (this.state.items.includes(tab)) {
    //   this.setState(
    //     {
    //       items: this.state.items.filter((item) => {
    //         return item != tab;
    //       }),
    //     },
    //     () => {
    //       localStorage.setItem(
    //         "selectedDays",
    //         JSON.stringify(this.state.items)
    //       );
    //     }
    //   );
    // }
  };

  handleprops = (index) => {
    setTimeout(() => {
      this.props.thirdValue(
        this.state.demodays,
        this.state.skills,
        this.state.count,
        this.state.vaTime
      );
    }, 1000);
  };

  timeChangeHandler = (time) => {
    this.setState({
      value: time,
    });
  };

  timeChange = (name, index) => {};
}

//redux
const mapStates = (state) => {
  const { enquiry } = state;
  return enquiry;
};

const actions = {
  skillSet,
  AddUserInput,
};
const connectedThirdEnquiryPage = connect(mapStates, actions)(ThirdEnquiryPage);
export { connectedThirdEnquiryPage as ThirdEnquiryPage };

// export default ThirdEnquiryPage;
