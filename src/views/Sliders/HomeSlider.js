import React from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HomeSlider = (props) => {
    
  return (
    
    <OwlCarousel id="Main-Slider" className="owl-theme" loop nav={false} lazyLoad items="1" dots={false} autoplay={true} autoplayTimeout={20000} >
      {/* <div className="item">
        <div className="slider-item-info">
          <div className="slider-media">
            <img src="/images/slider1.jpg" alt="Slide 1" />
          </div>
          <div className="slider-content">
            <h2>Achieve optimal time management and better work-life balance with our amazing Virtual Assistants</h2>
            <Link className="explore-btn" to="/register">Find the Best Virtual Assistant Today</Link>
          </div>
        </div>
      </div> */}
      <div className="item">
        <div className="slider-item-info slider1">
          <div className="slider-media">
            <img src="/images/slider1.jpg" alt="Slide 1" />
          </div>
          <div className="slider-content">
            <h6 style={{color:'#ffffff'}}>Achieve optimal time management and better work-life balance with our amazing Virtual Assistants</h6>
            <Link className="explore-btn" to="/booking">Find the Best Virtual Assistant Today</Link>
          </div>
        </div>
      </div>

      <div className="item">
        <div className="slider-item-info slider2">
          <div className="slider-media">
            <img src="/images/slider2.jpg" alt="Slide 2" />
          </div>
          <div className="slider-content">
            <h2>Why VIRTDROP?</h2>
            <h6 style={{color:'#ffffff'}}>We help businesses become more efficient and productive, enabling them to more easily achieve their goals.</h6>
            <Link className="explore-btn" to="/booking">Find the Best Virtual Assistant Today</Link>
          </div>
        </div>
      </div>

      <div className="item">
        <div className="slider-item-info slider3">
          <div className="slider-media">
            <img src="/images/slider3.jpg" alt="Slide 3" />
          </div>
          <div className="slider-content">
            <h2>Services</h2>
            <ul style={{color:'#ffffff'}}>
              <li>Administrative/data entry tasks</li>
              <li>E-commerce related tasks</li>
              <li>Social media management</li>
              <li>Customer support</li>
              <li>Graphic designing</li>
              <li>Bookkeeping</li>
            </ul>
            {/* <Link className="explore-btn" to="/services">Click here for more services offered</Link> */}
            <li> <a className="explore-btn" href= "https://www.virtdrop.com/our-services/">Click here for more services offered</a></li>
          </div>
        </div>
      </div>
      <div className="item">
        <div className="slider-item-info slider4">
          <div className="slider-media">
            <img src="/images/slider4.jpg" alt="Slide 4" />
          </div>
          <div className="slider-content">
            <h2>PRICING</h2>
            <h6 style={{color:'#ffffff'}}>Our pricing is as straight forward and stream lined as everything else we offer.</h6>
            {/* <Link className="explore-btn" to="/booking">Request a Quote</Link> */}
            <a className="explore-btn" href="https://www.virtdrop.com/pricing/" >Request a Quote</a>
          </div>
        </div>
      </div>

      
      
    </OwlCarousel>
  
  );
}

export default HomeSlider;