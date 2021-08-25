import React, { Component } from "react";
import "./tabs.css";
import { Link } from "react-router-dom";

class Tabs extends Component {
  render() {
    const list = [{ tab: 1 }, { tab: 2 }, { tab: 3 }, { tab: 4 }, { tab: 5 }];
    return (
      <div className="App">
        <ul>
          {list.map((item, i) => {
            console.log(i);
            return <li onClick={() => this.SelectTab(item.tab)}>{item.tab}</li>;
          })}
        </ul>
      </div>
    );
  }
  SelectTab = (value) => {
    console.log("dffg",value);
  };
}

export default Tabs;
