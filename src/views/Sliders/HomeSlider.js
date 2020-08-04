import React from 'react';
import { Link } from 'react-router-dom';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HomeSlider = (props) => {
    
  return (
    
    <OwlCarousel id="Main-Slider" className="owl-theme" loop nav={false} lazyLoad items="1" dots={false} autoplay={true} >
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
            <Link className="explore-btn" to="/register">Find the Best Virtual Assistant Today</Link>
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
            <Link className="explore-btn" to="/register">Find the Best Virtual Assistant Today</Link>
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
              <li>Social Media Management</li>
              <li>Photo and Video Editing</li>
              <li>Web Design</li>
              <li>Management of filing systems and databases</li>
              <li>Management of diaries, including organizing appointments and meetings</li>
            </ul>
            <Link className="explore-btn" to="/services">Click here for more services offered</Link>
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
            <h6 style={{color:'#ffffff'}}>Our Virtual Assistants are available at a flat-rate of $12 per hour.</h6>
            <Link className="explore-btn" to="/register">Get Started Today!</Link>
          </div>
        </div>
      </div>

      
      
    </OwlCarousel>
  
  );
}

export default HomeSlider;