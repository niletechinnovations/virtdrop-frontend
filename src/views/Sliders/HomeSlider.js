import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const HomeSlider = (props) => {
    
  return (
    
    <OwlCarousel id="Main-Slider" className="owl-theme" loop nav={false} lazyLoad items="1" dots={false} autoplay={true} >
      
      <div className="item">
        <img src="/images/slider1.jpg" alt="Slide 1" />
      </div>
      <div className="item">
        <img src="/images/slider1.jpg" alt="Slide 2" />
      </div>
      
    </OwlCarousel>
  
  );
}

export default HomeSlider;