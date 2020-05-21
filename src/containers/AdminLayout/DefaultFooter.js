import React, { Component } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {

    // eslint-disable-next-line
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span>Copyright  &copy; {(new Date().getFullYear())} TexQue. All Rights Reserved.</span>
        <span className="ml-auto">Powered by <a href="https://www.niletechnologies.com/" rel="noopener noreferrer" target="_blank">Nile Technologies</a>.</span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
