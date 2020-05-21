import React from 'react';
import OwlCarousel from 'react-owl-carousel';
import 'owl.carousel/dist/assets/owl.carousel.css';
import 'owl.carousel/dist/assets/owl.theme.default.css';


const ProductSlider = (props) => {
  const myLists = props.data;
  const listItems = myLists.map((value, index) =>  
    
    <div  key={index} className="item">
      <div className="products-item-card">
        <div className="products-item-image">
          <a href="#!">
            <img src={ ( value.featuredImage!=='' ? value.featuredImage : "/images/dummy-food-truck-lg.png" ) } className="img-fluid item-img" alt={value.truckName}/>
          </a>
        </div>
        <div className="products-item-content">
          <h2><a href="#!">{value.truckName}</a></h2>
          <div className="products-rate">
            <i className="fa fa-star-o"></i> {value.rating}
          </div>
          <div className="location">{value.address}</div>
          {/* <p>{value.description}</p> */}
        </div>
      </div>
    </div>
    
  );  
  
  if(listItems.length===0)
    return (<></>);
    
    return (
      <>
      <OwlCarousel id="products-carousel" className="owl-theme" loop nav={true} lazyLoad  responsive={ {0:{items:1},200:{items:1},1000:{items:2},1200:{items:3}}}>
        {listItems}
      </OwlCarousel>
    </>
  );
}

export default ProductSlider;