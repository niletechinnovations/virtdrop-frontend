import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
class CategoryData extends Component {
  
  constructor(props){
    super(props);   
    this.state = {
      buttonProcessing: false,
      rowIndex: '',
      dataTableItem: []
    };
    
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }
  /* Edit Category Item */
  editCategoryItem(rowIndex){    
    this.props.editCategoryAction(rowIndex);
  }
  /*Delete Category*/
  deleteCategoryItem(rowIndex){    
    this.props.deleteCategoryAction(rowIndex);
  }
  
  render() {
    const columns = [
      {
        label: 'Name',
        name: 'name',
      },
      {
        label: 'Image',
        name: 'image',
      },
      {
        label: 'Status',
        name: 'status',
      },
      {
        label: 'Action',
        name: 'action',
      },
    ];

    let rowsItem = [];    
    for(const [i, cat] of this.props.data.entries()){
      let catInfo = {
        name: cat.categoryName,
        image: (cat.imagUrl!=='' ? <img src={cat.imagUrl} width="100" alt="" /> : '' ),
        status: cat.status ? "Active" : "Inactive" ,       
        action: <p><a href="#!" className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => 
          this.editCategoryItem(i)} title="Edit Cuisine"><i className="fa fa-pencil"></i> </a>
          <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => 
          this.deleteCategoryItem(i)} title="Delete Cuisine"><i className="fa fa-trash"></i></a></p>,       
      }      
      rowsItem.push(catInfo);
    }
    const options = {
      search: true,
      filter: false,
      searchOpen: false,
      print: false,
      download: false,
      responsive: 'stacked',
      selectableRows: 'none',
      textLabels: {
        body: {
          noMatch: this.props.dataTableLoadingStatus ? "Loading........" : "",
          toolTip: "Sort",
          columnHeaderTooltip: column => `Sort for ${column.label}`
        },
      },
      fixedHeaderOptions: { xAxis: false, yAxis: false }

    };
    
    return (
      <MUIDataTable
        title={"Cuisine List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default CategoryData;