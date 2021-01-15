import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import commonService from '../../../../core/services/commonService';
import Loader from '../../../Loader/Loader';

class VAMemberList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            getAuth:'',
            buttonProcessing: false,
            rowIndex: '',
            dataTableItem: [],
            checkAll: false,
            checkedItems: [],
            authUsersList: [],
            // vaList: [0],
            roww: []
        };
        this.handleChange = this.handleChange.bind(this);
        this.getAlreadyAssignedVA = this.getAlreadyAssignedVA.bind(this);
        // this.setState({vaRequestId1:this.props.vaRequestId})
    }

    handleChange = (index, e) => {

        // new
        // let fields = this.state.fields;
        //   fields[field] = e.target.value;
        //   this.setState({fields});
        console.log("INDEX", index)
        console.log("e.target.value;", e.target.value)
        // e.preventDefault();
        let checkedItems = this.state.checkedItems;
        let checkAll = this.state.checkAll;
        if (index === "All") {
            checkAll = e.target.checked;
            checkedItems = checkAll ? this.props.data.map((info, i) => { return info.authId; }) : [];
        }
        // create new
        // else if (e.target.checked === false) {
        // console.log('HHH', this.state.checkedItems, index)
        // checkedItems.splice(checkedItems.indexOf(index), 1);
        // this.setState({ checked: !this.state.checkedItems });
        // }

        else {
            if (e.target.checked && checkedItems.indexOf(index) < 0) {
                checkedItems.push(index);
            } else if (!e.target.checked)
                checkedItems.splice(checkedItems.indexOf(index), 1);
        }

        this.setState({ checkedItems: checkedItems, checkAll: checkAll });

    };

    assignUser = () => {
        let authIds = this.state.checkedItems;
        if (authIds.length === 0) {
            toast.error('Please select at least one VA User');
            return;
        }
        const formData = {
            "vaRequestId": this.props.vaRequestId,
            "clientId": this.props.clientId,
            "authIds": authIds,
        };
        console.log("FORM data:", formData)

        this.setState({ loading: true }, () => {
            commonService.postAPIWithAccessToken(`va-assignment`, formData)
                .then(res => {
                    //console.log(res); return;
                    if (undefined === res.data || !res.data.status) {
                        this.setState({ loading: false });
                        toast.error(res.data.message);
                        return;
                    }
                    //this.props.history.push('/admin/va-request/');
                    this.setState({ loading: false });
                    toast.success(res.data.message);
                    window.scrollTo(0, 0);
                })
                .catch(err => {
                    toast.error(err.message);
                    this.setState({ loading: false });
                })
        })

    }

   
    getAlreadyAssignedVA = () => {
      
        commonService.getAPIWithAccessToken(`va-assignment/clients-va/?clientId=5feb3f544b15e3d9fe3ad50c`)
            .then((res) => {
                // console.log("res>>>", res)
                if (undefined === res.data || !res.data.status) {
                    this.setState({ loading: false });
                    toast.error(res.data.message)
                }
                var checkedApi = [];
                if (res.data.data.requestList) {
                    for (var i = 0; i < res.data.data.requestList.length; i++) {
                        checkedApi.push(res.data.data.requestList[i].authId);
                    }
                }

                this.setState({ loading: false, vaList: res.data.data.requestList, authUsersList: res.data.data.clientProfile, checkedItems: checkedApi });

                this.setState({ loading: false });
                //   toast.success(res.data.message);
                window.scrollTo(0, 0);

            })
            .catch(err => {
                // toast.error(err.message);
                // this.setState( { loading: false} );
                if (err.response !== undefined && err.response.status === 401) {
                    localStorage.clear();
                    this.props.history.push('/login');
                } else {
                    this.setState({ loading: false });
                }
            })

    }
       
    componentDidMount() {
        
        this.getAlreadyAssignedVA()
    }

    render() {
        
        const { loading, authUsersList } = this.state;
        let loaderElement = '';
        if (loading)
            loaderElement = <Loader />
           
        let rowsItem = [];        
        for (const [i, userData] of this.props.data.entries()) {
            let userInfo = {
                SNo: i,
                authId: userData.authId,
                userName: userData.firstName + ' ' + userData.lastName,
                email: userData.email,
                skillSet: userData.skillSet,
            }
            rowsItem.push(userInfo);
        }
       
        let list = rowsItem.map((user, index) => {

            return (
                <tr key={user.SNo}>
                    {authUsersList.includes(this.props.clientId) ? <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={(this.state.checkedItems.indexOf(user.authId) > -1) ? true : false} /></td> : <td><input type="checkbox" onChange={(e) => { this.handleChange(user.authId, e) }} checked={this.state.checkedItems.indexOf(user.authId) > -1 ? true : false} /></td>}
                    <td>{user.SNo + 1}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>{user.skillSet}</td>
                </tr>)

          

        });

        return (

            <>
                {loaderElement}
                <div className="table-responsive card-table">
                    <table>
                        <thead>
                            <tr>
                                <th><input type="checkbox" name="checkAll" checked={this.state.checkAll} onChange={(e) => { this.handleChange("All", e) }} /></th>
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
                <button className="btn btn-success" onClick={() => this.assignUser()}>Assign</button>
                </div>
            </>
        );

    }
}

export default VAMemberList;