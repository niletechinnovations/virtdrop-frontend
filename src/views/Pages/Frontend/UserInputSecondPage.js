import React, { Component } from "react";
import { skillSet } from "../../../redux/actions/helpers";
import { connect } from "react-redux";
import {
  setLoading,
  selectIndustry,
  selectMannual,
  AddUserInput,
} from "../../../redux/actions/helpers";
import "./Enquiry.css";
import { motion } from "framer-motion";

class UserInputSecondPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: "",
      items:JSON.parse(localStorage.getItem('UserInput')) || [],
    };
  }

  handleFormSubmit = (e) => {
    e.preventDefault();
    let items = [...this.state.items];
    if(!this.state.items.includes((this.state.username))){
      if(this.state.username){
        items.push(this.state.username);
  
      }
      this.setState(
        {
          items,
          username: "",
        },
        () => {
          this.props.AddUserInput(this.state.items);
          localStorage.setItem('UserInput',JSON.stringify(this.state.items));
        }
      );
    }

    
  };

  handleInputChange = (e) => {
    this.setState({
      username: e.target.value,
    });
  };

  render() {
    return (
      <>
        <motion.div
          animate={{ x: 0, opacity: 0.9, scale: [1, 1.1, 1.1, 1, 1] }}
          initial={{ x: -1000, opacity: 0.1 }}
          transition={{ type: "spring", stiffness: 490, duration: 2 }}
          className="container"
        >
          <form className="from-group " onSubmit={this.handleFormSubmit}>
            <input
              placeholder="Enter Skill"
              value={this.state.username}
              type="text"
              onChange={this.handleInputChange}
            />
            <div className="Addcontainer">
              <button type="submit" className="btnAdd b1Add">
                  <b>ADD</b>
              </button>
            </div>

            {/* <button type="submit" className="  submitBtn btn btn-success"> */}
            {/* ADD
            </button> */}
          </form>
        </motion.div>
      </>
    );
  }
}

const mapStates = (state) => {
  const { enquiry } = state;
  return enquiry;
};

const actions = {
  AddUserInput,
};
const addUserInputCUstom = connect(mapStates, actions)(UserInputSecondPage);
export { addUserInputCUstom as UserInputSecondPage };

// export default UserInputSecondPage;
