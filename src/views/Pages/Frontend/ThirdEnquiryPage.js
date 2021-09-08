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
import { toast } from "react-toastify";
import sound from "../../../assets/images/sound2.wav";


class ThirdEnquiryPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      satColor: false,
      BydefaultDays: "",
      daysNeeded: [],
      count: [],
      items: [],
      setColor:[],
      dayu: {},
      demodaysback:[],
      industry: "",
      setday: "",
      skills: [],
      vaTime: {},
      vatimeStart: "",
      vatimeEnd: "",
      demoCount: {},
      demoTIme: [],
      skill: [],
      day: [],
      demodays: [{}],
      demoStart: "9:00",
      demoend: "17:00",
      vacnt: 1,
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
  this.handleprops();
    const { demoCount } = this.state;
    
      if(this.state.demodaysback.length===0){
        this.setState({
          BydefaultDays: "User Want Monday to friday of every selected field",
        },()=>{console.log("bydef",this.state.BydefaultDays)});
      }
      else{
        this.setState({
          BydefaultDays: null,
        },()=>{console.log("bydef",this.state.BydefaultDays)});
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
                (acc, _, index) => ({ ...acc, [index]: 1 }),
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
      { tab: "M", bool: true,full:"Monday" },
      { tab: "T", bool: true,full:"Tuesday" },
      { tab: "W", bool: true,full:"Wednesday" },
      { tab: "Th", bool: true,full:"Thursday" },
      { tab: "F", bool: true,full:"Friday" },
      { tab: "S", bool: this.state.satColor,full:"Saturday" },
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
                      <h3 className="heading mt_30">VA's do you need?</h3>
                      <div className="va_middle mt_30">
                        <div className="subIcon">
                          <RemoveCircleOutlineOutlinedIcon
                            onClick={() => {
                              this.playAudio();
                              this.decrementCount(index, item);
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
                              this.playAudio();
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
                                    backgroundColor:item === nameOf &&
                                    day.tab === this.state.setday &&
                                    demodays.some(
                                      (itemss) => itemss[item] === day.tab
                                    )
                                      ? "#F2F2F2"
                                      : !demodays.some(
                                          (itemss) => itemss[item] === day.tab
                                        ) && day.bool === true
                                      ? "#182c44"
                                      : "null",
                                    color:item === nameOf &&
                                      day.tab === this.state.setday &&
                                      demodays.some(
                                        (itemss) => itemss[item] === day.tab
                                      )
                                        ? "gray"
                                        : !demodays.some(
                                            (itemss) => itemss[item] === day.tab
                                          ) && day.bool === true
                                        ? "white"
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
                                    this.handleDays(id, day.tab, item, index,day.full);
                                     this.playAudio();
                                    this.setState(
                                      { nameOf: item, setday: day.tab },
                                      () => {
                                        setTimeout(() => {
                                         
                                            this.setState({
                                              satColor: !this.state.satColor,
                                            });
                                          
                                         
                                        }, 500);
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
                            className="timeInput"
                            style={{ margin: 12 }}
                            type="text"
                            autoComplete="off"
                            placeholder="10:00"
                            // min="10:00"
                            // max="18:00"
                            name="vatimeStart"
                            value={[this.state.vatimeStart][item]}
                            onChange={(e) => this.inputHandle(e, item, index)}
                          /><span style={{position:'absolute',right:344,top:198,color:'#182c44'}}>AM</span>
                          <b>To</b>
                          <input
                            className="timeInput"
                            style={{ margin: 12 }}
                            placeholder="06:00"
                            autoComplete="off"

                            type="text"
                            // min="12:00"
                            // max="00:00"
                            name="vatimeEnd"
                            value={[this.state.vatimeEnd][item]}
                            onChange={(e) => this.inputHandle(e, item, index)}
                          /><span style={{position:'absolute',right:166,top:198,color:'#182c44'}}>PM</span>
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



  //Handling Sound  
  playAudio=()=>{
    new Audio(sound).play();
  }

  //Handling VA Count

  incrementCount = (index, item) => {
    let count = this.state.count;
    count[item] = { [item]: this.state.demoCount[index] + 1 };
    this.setState({ count: count }, () => {
      const values = Object.values(count);
      localStorage.setItem("vacount", JSON.stringify(values));
    });
  };

  decrementCount = (index, item) => {
    let count = this.state.count;
    count[item] = { [item]: this.state.demoCount[index] - 1 };
    this.setState({ count: count }, () => {
      const values = Object.values(count);
      localStorage.setItem("vacount", JSON.stringify(values));
    });
  };

  submitForm = (e) => {
    e.preventDefault();
  };

  //Handling Time Input
  inputHandle = (e, item, index) => {

//Addig Colon after every 2nd word.
  var time = document.getElementsByClassName('timeInput'); 
  for (var i = 0; i < time.length; i++) { //Loop trough elements
    time[i].addEventListener('keyup', function (e) {; //Add event listener to every element
        var reg = /[0-9]/;
        if (this.value.length == 2 && reg.test(this.value)) this.value = this.value + ":"; //Add colon if string length > 2 and string is a number 
        if (this.value.length > 5) this.value = this.value.substr(0, this.value.length - 1); //Delete the last digit if string length > 5
    });
};
    const { name, value } = e.target;
    let va = this.state.vaTime;
    va[item] = { ...va[item], [name]: value };
    this.setState(
      {
        vaTime: va,
        [e.target.name]: e.target.value,
      },
      () => {}
    );
    this.handleprops();
    setTimeout(() => {}, 500);
  };

  //Handling Days
  handleDays = (id, tab, increment, index,fullName) => {
   
   
    const list = ["M","T","W","Th","F","S"];

    const { demodays,demodaysback} = this.state;
    let toggle = true;
    let flag=false;
    demodaysback.forEach((element) => {
      if (element.hasOwnProperty(increment)) {
        if(element[increment].includes(tab)){
          toast.success(`Removed ${fullName} For ${increment} VA`)

          element[increment]=element[increment].filter(x=>tab!==x)
          flag=true;
          return;
        }
        else{
          element[increment].push(tab);
          toast.success(`Added ${fullName} For ${increment} VA`)

        }
        flag=true;
      }
    }
    );
    if(!flag){
      // demodays.push({[increment]:[tab]});
      let arr=list.filter(x=>x!==tab);
      demodaysback.push({[increment]:arr});
    }

    if(this.state.demodaysback.length>0){
      this.setState({BydefaultDays:null})
    }
    this.setState({setColor:demodaysback[Object.keys(demodaysback)[index]]?.[increment]})
  
 


    // const list = [
    //   { tab: "M", bool: true },
    //   { tab: "T", bool: true },
    //   { tab: "W", bool: true },
    //   { tab: "Th", bool: true },
    //   { tab: "F", bool: true },
    //   { tab: "S", bool: this.state.satColor },
    // ];

     demodays.push({ [increment]: tab });
    //we are filtering that no object with same key value should enter in array.
    const filteredObject = demodays.reduce((res, itm) => {
      // Test if the item is already in the new array
      let result = res.find(
        (item) => JSON.stringify(item) == JSON.stringify(itm)
      );
      // If not lets add it
      if (!result) {
        return  res.concat(itm) 
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
      this.setState({ demodays: filteredObject }, () => {
      });

    }
     
    // if(document.getElementsByClassName("round").style.backgroundColor)



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
        this.state.demodaysback,
        this.state.skills,
        this.state.count,
        this.state.vaTime,
        this.state.BydefaultDays
      );
    }, 1000);
  };

  timeChangeHandler = (time) => {
    this.setState({
      value: time,
    });
  };
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






// backgroundColor:
// item === nameOf &&
// day.tab === this.state.setday &&
// demodays.some(
//   (itemss) => itemss[item] === day.tab
// )
//   ? "#F2F2F2"
//   : !demodays.some(
//       (itemss) => itemss[item] === day.tab
//     ) && day.bool === true
//   ? "#182c44"
//   : "null",
// color:
// item === nameOf &&
// day.tab === this.state.setday &&
// demodays.some(
//   (itemss) => itemss[item] === day.tab
// )
//   ? "gray"
//   : !demodays.some(
//       (itemss) => itemss[item] === day.tab
//     ) && day.bool === true
//   ? "white"
//   : "null",
