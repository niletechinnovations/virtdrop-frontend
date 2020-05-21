import React, { Component } from 'react';
import  { Link } from 'react-router-dom';
import {
  TabContent, TabPane, NavItem, NavLink,
} from 'reactstrap';
import "./FoodTruckDetails.css";

class FoodTruckDetails extends Component {
  constructor(props) {
    super( props );

    this.state = {
      data: '',
      activeTab: '1',
      setActiveTab: '1'
    };
  }

  toggle = tab => {
    if(this.state.activeTab !== tab) this.setState({activeTab: tab, setActiveTab: tab});
  }

  render() {

    return (
      <div className="user-dashboard">
          <section className="truck-detailed-banner">
               <div className="text-center">
                  <img className="img-fluid cover" src="/images/bg-cover.jpg" alt="Truck" />
               </div>
               <div className="truck-detailed-header">
                  <div className="container-fluid">
                     <div className="row d-flex align-items-end">
                        <div className="col-md-8">
                           <div className="truck-detailed-header-left">
                              <img className="float-left" src="/images/t1.jpg" alt="Truck" />
                              <h2>DupChuk Food Truck</h2>
                              <p>2036 2ND AVE, NEW YORK, NY 10029 </p>
                           </div>
                        </div>
                        <div className="col-md-4">
                            <div className="truck-detailed-header-right text-right">
                               <div className="delivery-time">
                                  <i className="fa fa-clock-o"></i> 25–35 min
                               </div>
                               <div className="ratings-info">
                                  <span className="ratings-bg"><i className="fa fa-star" aria-hidden="true"></i> 3.1</span>
                                  23 Ratings
                               </div>
                            </div>
                         </div>
                     </div>
                  </div>
              </div>
          </section>


          <section className="tabs-header-section">
             <div className="container-fluid">
                <div className="row">
                   <div className="col-md-12">
                      <ul className="Nav tabs">
                          <NavItem>
                            <NavLink
                              className={ this.state.activeTab === '1' ? 'active': '' }
                              onClick={() => { this.toggle('1'); }}
                            >
                              Food Menu
                            </NavLink>
                          </NavItem>

                          <NavItem>
                            <NavLink
                              className={ this.state.activeTab === '2' ? 'active': '' }
                              onClick={() => { this.toggle('2'); }}
                            >
                               Truck Owner Info
                            </NavLink>
                          </NavItem>

                          <NavItem>
                            <NavLink
                              className={ this.state.activeTab === '3' ? 'active': '' }
                              onClick={() => { this.toggle('3'); }}
                            >
                               Ratings &amp; Reviews
                            </NavLink>
                          </NavItem>
                      </ul>
                   </div>
                </div>
             </div>
          </section>


          <section className="tabs-content-body">
             <div className="">
                <div className="row">
                   <div className="col-md-12">
                      <div className="tabs-content-body-left">
                        <TabContent activeTab={this.state.activeTab}>
                          <TabPane tabId="1">
                            <div className="tabs-content-list">
                              <div className="row">
                                <div className="col-md-6">
                                  <div className="tabs-content-item mb-4">
                                    <h4>Quick Bites <small>3 ITEMS</small></h4>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="bg-white rounded shadow-sm mb-4">
                                          <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Chicken Tikka Sub</h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese corn Roll <span className="badge badge-success">Pure Veg</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese Spinach corn Roll <span className="badge badge-danger">Non Veg</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="tabs-content-item mb-4">
                                    <h4>Quick Bites <small>3 ITEMS</small></h4>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="bg-white rounded shadow-sm mb-4">
                                          <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Chicken Tikka Sub</h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                          <div className="menu-item p-3 border-bottom">
                                            <div className="menu-item-text">
                                              <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                              <div className="media-body">
                                                 <h6>Cheese corn Roll <span className="badge badge-success">Pure Veg</span></h6>
                                                 <p>$314 - 12" (30 cm)</p>
                                              </div>
                                            </div>
                                          </div>

                                          <div className="menu-item p-3 border-bottom">
                                            <div className="menu-item-text">
                                              <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                              <div className="media-body">
                                                 <h6>Cheese Spinach corn Roll <span className="badge badge-danger">BESTSELLER</span></h6>
                                                 <p>$314 - 12" (30 cm)</p>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="tabs-content-item mb-4">
                                    <h4>Quick Bites <small>3 ITEMS</small></h4>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="bg-white rounded shadow-sm mb-4">
                                          <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Chicken Tikka Sub</h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese corn Roll <span className="badge badge-success">Pure Veg</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese Spinach corn Roll <span className="badge badge-danger">BESTSELLER</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <div className="tabs-content-item mb-4">
                                    <h4>Quick Bites <small>3 ITEMS</small></h4>
                                    <div className="row">
                                      <div className="col-md-12">
                                        <div className="bg-white rounded shadow-sm mb-4">
                                          <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Chicken Tikka Sub</h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese corn Roll <span className="badge badge-success">Pure Veg</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>

                                           <div className="menu-item p-3 border-bottom">
                                             <div className="menu-item-text">
                                                <div className="mr-3"><i className="fa fa-stop-circle-o" aria-hidden="true"></i></div>
                                                <div className="media-body">
                                                   <h6>Cheese Spinach corn Roll <span className="badge badge-danger">BESTSELLER</span></h6>
                                                   <p>$314 - 12" (30 cm)</p>
                                                </div>
                                             </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </TabPane>

                          <TabPane tabId="2">
                            <div className="truck-info bg-white rounded shadow-sm p-4 mb-4">
                                  <div className="address-map float-right ml-5">
                                     <div className="mapouter">
                                        <div className="gmap_canvas">
                                          <img src="/images/google_maps.jpg" alt="Map" />
                                        </div>
                                     </div>
                                  </div>
                                  <h3>Owner Info</h3>
                                  <p className="mb-2 text-black"><i className="fa fa-phone mr-2"></i> +91 01234-56789, +91 01234-56789</p>
                                  <p className="mb-2 text-black"><i className="fa fa-envelope mr-2"></i> iamosahan@gmail.com, osahaneat@gmail.com</p>
                                  <p className="mb-2 text-black"><i className="fa fa-clock-o mr-2"></i> Today  11am – 5pm, 6pm – 11pm
                                  <span className="badge badge-success"> OPEN NOW </span>
                                  </p>
                                 
                                  <hr className="clearfix"></hr>
                                  <h3 className="mt-4 mb-4">About Us</h3>
                                  <p className="mb-3">Dal Makhani, Panneer Butter Masala, Kadhai Paneer, Raita, Veg Thali, Laccha Paratha, Butter Naan</p>
                               </div>
                          </TabPane>

                          <TabPane tabId="3">
                               <div className="reviews-info">
                                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                                     <h3>Ratings</h3>
                                     <div className="star-rating-card">
                                        <div className="star-rating">
                                           <a href="#!"><i className="fa fa-star active"></i></a>
                                           <a href="#!"><i className="fa fa-star active"></i></a>
                                           <a href="#!"><i className="fa fa-star active"></i></a>
                                           <a href="#!"><i className="fa fa-star"></i></a>  
                                           <b className="text-black ml-2">334</b>
                                        </div>
                                        <p className="text-black mb-4 mt-2">Rated 3.5 out of 5</p>
                                     </div>
                                     <div className="graph-star-rating-body">

                                        <div className="rating-list">
                                           <div className="rating-list-left">
                                              5 Star
                                           </div>
                                           <div className="rating-list-center">
                                              <div className="progress">
                                                 <div style={{width:"56%"}} className="progress-bar bg-color">
                                                    <span className="sr-only">80% Complete (danger)</span>
                                                 </div>
                                              </div>
                                           </div>
                                           <div className="rating-list-right">56%</div>
                                        </div>

                                        <div className="rating-list">
                                           <div className="rating-list-left">
                                              4 Star
                                           </div>
                                           <div className="rating-list-center">
                                              <div className="progress">
                                                 <div style={{width:"23%"}}  className="progress-bar bg-color">
                                                    <span className="sr-only">80% Complete (danger)</span>
                                                 </div>
                                              </div>
                                           </div>
                                           <div className="rating-list-right">23%</div>
                                        </div>

                                        <div className="rating-list">
                                           <div className="rating-list-left">
                                              3 Star
                                           </div>
                                           <div className="rating-list-center">
                                              <div className="progress">
                                                 <div style={{width:"11%"}}  className="progress-bar bg-color">
                                                    <span className="sr-only">80% Complete (danger)</span>
                                                 </div>
                                              </div>
                                           </div>
                                           <div className="rating-list-right">11%</div>
                                        </div>

                                        <div className="rating-list">
                                           <div className="rating-list-left">
                                              2 Star
                                           </div>
                                           <div className="rating-list-center">
                                              <div className="progress">
                                                 <div style={{width:"2%"}} className="progress-bar bg-color">
                                                    <span className="sr-only">80% Complete (danger)</span>
                                                 </div>
                                              </div>
                                           </div>
                                           <div className="rating-list-right">02%</div>
                                        </div>

                                     </div>
                                  </div>
                               </div>

                               <div className="reviews-info">
                                  <div className="bg-white rounded shadow-sm p-4 mb-4">
                                     <div className="ratings-reviews-list">
                                        <h3>Reviews</h3>
                                        <div className="ratings-reviews-item pt-4 pb-4 border-bottom">
                                           <div className="ratings-reviews-media">
                                              <Link to="/user/"><img src="images/user.png" className="mr-3" alt="User" /></Link>
                                              <div className="ratings-reviews-body">
                                                 <div className="ratings-reviews-info">
                                                    <span className="star-rating float-right">
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star"></i></a>
                                                    </span>
                                                    <h6><Link to="/user/">Singh Osahan</Link></h6>
                                                    <p className="text-gray">Tue, 20 Mar 2020</p>
                                                 </div>
                                                 <div className="ratings-reviews-content">
                                                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections </p>
                                                 </div>
                                              </div>
                                           </div>
                                        </div>
                                        <div className="ratings-reviews-item pt-4 pb-4 border-bottom">
                                           <div className="ratings-reviews-media">
                                             <Link to="/user/"><img src="images/user.png" alt="User" className="mr-3" /></Link>
                                              <div className="ratings-reviews-body">
                                                 <div className="ratings-reviews-info">
                                                    <span className="star-rating float-right">
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star active"></i></a>
                                                    <a href="#!"><i className="fa fa-star"></i></a>
                                                    </span>
                                                    <h6><a href="#!">Singh Osahan</a></h6>
                                                    <p className="text-gray">Tue, 20 Mar 2020</p>
                                                 </div>
                                                 <div className="ratings-reviews-content">
                                                    <p>Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical Latin literature from 45 BC, making it over 2000 years old. Richard McClintock, a Latin professor at Hampden-Sydney College in Virginia, looked up one of the more obscure Latin words, consectetur, from a Lorem Ipsum passage, and going through the cites of the word in classical literature, discovered the undoubtable source. Lorem Ipsum comes from sections </p>
                                                 </div>
                                              </div>
                                           </div>
                                        </div>
                                     </div>
                                  </div>
                               </div>
                          </TabPane>
                        </TabContent>
                      </div>
                   </div>
                </div>
             </div>
          </section>

        
       
      </div>
    );
  }
}

export default FoodTruckDetails;
