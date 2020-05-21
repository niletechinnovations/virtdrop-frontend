import React from 'react';
import "./Loader.css"
const Loader = () => {
    return (
        <div className="loaderSection">
             <div className="spinner-border text-primary" role="status">
                  <span className="sr-only">Loading...</span>
              </div>
        </div>
    );
}

export default Loader;