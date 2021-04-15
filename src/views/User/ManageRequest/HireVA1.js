import React, { Component } from 'react';
import { Button, FormGroup, Form, Input, Label, Card, CardHeader, Row, Col, CardBody } from 'reactstrap';
import './HireVA1.css'
// import { HiUser } from "react-icons/hi";
import $ from 'jquery';
import 'jquery-easing';
import commonService from '../../../core/services/commonService';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import industryList1 from './industryAreaList.json'
import TimeRangeSlider from 'react-time-range-slider';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';

class HireVA1 extends Component {
    constructor(params) {
        super(params)
        this.state = {
            selectedArea: [],
            IndustryList1: [],
            industryGet: [],
            timer: {
                start: "00:00",
                end: "23:59"
            },
            tabIndex:0,
            Administrative:'Administrative',
            industryBelong:{advertising:"10", accounting:"9"}

            // items: { parentId: '', parentName: '', VaDesignation: [] }
        }
        this.inputHandler = this.inputHandler.bind(this);
        this.featureRef = React.createRef();
        this.changeStartHandler = this.changeStartHandler.bind(this);
        this.timeChangeHandler = this.timeChangeHandler.bind(this);
        this.changeCompleteHandler = this.changeCompleteHandler.bind(this);
    }


    changeStartHandler(time) {
        console.log("Start Handler Called", time);
    }

    timeChangeHandler(time) {
        this.setState({
            time: time
        });
    }

    changeCompleteHandler(time) {
        console.log("Complete Handler Called", time);
    }

    industryBelongHnadler(event) {
        console.log("Called Industry", event.target)
    }
    inputHandler(event) {
        console.log("event------------->",event.target.checked)
      
        var addValue = this.state.selectedArea;
        // console.log("event", event.target.value)
        const value = event.target.value;
        const name = event.target.name;
        let list = []
        const item = this.state.item
        list = this.state.industryGet;
        list = list[value];
        console.log("LIst===========",list)
   
        if (event.target.checked == true) {
            addValue.push(list);
        } else {
            console.log("0value", value);
            addValue.filter((data, index) => {
                if (data.parentId == list.parentId) {
                    addValue.splice(index); 
                }
            });
        }

        this.setState({ selectedArea: addValue })
    }


    componentDidMount() {

        // this.getIndustryList()
        this.setState({ industryGet: industryList1.industryArea[0] })





        //     $( document ).ready(function() {
        //         $("#ranged-value1").freshslider({
        //             range: true,
        //             step:1,
        //             min: 1,
        //             max: 24,
        //             value:[6, 11],
        //             onchange:function(low, high){
        //                 console.log(low, high);
        //             }
        //         });

        // });

        // $( document ).ready(function() {
        //     $('#Main-Slider').owlCarousel({
        //     loop:true,
        //     margin:10,
        //     nav:false,
        //     dots:false,
        //     items:1

        // });

        // });

        // $( document ).ready(function() {
        //     var $CategoryList = $('.filter-Category-list');
        //     $CategoryList.on('show.bs.collapse','.collapse', function() {
        //         $CategoryList.find('.collapse.show').collapse('hide');
        //     });
        // });


        //         ;( function ( document, window, index )
        // {
        // 	var inputs = document.querySelectorAll( '.inputfile' );
        // 	Array.prototype.forEach.call( inputs, function( input )
        // 	{
        // 		var label	 = input.nextElementSibling,
        // 			labelVal = label.innerHTML;

        // 		input.addEventListener( 'change', function( e )
        // 		{
        // 			var fileName = '';
        // 			if( this.files && this.files.length > 1 )
        // 				fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
        // 			else
        // 				fileName = e.target.value.split( '\\' ).pop();

        // 			if( fileName )
        // 				label.querySelector( 'span' ).innerHTML = fileName;
        // 			else
        // 				label.innerHTML = labelVal;
        // 		});

        // 		// Firefox bug fix
        // 		input.addEventListener( 'focus', function(){ input.classList.add( 'has-focus' ); });
        // 		input.addEventListener( 'blur', function(){ input.classList.remove( 'has-focus' ); });
        // 	});
        // }( document, window, 0 ));


        try {
            var current_fs, next_fs, previous_fs; //fieldsets
            var left, opacity, scale; //fieldset properties which we will animate
            var animating; //flag to prevent quick multi-click glitches

            $(".next").click(function () {
                if (animating) return false;
                animating = true;

                current_fs = $(this).parent();
                next_fs = $(this).parent().next();

                //activate next step on progressbar using the index of next_fs
                $("#progressbar li").eq($(".Client-form-step").index(next_fs)).addClass("active");

                //show the next fieldset
                next_fs.show();
                //hide the current fieldset with style
                current_fs.animate(
                    { opacity: 0 },
                    {
                        step: function (now, mx) {
                            //as the opacity of current_fs reduces to 0 - stored in "now"
                            //1. scale current_fs down to 80%
                            scale = 1 - (1 - now) * 0.2;
                            //2. bring next_fs from the right(50%)
                            left = now * 50 + "%";
                            //3. increase opacity of next_fs to 1 as it moves in
                            opacity = 1 - now;
                            current_fs.css({
                                transform: "scale(" + scale + ")",
                                position: "absolute"
                            });
                            next_fs.css({ left: left, opacity: opacity });
                        },
                        duration: 800,
                        complete: function () {
                            current_fs.hide();
                            animating = false;
                        },
                        //this comes from the custom easing plugin
                        easing: "easeInOutBack"
                    }
                );
            });

            $(".previous").click(function () {
                if (animating) return false;
                animating = true;

                current_fs = $(this).parent();
                previous_fs = $(this).parent().prev();

                //de-activate current step on progressbar
                $("#progressbar li")
                    .eq($(".Client-form-step").index(current_fs))
                    .removeClass("active");

                //show the previous fieldset
                previous_fs.show();
                //hide the current fieldset with style
                current_fs.animate(
                    { opacity: 0 },
                    {
                        step: function (now, mx) {
                            //as the opacity of current_fs reduces to 0 - stored in "now"
                            //1. scale previous_fs from 80% to 100%
                            scale = 0.8 + (1 - now) * 0.2;
                            //2. take current_fs to the right(50%) - from 0%
                            left = (1 - now) * 50 + "%";
                            //3. increase opacity of previous_fs to 1 as it moves in
                            opacity = 1 - now;
                            current_fs.css({ left: left });
                            previous_fs.css({
                                transform: "scale(" + scale + ")",
                                opacity: opacity
                            });
                        },
                        duration: 800,
                        complete: function () {
                            current_fs.hide();
                            animating = false;
                        },
                        //this comes from the custom easing plugin
                        easing: "easeInOutBack"
                    }
                );
            });

            $(".submit").click(function () {
                return false;
            });


        } catch (error) {

        }
    }

    render() {
        const { loading, selectedArea, industryGet, item, tabIndex, Administrative,industryBelong } = this.state;
        console.log("industryGet", Administrative)

        return (

            <div className="dashboard-section container" style={{ paddingRight: '230px' }}>
                <Card className="client-body">
                    <CardHeader className="">
                        <div className="bottom-header">
                            <div className="container">
                                <div className="logo text-center">
                                    {/* <a href="#"><img src="images/logo.png" height="60" /></a> */}
                                </div>
                            </div>
                        </div>
                    </CardHeader>

                    <section className="Client-form-section">
                        <div className="container">
                            <form id="msform">
                                {/* <!-- progressbar --> */}
                                {/* <ul id="progressbar">
                                    <li className="active"></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                    <li></li>
                                </ul> */}
                               
                                 <Tabs selectedIndex={tabIndex} onSelect={index => this.setState({tabIndex: index})} >
    <TabList>
      <Tab>1</Tab>
      <Tab>2</Tab>
      <Tab>3</Tab>
      <Tab>4</Tab>
      <Tab>5</Tab>
      <Tab>6</Tab>
      <Tab>7</Tab>
      <Tab>8</Tab>
    </TabList>
                             
                                <div className="Client-form-body">
                                <TabPanel >
                                    <div className="Client-form-step">
                                        <div className="Client-form-step-content">
                                            <div className="Client-form-question">
                                                <h2>How may VA's you need?</h2>
                                            </div>
                                            <div className="Client-form-answer">
                                                <div className="form-radio-group">
                                                    <h4 className="heading-title-sm">How many VA do you need?</h4>
                                                    <div class=""></div>
                                                    <ul class="filter-field-list1 text-left">
                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="one-person" type="radio" value="" />
                                                                <label for="one-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">1</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="two-person" type="radio" value="" />
                                                                <label for="two-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">2</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="three-person" type="radio" value="" />
                                                                <label for="three-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">3</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="four-person" type="radio" value="" />
                                                                <label for="four-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">4</span>
                                                                </label>
                                                            </div>
                                                        </li>
                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="five-person" type="radio" value="" />
                                                                <label for="five-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">5</span>
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="six-person" type="radio" value="" />
                                                                <label for="six-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">6</span>
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="seven-person" type="radio" value="" />
                                                                <label for="seven-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">7</span>
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="eight-person" type="radio" value="" />
                                                                <label for="eight-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">8</span>
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="nine-person" type="radio" value="" />
                                                                <label for="nine-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">9</span>
                                                                </label>
                                                            </div>
                                                        </li>

                                                        <li style={{ "width": "19%" }}>
                                                            <div class="SRRadio-3">
                                                                <input name="question6[]" id="ten-person" type="radio" value="" />
                                                                <label for="ten-person">
                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                    <a href="#"><img src="/images/one-person.svg" height="60" /></a>
                                                                    <span class="SRRadio-value-text">10</span>
                                                                </label>
                                                            </div>
                                                        </li>


                                                    </ul>
                                                </div>
                                            </div>
                                            <div class="mt-3">
                                                <div class="row">
                                                    <div class="col-md-12 form-info">
                                                        <div class="form-group">
                                                            <h4 class="heading-title-sm">Need More?</h4>
                                                            <input type="text" name="fname" class="form-control" placeholder="Type" />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>

                                    {/* 2 page */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Which industry you belong?</h2>
                                            </div>

                                            <div class="Client-form-answer">
                                                <div class="form-input-group">
                                                    <ul class="filter-field-list">
                                                        <li>
                                                            <label htmlFor="10">
                                                                <input id ="10" type="checkbox" value={industryBelong.advertising} name="10" onChange= {this.industryBelongHnadler}/>
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/advertising_iconn.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Advertising
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="9" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/accounting_finance.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Accounting / Finance
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/apparel.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Apparel
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/constructionArchEng.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Construction / Architecture / Engineering
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/design_icon.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Designs
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/entertainment.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Entertainment
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/education_icon.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Education
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>


                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/healthcare.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Healthcare / Medical
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/hospitality.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Hospitality / Catering
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/legal.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Legal / Consulting
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>


                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/logistics.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        ALogistics & Transportpparel
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>


                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/management.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Management
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/manufacturing.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Manufacturing
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/retail.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Retail
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/realstate.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Real Estate
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/telecommunication.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Telecommunication
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/travel.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Travel, Leisure & Tourism
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label>
                                                                <input type="checkbox" value="10" name="Skills[]" />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/ecommerce.svg" height="60" /></a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        ECommerce
                                                                    </div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                    </ul>
                                                </div>
                                                <div class="mt-1">
                                                    <div class="row">
                                                        <div class="col-md-12 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Others</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Type" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>

                                    {/* Close page 2 */}

                                    {/* page 3 */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Area where you need help</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="form-radio-group">
                                                    <ul class="filter-field-list text-left">
                                                        <li>
                                                            <label htmlFor="Administrative">
                                                                <input type="checkbox" id="Administrative" value={Administrative} name={"Administrative"} onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/adminstrative.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Administrative tasks/ Data Entry
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label htmlFor="2">
                                                                <input type="checkbox" id="2" value="2" name="2" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/executive.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Executive Assistants
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                        <li>
                                                            <label htmlFor="3">
                                                                <input type="checkbox" id="3" value="3" name="3" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/ecommarce_related_task.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        ECommerce related tasks
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="4">
                                                                <input type="checkbox" type="checkbox" id="4" value="4" name="4" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/adminstrative.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Customer Support Service
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="5">
                                                                <input type="checkbox" id="5" value="5" name="5" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/graphic_design.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Graphic Designing/ Video Editing
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="6">
                                                                <input type="checkbox" id="6" value="6" name="6" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/marketing_icon.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Marketing
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="7">
                                                                <input type="checkbox" id="7" value="7" name="7" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/icons/accounting_BookKeeping.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Accounting/Bookkeeping
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="8">
                                                                <input type="checkbox" id="8" value="8" name="8" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/icons/cold_calling.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Cold Calling
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>

                                                        <li>
                                                            <label htmlFor="9">
                                                                <input type="checkbox" id="9" value="9" name="9" onChange={this.inputHandler} />
                                                                <div class="ar-field-list-option-1">
                                                                    <div class="field-svg-icon">
                                                                        <a href="#"><img src="/images/icons/programming_development.svg" height="60" /> </a>
                                                                    </div>
                                                                    <div class="field-value-text">
                                                                        Programming and Development
                                                                   	</div>
                                                                </div>
                                                            </label>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 3 */}
                                    {/* page 4  */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Skills Freelancers Need</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="filter-content">
                                                    <div class="filter-Category-list">
                                                        {

                                                            selectedArea.map((e, index) => {
                                                        //    console.log("eeeeeeeeeeeeeeeee",e)
                                                                return (<div id={index} class="filter-Category-item-info">

                                                                    <h2>{e.parentName}</h2>

                                                                    <div class="filter-Category-item-body">
                                                                        <ul>
                                                                            {e.VaDesignation.map((va, i) => {
                                                                                return (<li id={i}>
                                                                                    <div class="filterCheckbox">
                                                                                        <input type="checkbox" name={va.id} id={va.id} value={va.id} onChange={this.inputHandler} />
                                                                                        <label htmlfor={va.id}>{va.profileName}</label>
                                                                                    </div>
                                                                                </li>)
                                                                            })}

                                                                        </ul>
                                                                    </div>
                                                                </div>)

                                                            })
                                                        }
                                                        {/* <div class="filter-Category-item-info">

                                                            <h2>Amazon</h2>

                                                            <div class="filter-Category-item-body">
                                                                <ul>

                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="Amazon[]" id="Amazon Consultant" type="checkbox" value="" />
                                                                            <label for="Amazon Consultant">Amazon Consultant</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="Amazon[]" id="Amazon Selling Metrics" type="checkbox" value="" />
                                                                            <label for="Amazon Selling Metrics">Amazon Selling Metrics</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="Amazon[]" id="Amazon Merch" type="checkbox" value="" />
                                                                            <label for="Amazon Merch">Amazon Merch</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="Amazon[]" id="Amazon PPC Specialist" type="checkbox" value="" />
                                                                            <label for="Amazon PPC Specialist">Amazon PPC Specialist</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div> */}
                                                        {/* <div class="filter-Category-item-info">
                                                            <h2>Development & IT</h2>
                                                            <div class="filter-Category-item-body">
                                                                <ul>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="DevelopmentIT[]" id="Web & Mobile App Developer" type="checkbox" value="" />
                                                                            <label for="Web & Mobile App Developer">Web & Mobile App Developer</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="DevelopmentIT[]" id="WordPress Development" type="checkbox" value="" />
                                                                            <label for="WordPress Development">WordPress Development</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="DevelopmentIT[]" id="Software Developer" type="checkbox" value="" />
                                                                            <label for="Software Developer">Software Developer</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="DevelopmentIT[]" id="Computer Programmer" type="checkbox" value="" />
                                                                            <label for="Computer Programmer">Computer Programmer</label>
                                                                        </div>
                                                                    </li>
                                                                    <li>
                                                                        <div class="filterCheckbox">
                                                                            <input name="DevelopmentIT[]" id="Database Programmer" type="checkbox" value="" />
                                                                            <label for="Database Programmer">Database Programmer</label>
                                                                        </div>
                                                                    </li>
                                                                </ul>
                                                            </div>
                                                        </div> */}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 4 */}
                                    {/* page 5 */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Give Specifications</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="form-radio-group">
                                                    <h4 class="heading-title-sm">Which days of the week?</h4>
                                                    <ul class="week-day-list">
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Sun" />
                                                                <label for="Sun">Sunday</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Mon" />
                                                                <label for="Mon">Monday</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Tue" />
                                                                <label for="Tue">Tuesday</label>                                                                      </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Wed" />
                                                                <label for="Wed">Wednesday</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Thu" />
                                                                <label for="Thu">Thursday</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="5" name="days[]" id="Fri" />
                                                                <label for="Fri">Friday</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="checkbox-box1">
                                                                <input type="checkbox" value="" name="days[]" id="Sat" />
                                                                <label for="Sat">Saturday</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                                <div class="form-radio-group mt-3">
                                                    <h4 class="heading-title-sm">How many hours a day?</h4>
                                                    <ul class="week-day-list">
                                                        <div data-role="page">
                                                            <div data-role="main" class="ui-content">
                                                                <form  >
                                                                {/* <input type="text" value={this.state.timer.start} onChange={this.timeChangeHandler} name="timer" id="time" /> */}
                                                                    <TimeRangeSlider
                                                                        disabled={false}
                                                                        format={24}
                                                                        maxValue={"23:59"}
                                                                        minValue={"00:00"}
                                                                        name={"time_range"}
                                                                        onChangeStart={this.changeStartHandler}
                                                                        onChangeComplete={this.changeCompleteHandler}
                                                                        onChange={this.timeChangeHandler}
                                                                        step={15}
                                                                        value={this.state.timer}
                                                                        orientation={String}
                                                                    />
                                                                    <div class="filter-Price-info">
                                                                        <div class="filter-content">
                                                                            <div id="ranged-value1"></div>
                                                                        </div>
                                                                    </div>
                                                                </form>
                                                            </div>
                                                        </div>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 5 */}
                                    {/* page 6 */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Choose Your Plan</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="form-radio-group">
                                                    <div class="">
                                                        <div class="row">
                                                            <div class="col-xs-12 col-md-4">
                                                                <div class="panel panel-primary">
                                                                    <div class="panel-heading">
                                                                        <h5 class="panel-title p-0 mt-2">Standard</h5>
                                                                    </div>
                                                                    <div class="panel-body">
                                                                        <div class="the-price">
                                                                            <h1>
                                                                                $12
																																																																																<span class="subscript">/mo</span>
                                                                            </h1>
                                                                            <small>1 month FREE trial</small>
                                                                        </div>
                                                                        <table class="table">
                                                                            <tr>
                                                                                <td>
                                                                                    1 Account
										                            </td>
                                                                            </tr>
                                                                            <tr class="active">
                                                                                <td>
                                                                                    1 Project
										                            </td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                    <div class="panel-footer">
                                                                        <ul class="filter-field-list-1">
                                                                            <li>
                                                                                <label>
                                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                                    <div class="ar-field-list-option">
                                                                                        Select
						                                                </div>
                                                                                </label>
                                                                            </li>

                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-xs-12 col-md-4">
                                                                <div class="panel panel-success">
                                                                    <div class="cnrflash">
                                                                        <div class="cnrflash-inner">
                                                                            <span class="cnrflash-label">Best Deal</span>
                                                                        </div>
                                                                    </div>
                                                                    <div class="panel-heading">
                                                                        <h5 class="panel-title p-0 mt-2">Premium</h5>
                                                                    </div>
                                                                    <div class="panel-body">
                                                                        <div class="the-price">
                                                                            <h1>
                                                                                $15
																																																																																	<span class="subscript">/mo</span>
                                                                            </h1>
                                                                            <small>1 month FREE trial</small>
                                                                        </div>
                                                                        <table class="table">
                                                                            <tr>
                                                                                <td>
                                                                                    2 Account
										                            </td>
                                                                            </tr>
                                                                            <tr class="active">
                                                                                <td>
                                                                                    5 Project
										                            </td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                    <div class="panel-footer">
                                                                        <ul class="filter-field-list-1">
                                                                            <li>
                                                                                <label>
                                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                                    <div class="ar-field-list-option">
                                                                                        Select
						                                                </div>
                                                                                </label>
                                                                            </li>

                                                                        </ul>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                            <div class="col-xs-12 col-md-4">
                                                                <div class="panel panel-info">
                                                                    <div class="panel-heading">
                                                                        <h5 class="panel-title p-0 mt-2">Gold</h5>
                                                                    </div>
                                                                    <div class="panel-body">
                                                                        <div class="the-price">
                                                                            <h1>
                                                                                $20
																																																																																		<span class="subscript">/mo</span>
                                                                            </h1>
                                                                            <small>1 month FREE trial</small>
                                                                        </div>
                                                                        <table class="table">
                                                                            <tr>
                                                                                <td>
                                                                                    5 Account
										                            </td>
                                                                            </tr>
                                                                            <tr class="active">
                                                                                <td>
                                                                                    20 Project
										                            </td>
                                                                            </tr>
                                                                        </table>
                                                                    </div>
                                                                    <div class="panel-footer">
                                                                        <ul class="filter-field-list-1">
                                                                            <li>
                                                                                <label>
                                                                                    <input type="checkbox" value="10" name="Skills[]" />
                                                                                    <div class="ar-field-list-option">
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
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 6 */}
                                    {/* page 7 */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>How quickly do you need someone?</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="form-input-group">
                                                    <ul class="filter-Category-nav-list">
                                                        <li>
                                                            <div class="SRRadio">
                                                                <input name="question6[]" id="question6[Within 48 hours]" type="radio" value="" />
                                                                <label for="question6[Within 48 hours]">Within 48 hours</label>
                                                            </div>
                                                        </li>
                                                        <li>
                                                            <div class="SRRadio">
                                                                <input name="question6[]" id="question6[No Rush, wait for best candidate]" type="radio" value="" />
                                                                <label for="question6[No Rush, wait for best candidate]">Under No Rush, wait for best candidate  	</label>
                                                            </div>
                                                        </li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Next" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 7 */}
                                    {/* page 8 */}
                                    <TabPanel>
                                    <div class="Client-form-step">
                                        <div class="Client-form-step-content">
                                            <div class="Client-form-question">
                                                <h2>Tell us something about you</h2>
                                            </div>
                                            <div class="Client-form-answer">
                                                <div class="mt-3">
                                                    <div class="row">
                                                        <div class="col-md-6 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Name of the person</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Enter Person Name" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Company Name</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Enter Company Name" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-12 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Company Address</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Enter Company Address" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Email Address</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Enter Email Address" />
                                                            </div>
                                                        </div>
                                                        <div class="col-md-6 form-info">
                                                            <div class="form-group">
                                                                <h4 class="heading-title-sm">Phone Number</h4>
                                                                <input type="text" name="fname" class="form-control" placeholder="Enter Phone Number" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <input type="button" name="previous" class="previous action-button" value="Previous" />
                                        <input type="button" name="next" class="next action-button" value="Submit" />
                                    </div>
                                    </TabPanel>
                                    {/* close page 8 */}
                                </div>
                                </Tabs>
                            </form>
                        </div>
                    </section >
                </Card >
            </div >
        )
    }
}

export default HireVA1;
