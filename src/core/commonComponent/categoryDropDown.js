import React , { Component } from 'react';

class SetCategoryDropDownItem extends Component {
  
  constructor(props){
    super(props);
    this.state = {
    } 
  }  
  render() {
    const categoryInfo = this.props.categoryInfo;
  	return (<option value={categoryInfo.categoryId} >{categoryInfo.categoryName}</option>)   
  }
}
export default SetCategoryDropDownItem;