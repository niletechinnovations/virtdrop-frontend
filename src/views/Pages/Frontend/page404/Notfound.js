import React, { Component } from "react";
import './css/style.css';
import { motion } from "framer-motion";


class Notfound extends Component {
  render() {
    return (
      <>
        <motion.div id="notfound" >
          <div class="notfound">
            <div class="notfound-404">
              <div></div>
              <h1>Oops!</h1>
            </div>
            <h2> Select Industry or Skill On Previous Page!</h2>
          </div>
        </motion.div>
      </>
    );
  }
}

export default Notfound;
