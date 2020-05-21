import React  from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';

const OfferSlider = (props) => {

  const myLists = props.data;
  const listItems = myLists.map((value, index) =>  
    <div key={index} className="item">
      <div className="inner-item">
      <a href={ ( value.adLink!=='' ? value.adLink : "#!" ) } target={ ( value.adLink!=='' ? "_blank" : "_self" ) } >
        <img src={ ( value.adImage!=='' ? value.adImage : "/images/slider.png" ) } className="img-fluid rounded" alt="Advertisement" />
      </a>
      </div>
    </div>
  ); 

  if(listItems.length===0)
    return (<></>);
    
    return (
      <>
      <OwlCarousel className="owl-theme" loop nav items="1" dots="0" autoplay={true} autoplayTimeout="7000">
        {listItems}
      </OwlCarousel>
      </>
  );
}

export default OfferSlider;