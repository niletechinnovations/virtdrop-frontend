import React, { Component } from 'react';
import {Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';

class VAMemberList extends Component{
    constructor(props){
        super(props);   
        this.state = {
          buttonProcessing: false,
          rowIndex: '',
          dataTableItem: [],
          checkAll: false,
          checkedItems: []
        };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange = (index,e) => {
        let checkedItems = this.state.checkedItems;
        let checkAll = this.state.checkAll;
        if(index === "All") {
            checkAll = e.target.checked;
            checkedItems = checkAll ?  this.props.data.map( (info, i) =>{ return info.authId;}) : [];
        }else {
            if(e.target.checked && checkedItems.indexOf(index) < 0){
                checkedItems.push(index);
            }else if(!e.target.checked)
                checkedItems.splice(checkedItems.indexOf(index), 1);
        }
        this.setState({checkedItems: checkedItems, checkAll: checkAll});
      
      };

    assignUser = () => {
        let authIds = this.state.checkedItems;
        if(authIds.length === 0){
            toast.error('Please select at least one VA User');
            return;
        }
        const formData = {
            "vaRequestId": this.props.vaRequestId,
            "clientId": this.props.clientId,
            "authIds": authIds,
        };
        
        this.setState( { loading: true }, () => {
            commonService.postAPIWithAccessToken( `va-assignment`, formData )
             .then( res => {
                //console.log(res); return;
               if ( undefined === res.data || !res.data.status ) {
                 this.setState( { loading: false } );
                 toast.error(res.data.message);
                 return;
               }
               //this.props.history.push('/admin/va-request/');
               this.setState( { loading: false } );
               toast.success(res.data.message);
               window.scrollTo(0, 0);
             } )
             .catch( err => {
               toast.error(err.message);
               this.setState( { loading: false} );
             } )
        } )
        
    } 

    render(){
        const { loading } = this.state;
        let loaderElement = '';
        if(loading)        
          loaderElement = <Loader />
    
        let rowsItem = []; 
        for(const [i, userData] of this.props.data.entries()){
            let userInfo = {
                SNo:i,
                authId:userData.authId,
                userName: userData.firstName+' '+userData.lastName,
                email: userData.email,
                skillSet: userData.skillSet,
            }
            rowsItem.push(userInfo);
        }
        
        let list = rowsItem.map((user, index) =>{
            return (
                <tr key={user.SNo}>
                    <td><input type="checkbox"  onChange={(e) => {this.handleChange(user.authId, e)}} checked = {this.state.checkedItems.indexOf(user.authId) > -1  ? true : false} /></td>
                    <td>{user.SNo+1}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.skillSet}</td>
                </tr>
            );
        });

        return (
           
            <>           
            {loaderElement}
            <div className="table-responsive card-table">
                <table>
                    <thead>
                        <tr>
                            <th><input type="checkbox" name="checkAll" checked = {this.state.checkAll} onChange={(e) => {this.handleChange("All", e)}} /></th>
                            <th>S&nbsp;no.</th>
                            <th>User</th>
                            <th>Email</th>
                            <th>Skills</th>
                        </tr>
                    </thead>
                    <tbody>{list}</tbody>
                </table>
            </div>
            <div className="form-group mt-3">
                <Link className="btn btn-danger" to="/admin/va-request">Cancel</Link> &nbsp;
                <button className="btn btn-success" onClick={() => this.assignUser() }>Assign</button>
            </div>
            </>
        );

    }
}

export default VAMemberList;