import React, { Component } from 'react';
import { FormGroup, Label, } from 'reactstrap';
// import { BrowserRouter as Router, Route, Switch, Redirect, Link } from 'react-router-dom';
import './HireVaPage.css'
import 'jquery-easing';
import commonService from '../../../../core/services/commonService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import clientAreaNeed from './clientNeedAreaList1.json';
import industryBelongList from './industryBelongList1.json';
import TimeRangeSlider from 'react-time-range-slider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';


class HireVaPage extends Component {
    constructor(params) {
        super(params)
        this.state = {
            selectedArea: [],
            IndustryList: [],
            clientArea: [],
            timer: {
                start: "10:00",
                end: "18:00"
            },
            redirect: false,
            tabIndex: 0,
            addVa: 0,
            active: "",
            Administrative: 'Administrative',
            // industryBelong: { advertising: "10", accounting: "9" },
            end_am_pm: 'PM',
            start_am_pm: 'AM',
            completeWishTime: '',
            isActive: 1,
            tabCount: 8,
            selectedTab: 0,
            indexChange: 1,
            needMore: "",
            others: '',
            disabledPageNew: { '1': true, '2': true, '3': true, '4': true, '5': true, '6': true, '7': true },
            disabledPage: true,
            selectedVaNumberByImage: '',
            selectedTabValue: { '1': [], '2': [], '3': [], '4': [], '5': [], '6': [], '7': [], '8': []},
            somthingAboutYou: { firstPersonName: '', lastPersonName:'', companyName: '', companyAddress: '', email: '', phoneNumber: '' },
        }
        this.featureRef = React.createRef();
        this.changeStartHandler = this.changeStartHandler.bind(this);
        this.timeChangeHandler = this.timeChangeHandler.bind(this);
        this.changeCompleteHandler = this.changeCompleteHandler.bind(this);
        this.addManyVaHnadler = this.addManyVaHnadler.bind(this);
        this.industryBelongHandler = this.industryBelongHandler.bind(this);
        this.clientAreaNeedHandler = this.clientAreaNeedHandler.bind(this);
        this.dayHnadler = this.dayHnadler.bind(this);
        this.choosePlanHandler = this.choosePlanHandler.bind(this);
        this.needSomeoneQuickly = this.needSomeoneQuickly.bind(this);
        this.somthingAboutYouHandler = this.somthingAboutYouHandler.bind(this);
        this.skillFreelancers = this.skillFreelancers.bind(this);
        this.setActiveTab = this.setActiveTab.bind(this)
        this.backButton = this.backButton.bind(this);
        this.needMoreHandler = this.needMoreHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.othersHandler = this.othersHandler.bind(this);
    }

    othersHandler(event) {

        let name = event.target.name;
        let value = event.target.value;
        let others = this.state.others;
        // needMore = value;
        others = value;
        this.setState({ others: others});

    }

    // page 1 need more handler
    needMoreHandler(event) {

        let name = event.target.name;
        let value = event.target.value;
        let needMore = this.state.needMore;
        // needMore = value;
        needMore = value;
        this.setState({ needMore: needMore });

    }

    /* Submit Form Handler*/
    submitHandler(event) {
        event.preventDefault();
        // event.target.className += "was-validated";
        this.setState({ loading: true }, () => {
            const somthingAboutYou = this.state.somthingAboutYou;
            const selectedTabValue = this.state.selectedTabValue;

            //    Selected Industry 
            const selectedIndustry = []
            this.state.industryBelongList.forEach(element => {
                selectedTabValue[2].map(e => {
                    if (e == element.id) {
                        selectedIndustry.push(element)

                    }

                })

            });

            //    Area Where you need
            const selectedAreaNeed = []
            this.state.selectedArea.forEach((element, index) => {

                if (element.parentId == selectedTabValue[3][index]) {
                    element.vADesignation.filter(va => {

                        selectedTabValue[4].some(e => {
                            const FinalAreaObj = {}
                            if (e == va.id) {
                                FinalAreaObj.parentId = element.parentId
                                FinalAreaObj.parentName = element.parentName
                                FinalAreaObj.vADesignation = [va]
                                selectedAreaNeed.push(FinalAreaObj)
                            }
                        })
                    });
                }

            });


            const arrayHashmap = selectedAreaNeed.reduce((obj, item) => {
                obj[item.parentId] ? obj[item.parentId].vADesignation.push(...item.vADesignation) : (obj[item.parentId] = { ...item });
                return obj;
            }, {});
            const mergedArray = Object.values(arrayHashmap);

            const formData = {
                howManyVas: this.state.needMore >= parseInt(this.state.selectedVaNumberByImage) ? this.state.needMore : parseInt(this.state.selectedVaNumberByImage),
                WhichIndustryYouBelong: selectedIndustry,
                others: this.state.others,
                AreaAndSkillFreelancer: mergedArray,
                giveSpecification: selectedTabValue[5],
                completeWishTime: { completeWishTime: this.state.completeWishTime, StartAndEndTime: this.state.timer },
                ChooseYourPlan: selectedTabValue[6],
                howQuicklyNeed: this.state.selectedTabValue[7][0],
                somthingAboutYou: somthingAboutYou,
            };
            // console.log("formData-------------->Front",formData)
            // return;
            commonService.postAPIWithAccessToken('hire/hire-va1', formData)
                .then(res => {
                    // console.log("HireVA 1>>>", res)
                    if (undefined === res.data.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }

                    this.props.history.push('/common/thanks-to-you');

                    // toast.success(res.data.message);


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

    // back Button
    backButton(id = null) {
        // console.log("Back button", id)
        let selectedTab = this.state.selectedTab;
        let tabCount = this.state.tabCount;
        let indexChange = this.state.indexChange;
        let addId = selectedTab - 2;
        document.getElementById('react-tabs-' + addId).click();
        this.setState({ selectedTab: addId })
    }
    // active Button
    setActiveTab(id) {
        // console.log("next button", parseInt(id))
        let selectedTab = this.state.selectedTab;
        let add = selectedTab + 2;
        document.getElementById('react-tabs-' + add).click();
        this.setState({ selectedTab: add })
    }

    skillFreelancers(event) {

        var selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;

        if (event.target.checked == true) {

            selectedTabValue[4].push(value);
        } else {

            selectedTabValue[4].filter((data, i, array) => {
                if (data == value) {
                    var index = array.indexOf(data)
                    if (index > -1) {
                        selectedTabValue[4].splice(index, 1);
                    }
                }
            });
        }

        var disabledPageNew = this.state.disabledPageNew;

        if (selectedTabValue[4].length > 0) {
            disabledPageNew[4] = false;
            this.setState({ selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[4] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }
    }

    somthingAboutYouHandler = event => {
        const name = event.target.name;
        const value = event.target.value;
        const somthingAboutYou = this.state.somthingAboutYou;
        somthingAboutYou[name] = value;
        this.setState({ somthingAboutYou: somthingAboutYou });
    };

    choosePlanHandler(event) {
        var selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;
        if (event.target.checked) {
            if (Object.keys(selectedTabValue[6]).length >= 0) {
                if (event.target.checked == true) {
                    selectedTabValue[6].splice(0, 1, value);

                }
            }
        }

        var disabledPageNew = this.state.disabledPageNew;

        if (selectedTabValue[6].length > 0) {
            disabledPageNew[6] = false;
            this.setState({ selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[6] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }


    }

    // Time Slider
    changeStartHandler(time) {
        // console.log("Start Handler Called", time);
        if (time){
            // console.log("INSIDE IFFFFF")
            this.setState({ timeChangeFound: true })
        }
           
    }

    timeChangeHandler(time) {
        // console.log("timeChangeHandler", time)
        let get_start_am_pm = this.state.start_am_pm
        let get_end_am_pm = this.state.end_am_pm
        const selectedStartTime = time.start;
        const selectedEndTime = time.end;

        //    start Time 
        const splitedStatrtTime = selectedStartTime.split(':')
        var start_am_pm = splitedStatrtTime[0] >= 12 && splitedStatrtTime[1] >= 0 ? "PM" : "AM"
        get_start_am_pm = start_am_pm;
        this.setState({ start_am_pm: get_start_am_pm })

        // End time
        const splitedEndTime = selectedEndTime.split(':')
        var end_am_pm = splitedEndTime[0] >= 12 && splitedEndTime[1] >= 0 ? "PM" : "AM";
        get_end_am_pm = end_am_pm
        this.setState({ end_am_pm: get_end_am_pm })

        this.setState({ timer: time });
    }

    changeCompleteHandler(time) {
        // console.log("Complete Handler Called", time);
        let endHrs = time.end.hours
        let endMin = time.end.minutes
        let startHrs = time.start.hours
        let startMin = time.start.minutes
        let completeWishTime
        if (endMin > startMin) {
            completeWishTime = (endHrs - startHrs) + ":" + (endMin - startMin)

        }

        if (endMin < startMin) {
            completeWishTime = (endHrs - startHrs) + ":" + (startMin - endMin)

        }
        if (endMin == startMin) {
            completeWishTime = (endHrs - startHrs) + ":" + (endMin - startMin) + 0


        }
       
        this.setState({ completeWishTime: completeWishTime})
    }


    needSomeoneQuickly(event) {
        var selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;

        if (Object.keys(selectedTabValue[7]).length >= 0) {
            if (event.target.checked == true) {
                selectedTabValue[7].splice(0, 1, value);

            }
        }
        
        var disabledPageNew = this.state.disabledPageNew;

        if (selectedTabValue[7].length > 0) {
            disabledPageNew[7] = false;
            this.setState({ selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[7] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }


    }

    dayHnadler(event) {
        // console.log("eeeeeeeeeeeeeevvvvvvv", event.target.value)
        var selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;

        if (event.target.checked == true) {

            selectedTabValue[5].push(value);
        } else {

            selectedTabValue[5].filter((data, i, array) => {
                if (data == value) {
                    // selectedTabValue[5].splice(index);
                    var index = array.indexOf(data)
                    // console.log("index", index)
                    if (index > -1) {
                        selectedTabValue[5].splice(index, 1);
                    }
                }
            });
        }
               
        var disabledPageNew = this.state.disabledPageNew;
        if (selectedTabValue[5].length > 0) {
            disabledPageNew[5] = false;
            this.setState({ selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[5] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }
    }

    clientAreaNeedHandler(event) {

        var selectedTabValue = this.state.selectedTabValue;
        var addValue = this.state.selectedArea;
        const value = event.target.value;
        const name = event.target.name;
        let list = [];
        // const item = this.state.item
        list = this.state.clientArea;

        list = list[value];
      
        if (event.target.checked == true) {
            selectedTabValue[3].push(list.parentId)
            addValue.push(list);
        } else {
            addValue.filter((data, index) => {
                if (data.parentId == list.parentId) {
                    addValue.splice(index, 1);
                    // remove seleted client area need 
                    selectedTabValue[3].filter((element, i, array) => {
                        if (element == data.parentId) {
                            const index = array.indexOf(element)
                            // console.log("index", index)
                            if (index > -1) {
                                selectedTabValue[3].splice(index, 1);
                            }
                        }
                    });
                }
            });

            // selectedTabValue[3].filter((data, i, array) => {
            //     console.log("t---------------ttta", data, value)
            //     if (data == value) {
            //         var index = array.indexOf(data)
            //         console.log("index", index)
            //         if (index > -1) {
            //             selectedTabValue[3].splice(index, 1);
            //         }
            //     }
            // });
        }

        var disabledPageNew = this.state.disabledPageNew;

        if (selectedTabValue[3].length > 0) {
            disabledPageNew[3] = false;
            this.setState({ selectedArea: addValue, selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[3] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }
    }

    industryBelongHandler(event) {
        // console.log("eeeeeeeeeeeeeevvvvvvv", event.target.value)
        const others =this.state.others;
        var selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;

        if (event.target.checked == true) {

            selectedTabValue[2].push(value);
            // selectedTabValue[9].push(others);

        } else {
            selectedTabValue[2].filter((data, i, array) => {
                if (data == value) {
                    var index = array.indexOf(data)
                    // console.log("index", index)
                    if (index > -1) {
                        selectedTabValue[2].splice(index, 1);
                    }
                }
            });
        }
        // console.log("selectedTabValue[9].push(others)", selectedTabValue[9])
        // this.setState({ disabledPage: true })
        var disabledPageNew = this.state.disabledPageNew;
        if (selectedTabValue[2].length > 0) {
            disabledPageNew[2] = false;
            this.setState({ selectedTabValue: selectedTabValue, others:others, disabledPageNew: disabledPageNew })
        } else {
            disabledPageNew[2] = true;
            this.setState({ disabledPage: true, disabledPageNew: disabledPageNew })
        }
    }


    addManyVaHnadler(event) {
        // console.log("eeeeeeeeeeeeeevvvvv", event.target.value)
        let selectedTabValue = this.state.selectedTabValue;
        const value = event.target.value;
        const name = event.target.name;

        // if (event.target.checked == true) {
        //     selectedTabValue[1].push(value);
        //     // console.log("Length111",selectedTabValue[1].length)
        //     let selectedVaNumberByImage = this.state.selectedVaNumberByImage;
        //     selectedVaNumberByImage = selectedTabValue[1].length;
        //     this.setState({ selectedVaNumberByImage: selectedVaNumberByImage })
        // } else {
        //     selectedTabValue[1].filter((data, i, array) => {
        //         if (data == value) {
        //             var index = array.indexOf(data)
        //             console.log("index", index)
        //             if (index > -1) {
        //                 selectedTabValue[1].splice(index, 1);
        //             }
        //         }
        //     });

        //     // this.setState({selectedTabValue: selectedTabValue })
        // }

        if (event.target.checked) {
            if (Object.keys(selectedTabValue[1]).length >= 0) {
                // console.log(typeof selectedTabValue[1], "getCheck")
                if (event.target.checked == true) {
                    selectedTabValue[1].splice(0, 1, value);
                    let selectedVaNumberByImage = this.state.selectedVaNumberByImage;
                    selectedVaNumberByImage = selectedTabValue[1];
                    this.setState({ selectedVaNumberByImage: selectedVaNumberByImage })

                }
            }
        }

        var disabledPageNew = this.state.disabledPageNew;

        if (selectedTabValue[1].length > 0) {
            disabledPageNew[1] = false;
            this.setState({ selectedTabValue: selectedTabValue, disabledPageNew: disabledPageNew })

        } else {
            disabledPageNew[1] = true;
            this.setState({ disabledPageNew: disabledPageNew })
        }




    }

    componentDidMount() {
        // window.scrollTo({ bottom: 0, left: 0,  behavior: 'smooth' })
        // this.getIndustryList()
        this.setState({ clientArea: clientAreaNeed.clientArea })

        // Belonged Industres List 
        this.setState({ industryBelongList: industryBelongList.industries })

    
            // window.scrollTo(500, 800)
        


    }

    render() {
        const { loading, selectedArea, clientArea, item, tabIndex, Administrative, industryBelong, addVa, active, selectedTabValue, somthingAboutYou, selectedTab, tabCount, indexChange, needMore, industryBelongList, disabledPage, disabledPageNew, redirect } = this.state;
        // console.log( selectedTabValue, "sssssssss")
        // console.log("this//////////////",this.state.selectedVaNumberByImage)

        return (
            <>
                <div className="dashboard-section">
                    <section className="Client-form-section">
                        <div className="Client-form-container">

                            <form onSubmit={(event) => this.submitHandler(event)} id="msform">
                                {/* <Tabs  selectedIndex={tabIndex} onSelect={tabIndex => this.setState({tabIndex:tabIndex,selectedTab:selectedTab+tabIndex })} > */}

                                <Tabs selectedIndex={tabIndex} onSelect={tabIndex => this.setState({ selectedTab: 2*tabIndex, tabIndex: tabIndex, disabledPage: !disabledPage })} >
                                    {/* id ="progressbar"  */}
                                    <TabList className="Client-form-nav-tabs ">
                                        <Tab id="tabid-1" tabfor="0" ></Tab>
                                        <Tab disabled={disabledPageNew[1]} id="tabid-2" tabfor="1"> </Tab>
                                        <Tab disabled={disabledPageNew[2]} id="tabid-3" tabfor="2"></Tab>
                                        <Tab disabled={disabledPageNew[3]} id="tabid-4" tabfor="3"></Tab>
                                        <Tab disabled={disabledPageNew[4]} id="tabid-5" tabfor="4" ></Tab>
                                        <Tab disabled={disabledPageNew[5]} id="tabid-6" tabfor="5" ></Tab>
                                        <Tab disabled={disabledPageNew[6]} id="tabid-7" tabfor="6" ></Tab>
                                        <Tab disabled={disabledPageNew[7]} id="tabid-8" tabfor="7" ></Tab>
                                    </TabList>
                                    <div className="Client-form-body">
                                        {/* {selectedTabValue[2].length>0 ? */}
                                        {/* `${ */}
                                        <TabPanel tabId="0" className="Client-form-step1" >
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>How may VA's do you need?</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="form-radio-group">
                                                            <h4 className="heading-title-sm">How many VA do you need?</h4>
                                                            <ul className="filter-field-list1">
                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="1" id="1" checked={selectedTabValue[1].indexOf("1") >= 0 ? true : false} type="checkbox" value="1" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="1">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">1</span>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="2" id="two-person" checked={selectedTabValue[1].indexOf("2") >= 0 ? true : false} type="checkbox" value="2" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="two-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">2</span>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="3" id="three-person" checked={selectedTabValue[1].indexOf("3") >= 0 ? true : false} type="checkbox" value="3" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="three-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">3</span>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="4" id="four-person" checked={selectedTabValue[1].indexOf("4") >= 0 ? true : false} type="checkbox" value="4" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="four-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">4</span>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="5" id="five-person" checked={selectedTabValue[1].indexOf("5") >= 0 ? true : false} type="checkbox" value="5" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="five-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">5</span>
                                                                        </label>
                                                                    </div>
                                                                </li>

                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="6" id="six-person" checked={selectedTabValue[1].indexOf("6") >= 0 ? true : false} type="checkbox" value="6" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="six-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">6</span>
                                                                        </label>
                                                                    </div>
                                                                </li>

                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="7" id="seven-person" checked={selectedTabValue[1].indexOf("7") >= 0 ? true : false} type="checkbox" value="7" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="seven-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">7</span>
                                                                        </label>
                                                                    </div>
                                                                </li>

                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="8" id="eight-person" checked={selectedTabValue[1].indexOf("8") >= 0 ? true : false} type="checkbox" value="8" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="eight-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">8</span>
                                                                        </label>
                                                                    </div>
                                                                </li>

                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="9" id="nine-person" checked={selectedTabValue[1].indexOf("9") >= 0 ? true : false} type="checkbox" value="9" onChange={this.addManyVaHnadler} />
                                                                        <label htmlFor="nine-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">9</span>
                                                                        </label>
                                                                    </div>
                                                                </li>

                                                                <li style={{ "width": "19%" }}>
                                                                    <div className="SRcheckbox">
                                                                        <input name="10" id="ten-person" checked={selectedTabValue[1].indexOf("10") >= 0 ? true : false} type="checkbox" value="10" onChange={this.addManyVaHnadler} type="checkbox" />
                                                                        <label htmlFor="ten-person">
                                                                            <img src="/images/one-person.svg" height="60" />
                                                                            <span className="SRRadio-value-text">10</span>
                                                                        </label>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="mt-3">
                                                            <div className="row">
                                                                <div className="col-md-12 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Need More?</h4>
                                                                        <input type="text" name={needMore} value={needMore} className="form-control" placeholder="Type" onChange={this.needMoreHandler} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* <input type="button" name="next" className="next action-button" value="Next" isActive="1"
                                            //  className={this.state.isActive === item.id ? 'nav-active' : ''}
                                                      onClick={() => this.setActiveTab("1")} /> */}
                                                {/* {selectedTabValue[2].length==0 ? */}
                                                
                                                <input type="button" name="next" className="next action-button" value="Next" disabled={disabledPageNew[1]}
                                                    id="react-tabs-0" onClick={() => this.setActiveTab("0")} />

                                            </div>
                                        </TabPanel>


                                        {/* 2 page */}

                                        <TabPanel tabId="2">
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Which industry you belong?</h2>
                                                    </div>

                                                    <div className="Client-form-answer">
                                                        <div className="form-input-group">
                                                            <ul className="filter-field-list">
                                                                <li>
                                                                    <label htmlFor="1">
                                                                        <input id="1" type="checkbox" value="1" name="1" checked={selectedTabValue[2].indexOf("1") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#">
                                                                                    <img src="/images/advertisingi.svg" height="60"  alt ="Advertising"/>
                                                                                </a>

                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Advertising
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <label htmlFor="2">
                                                                        <input type="checkbox" id="2" value="2" name="2" checked={selectedTabValue[2].indexOf("2") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/accounting_finance.svg" alt ="Accounting / Finance" height="60"  /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Accounting / Finance
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <label htmlFor="3" >
                                                                        <input type="checkbox" id="3" value="3" name="3" checked={selectedTabValue[2].indexOf("3") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/apparel.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Apparel
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="4">
                                                                        <input type="checkbox" id="4" value="4" name="4" checked={selectedTabValue[2].indexOf("4") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/constructionArchEng.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Construction / Architecture / Engineering
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="5">
                                                                        <input type="checkbox" id="5" value="5" name="5" checked={selectedTabValue[2].indexOf("5") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/design_icon.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Designs
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="6">
                                                                        <input type="checkbox" id="6" value="6" name="6" checked={selectedTabValue[2].indexOf("6") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/entertainment.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Entertainment
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="7">
                                                                        <input type="checkbox" id="7" value="7" name="7" checked={selectedTabValue[2].indexOf("7") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/education_icon.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Education
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>


                                                                <li>
                                                                    <label htmlFor="8">
                                                                        <input type="checkbox" id="8" value="8" name="8" checked={selectedTabValue[2].indexOf("8") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/healthcare.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Healthcare / Medical
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="9">
                                                                        <input type="checkbox" id="9" value="9" name="9" checked={selectedTabValue[2].indexOf("9") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/hospitality.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Hospitality / Catering
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="10">
                                                                        <input type="checkbox" id="10" value="10" name="10" checked={selectedTabValue[2].indexOf("10") >= 0 ? true : false} onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/legal.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Legal / Consulting
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>


                                                                <li>
                                                                    <label htmlFor="11">
                                                                        <input type="checkbox" id="11" value="11" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/logistics.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                ALogistics & Transportpparel
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>


                                                                <li>
                                                                    <label htmlFor="12">
                                                                        <input type="checkbox" id="12" value="12" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/management.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Management
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="13">
                                                                        <input type="checkbox" id="13" value="13" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/manufacturing.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Manufacturing
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="14">
                                                                        <input type="checkbox" id="14" value="14" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/retail.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Retail
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="15">
                                                                        <input type="checkbox" id="15" value="15" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/realstate.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Real Estate
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="16" >
                                                                        <input type="checkbox" id="16" value="16" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/telecommunication.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Telecommunication
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="17">
                                                                        <input type="checkbox" id="17" value="17" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/travel.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Travel, Leisure & Tourism
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="18">
                                                                        <input type="checkbox" id="18" value="18" name="Skills[]" onChange={this.industryBelongHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/ecommerce.svg" height="60" /></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                ECommerce
                                                                </div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                            </ul>
                                                        </div>
                                                        <div className="mt-1">
                                                            <div className="row">
                                                                <div className="col-md-12 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Others</h4>
                                                                        <input type="text" name="Others" id ="Others" value={this.state.others} className="form-control" placeholder="Type" onChange={this.othersHandler} />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                               
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("2")} disabled={disabledPageNew[2]} id="react-tabs-2" />
                                            </div>

                                        </TabPanel>



                                        {/* Close page 2 */}

                                        {/* page 3 */}
                                        <TabPanel tabId="3">
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Area where you need help</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="form-radio-group">
                                                            <ul className="filter-field-list text-left">
                                                                <li>
                                                                    <label htmlFor="0">

                                                                        <input type="checkbox" id="0" checked={selectedTabValue[3].indexOf("1") >= 0 ? true : false} value="0" name="0" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/adminstrative.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Administrative tasks/ Data Entry
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <label htmlFor="1">
                                                                        <input type="checkbox" id="1" checked={selectedTabValue[3].indexOf("9") >= 0 ? true : false} value="1" name="1" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/executive.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Executive Assistants
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                                <li>
                                                                    <label htmlFor="2">
                                                                        <input type="checkbox" id="2" checked={selectedTabValue[3].indexOf("15") >= 0 ? true : false} value="2" name="2" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/ecommarce_related_task.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                ECommerce related tasks
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="3">
                                                                        <input type="checkbox" type="checkbox" id="3" checked={selectedTabValue[3].indexOf("25") >= 0 ? true : false} value="3" name="3" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/adminstrative.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Customer Support Service
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="4">
                                                                        <input type="checkbox" id="4" checked={selectedTabValue[3].indexOf("31") >= 0 ? true : false} value="4" name="4" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/graphic_design.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Graphic Designing/ Video Editing
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="5">
                                                                        <input type="checkbox" id="5" checked={selectedTabValue[3].indexOf("40") >= 0 ? true : false} value="5" name="5" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/marketing_icon.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Marketing
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="6">
                                                                        <input type="checkbox" id="6" checked={selectedTabValue[3].indexOf("47") >= 0 ? true : false} value="6" name="6" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/icons/accounting_BookKeeping.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Accounting/Bookkeeping
                                                               	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="7">
                                                                        <input type="checkbox" id="7" checked={selectedTabValue[3].indexOf("53") >= 0 ? true : false} value="7" name="7" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/icons/cold_calling.svg" height="60" /> </a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Cold Calling
                                                                    	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>

                                                                <li>
                                                                    <label htmlFor="8">
                                                                        <input type="checkbox" id="8" checked={selectedTabValue[3].indexOf("59") >= 0 ? true : false} value="8" name="8" onChange={this.clientAreaNeedHandler} />
                                                                        <div className="ar-field-list-option-1">
                                                                            <div className="field-svg-icon">
                                                                                <a href="#"><img src="/images/icons/programming_development.svg" height="60"/></a>
                                                                            </div>
                                                                            <div className="field-value-text">
                                                                                Programming and Development
                                                                         	</div>
                                                                        </div>
                                                                    </label>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("4")} disabled={disabledPageNew[3]} id="react-tabs-4" />
                                            </div>
                                        </TabPanel>
                                        {/* close page 3 */}
                                        {/* page 4  */}
                                        <TabPanel tabId="4" selectedtabclassname={active}>
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Skills Freelancers Need</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="filter-content">
                                                            <div className="filter-Category-list">
                                                                {

                                                                    selectedArea.map((e, index) => {

                                                                        return (<div key={index} className="filter-Category-item-info">

                                                                            <h2>{e.parentName}</h2>

                                                                            <div className="filter-Category-item-body">
                                                                                <ul>
                                                                                    {e.vADesignation.map((va, i) => {
                                                                                        return (<li key={va.id}>
                                                                                            <div className="filterCheckbox">
                                                                                                <input type="checkbox" name={va.id} id={va.id} value={va.id}
                                                                                                    onChange={this.skillFreelancers}
                                                                                                    checked={selectedTabValue[4].indexOf(va.id) >= 0 ? true : false} />
                                                                                                <label htmlFor={va.id}>{va.profileName}</label>
                                                                                            </div>
                                                                                        </li>)
                                                                                    })}

                                                                                </ul>
                                                                            </div>
                                                                        </div>)

                                                                    })
                                                                }

                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("6")} disabled={disabledPageNew[4]} id="react-tabs-6" />
                                            </div>
                                        </TabPanel >
                                        {/* close page 4 */}
                                        {/* page 5 */}
                                        <TabPanel tabId="5" selectedtabclassname={active}>
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Give Specifications</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="form-radio-group">
                                                            <h4 className="heading-title-sm">Which days of the week?</h4>
                                                            <ul className="week-day-list">
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Sunday" name="days1[]" id="Sun" checked={selectedTabValue[5].indexOf("Sunday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Sun">Sunday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Monday" name="days2[]" id="Mon" checked={selectedTabValue[5].indexOf("Monday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Mon">Monday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Tuesday" name="days3[]" id="Tue" checked={selectedTabValue[5].indexOf("Tuesday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Tue">Tuesday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Wednesday" name="days4[]" id="Wed" checked={selectedTabValue[5].indexOf("Wednesday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Wed">Wednesday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Thursday" name="days5[]" id="Thu" checked={selectedTabValue[5].indexOf("Thursday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Thu">Thursday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Friday" name="days6[]" id="Fri" checked={selectedTabValue[5].indexOf("Friday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Fri">Friday</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="checkbox-box1">
                                                                        <input type="checkbox" value="Saturday" name="days7[]" id="Sat" checked={selectedTabValue[5].indexOf("Saturday") >= 0 ? true : false} onChange={this.dayHnadler} />
                                                                        <label htmlFor="Sat">Saturday</label>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                        <div className="form-radio-group mt-3">
                                                            <h4 className="heading-title-sm">How many hours a day?</h4>
                                                            <ul className="week-day-list">
                                                                <div data-role="page">
                                                                    <div data-role="main" className="ui-content">
                                                                        {/* <form> */}
                                                                        <FormGroup>
                                                                            {/* <input type="text" value={this.state.timer.start} onChange={this.timeChangeHandler} name="timer" id="time" /> */}

                                                                            {/* <input type="text" value={this.state.timer.start} onChange={this.timeChangeHandler} name="timer" id="time" />{this.state.timer.start} AM
                                                                        <input type="text" value={this.state.timer.end} onChange={this.timeChangeHandler} name="timer" id="time" /> */}
                                                                            <Label >Start Time: {this.state.timer.start} {this.state.start_am_pm}
                                                                            </Label>
                                                                            <Label style={{ "marginLeft": "10px" }}>End Time :{this.state.timer.end} {this.state.end_am_pm} </Label>
                                                                            <TimeRangeSlider
                                                                                disabled={false}
                                                                                format={24}
                                                                                maxValue={"18:00"}
                                                                                minValue={"10:00"}
                                                                                name={"time_range"}
                                                                                onChangeStart={this.changeStartHandler}
                                                                                onChangeComplete={this.changeCompleteHandler}
                                                                                onChange={this.timeChangeHandler}
                                                                                step={15}
                                                                                value={this.state.timer}
                                                                            //    orientation={String} 
                                                                            required />
                                                                            <div className="filter-Price-info">
                                                                                <div className="filter-content">
                                                                                    <div id="ranged-value1"></div>
                                                                                </div>
                                                                            </div>
                                                                        </FormGroup>
                                                                        {/* </form> */}
                                                                    </div>
                                                                </div>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("8")} disabled={disabledPageNew[5]} id="react-tabs-8" />
                                            </div>
                                        </TabPanel>
                                        {/* close page 5 */}
                                        {/* page 6 */}
                                        <TabPanel tabId="6">
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Choose Your Plan</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="form-radio-group">
                                                            <div className="">
                                                                <div className="row">
                                                                    <div className="col-xs-12 col-md-4">
                                                                        <div className="panel panel-primary">
                                                                            <div className="panel-heading">
                                                                                <h5 className="panel-title p-0 mt-2">Standard</h5>
                                                                            </div>
                                                                            <div className="panel-body">
                                                                                <div className="the-price">
                                                                                    <h1>
                                                                                        $12<span className="subscript">/mo</span>
                                                                                    </h1>
                                                                                    <small>1 month FREE trial</small>
                                                         
                                                                                </div>
                                                                                <table className="table">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Entry Level Tasks
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Virtual Assistant
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Customer Service
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Email Support
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Basic Social Media
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Bookeeping
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Admin Tasks
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            And More ..
									                                                         </td>
                                                                                        </tr>
                                                                                        <tr className="active">
                                                                                            <td>
                                                                                                {/* 1 Project  */}
                                                                                            </td> 
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            <div className="panel-footer">
                                                                                <ul className="filter-field-list-1">
                                                                                    <li>
                                                                                        <label htmlFor="Standard">
                                                                                            <input type="checkbox" id="Standard" value="Standard" name="plan1" checked={selectedTabValue[6].indexOf("Standard") >= 0 ? true : false} onChange={this.choosePlanHandler} />
                                                                                            <div className="ar-field-list-option">
                                                                                                Select
					                                                </div>
                                                                                        </label>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-12 col-md-4">
                                                                        <div className="panel panel-success">
                                                                            <div className="cnrflash">
                                                                                <div className="cnrflash-inner">
                                                                                    <span className="cnrflash-label">Best Deal</span>
                                                                                </div>
                                                                            </div>
                                                                            <div className="panel-heading">
                                                                                <h5 className="panel-title p-0 mt-2">Premium</h5>
                                                                            </div>
                                                                            <div className="panel-body">
                                                                                <div className="the-price">
                                                                                    <h1>
                                                                                        $15
																																				                                             <span className="subscript">/mo</span>
                                                                                    </h1>
                                                                                    <small>1 month FREE trial</small>
                                                                                    
                                                                                </div>
                                                                                <table className="table">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Mid Level Tasks
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Video Editing
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Content Creation
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Graphic Design
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Client Relations
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Project Management
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Web Development
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Accounting
									                                                        </td>
                                                                                        </tr>
                                                                                         <tr>
                                                                                            <td>
                                                                                            Executive Assistant
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            And More...
									                                                        </td>
                                                                                        </tr>
                                                                                        

                                                                                        <tr className="active">
                                                                                            <td>
                                                                                                {/* 5 Project */}
									                                                         </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            <div className="panel-footer">
                                                                                <ul className="filter-field-list-1">
                                                                                    <li>
                                                                                        <label htmlFor="Premium">
                                                                                            <input type="checkbox" id="Premium" value="Premium" name="plan2" checked={selectedTabValue[6].indexOf("Premium") >= 0 ? true : false} onChange={this.choosePlanHandler} />
                                                                                            <div className="ar-field-list-option">
                                                                                                Select
					                                                </div>
                                                                                        </label>
                                                                                    </li>

                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="col-xs-12 col-md-4">
                                                                        <div className="panel panel-info">
                                                                            <div className="panel-heading">
                                                                                <h5 className="panel-title p-0 mt-2">Gold</h5>
                                                                            </div>
                                                                            <div className="panel-body">
                                                                                <div className="the-price">
                                                                                    <h1>
                                                                                        $20<span className="subscript">/mo</span>
                                                                                    </h1>
                                                                                    <small>1 month FREE trial</small>
                                                                       
                                                                                </div>
                                                                                <table className="table">
                                                                                    <tbody>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Expert Level Tasks
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Brand Strategist
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Amazon Admin
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Sales/Cold Calling
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            Product Design/Development
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            PPC/Social Media Advertising
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr>
                                                                                            <td>
                                                                                            And More...
									                                                        </td>
                                                                                        </tr>
                                                                                        <tr className="active">
                                                                                            <td>
                                                                                                {/* 20 Project */}
									                                                    </td>
                                                                                        </tr>
                                                                                    </tbody>
                                                                                </table>
                                                                            </div>
                                                                            <div className="panel-footer">
                                                                                <ul className="filter-field-list-1">
                                                                                    <li>
                                                                                        <label>
                                                                                            <input type="checkbox" id="Gold" value="Gold" name="plan3" checked={selectedTabValue[6].indexOf("Gold") >= 0 ? true : false} onChange={this.choosePlanHandler} />
                                                                                            <div className="ar-field-list-option">
                                                                                                Select
					                                                                    </div>
                                                                                        </label>
                                                                                    </li>
                                                                                </ul>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("10")} disabled={disabledPageNew[6]} id="react-tabs-10" />
                                            </div>
                                        </TabPanel>
                                        {/* close page 6 */}
                                        {/* page 7 */}
                                        <TabPanel tabId="7">
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>How quickly do you need someone?</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="form-input-group">
                                                            <ul className="filter-Category-nav-list">
                                                                <li>
                                                                    <div className="SRRadio">
                                                                        <input name="question1[]" id="question6[Within 48 hours]" type="radio" value="1" checked={selectedTabValue[7].indexOf("1") >= 0 ? true : false} onChange={this.needSomeoneQuickly} />
                                                                        <label htmlFor="question6[Within 48 hours]">Within 48 hours</label>
                                                                    </div>
                                                                </li>
                                                                <li>
                                                                    <div className="SRRadio">
                                                                        <input name="question1[]" id="question6[No Rush, wait best candidate]" type="radio"
                                                                            value="2" checked={selectedTabValue[7].indexOf("2") >= 0 ? true : false} onChange={this.needSomeoneQuickly} />
                                                                        <label htmlFor="question6[No Rush, wait best candidate]">Under No Rush, wait for best candidate</label>
                                                                    </div>
                                                                </li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="button" name="next" className="next action-button" value="Next" onClick={() => this.setActiveTab("12")} disabled={disabledPageNew[7]} id="react-tabs-12" />
                                            </div>
                                        </TabPanel>
                                        {/* close page 7 */}
                                        {/* page 8 */}
                                        <TabPanel>
                                            <div className="Client-form-step">
                                                <div className="Client-form-step-content">
                                                    <div className="Client-form-question">
                                                        <h2>Tell us something about you</h2>
                                                    </div>
                                                    <div className="Client-form-answer">
                                                        <div className="mt-3">
                                                            <div className="row">
                                                                {/* <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">First Name of the person</h4>
                                                                        <input type="text" name="personName" value={somthingAboutYou.personName} className="form-control" placeholder="Enter Person Name" onChange={this.somthingAboutYouHandler} required />
                                                                    </div>
                                                                </div> */}
                                                                 <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">First name of the person</h4>
                                                                        <input type="text" name="firstPersonName" value={somthingAboutYou.firstPersonName} className="form-control" placeholder="Enter  First Name Of the Person" onChange={this.somthingAboutYouHandler} required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Last name of the person</h4>
                                                                        <input type="text" name="lastPersonName" value={somthingAboutYou.lastPersonName} className="form-control" placeholder="Enter  Last Name Of the Person" onChange={this.somthingAboutYouHandler} required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Company Name</h4>
                                                                        <input type="text" name="companyName" value={somthingAboutYou.companyName} onChange={this.somthingAboutYouHandler} className="form-control" placeholder="Enter Company Name" required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Company Address</h4>
                                                                        <input type="text" name="companyAddress" value={somthingAboutYou.companyAddress} onChange={this.somthingAboutYouHandler} className="form-control" placeholder="Enter Company Address" required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Email Address</h4>
                                                                        <input type="text" name="email" value={somthingAboutYou.email} className="form-control" onChange={this.somthingAboutYouHandler} placeholder="Enter Email Address" required />
                                                                    </div>
                                                                </div>
                                                                <div className="col-md-6 form-info">
                                                                    <div className="form-group">
                                                                        <h4 className="heading-title-sm">Phone Number</h4>
                                                                        <input type="text" name="phoneNumber" value={somthingAboutYou.phoneNumber} onChange={this.somthingAboutYouHandler} className="form-control" placeholder="Enter Phone Number" />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <input type="button" name="previous" className="previous action-button" value="Previous" onClick={() => this.backButton()} />
                                                <input type="submit" color="primary" className="next action-button" value="submit" />
                                            </div>
                                        </TabPanel>
                                        {/* close page 8 */}
                                    </div>
                                </Tabs>
                            </form>
                        </div>
                    </section>
                </div>
            </>
        )
    }
}

export default HireVaPage;
