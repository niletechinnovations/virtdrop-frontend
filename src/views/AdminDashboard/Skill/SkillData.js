import React, { Component } from 'react';
import MUIDataTable from "mui-datatables";
class SkillData extends Component {
  
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
        label: 'Area Name',
        name: 'areaName',
      },
      {
        label: 'Skill Name',
        name: 'skillName',
      },
      
      // {
      //   label: 'Action',
      //   name: 'action',
      // },
    ];

    let rowsItem = [];    
    for(const [i, cat] of this.props.data.entries()){
      console.log("cattttttt", cat, i)
      let catInfo = {
        areaName:cat.areaName,
        skillName: cat.skillName,
        // profileName: cat.vADesignation[0].profileName,
        // skill_id:cat.vADesignation[i].id,
        // parentName:cat.parentName,
        // parentId:cat.parentId,
        // action: <p>
        //   <button className="btn-edit" disabled={this.state.buttonProcessing} onClick={() => this.editCategoryItem(i)} title="Edit Skill"><i className="fa fa-pencil"></i> </button>
        //   <a href="#!" className="btn-delete" disabled={this.state.buttonProcessing} onClick={() => { if(window.confirm('Are you sure you want to delete this record?')){ this.deleteCategoryItem(i) };}} ><i className="fa fa-trash" title="Delete Skill"></i></a></p>,       
      }
      // console.log("catInfoffff",catInfo)      
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
        title={" Area & Skill List"}
        data={rowsItem}
        columns={columns}
        options={options}
      />
    );
  }
}

export default SkillData;