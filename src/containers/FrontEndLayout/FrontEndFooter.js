import React from 'react';
import {Link} from 'react-router-dom';

const frontEndFooter = () => {
  return (

    <footer className="footer">
      <div className="top-footer">
        <div className="container">
          <div className="row">
            <div className="col-md-3 col-lg-3 col-sm-12">
              <div className="footer-about-info">
                <h2>About Company</h2>
                <p>VIRTDROP is a top virtual assistance company registered in New York with the aim to provide the needed high-quality virtual assistant services to every client.We began our operations with a client and a VA. On January 2019, the company began registration, building contracts and documents, and creating policies.</p>
              </div>
            </div>
            <div className="col-md-2 col-lg-2 col-sm-4">
              <div className="footer-link-info">
                <h2>Useful Links</h2>
                <ul className="footer-link-list">
                  <li><Link to="/about-us">About Us</Link></li>
                  <li><Link to="/blog">Blog</Link></li>
                  <li><Link to="/how-it-works">How it works</Link></li>
                  <li><Link to="/pricing-plan">Plan & Pricing</Link></li>
                  <li><Link to="/faq">FAQ's</Link></li>
                  <li><Link to="/contact-us">Contact Us</Link></li>
                </ul>
              </div>
            </div>
            <div className="col-md-3 col-sm-12 col-lg-3">
              <div className="footer-link-info">
                <h2>Subscribe</h2>
                <div className="newsletter-form">
                  <h4>Sign up for Virtual Assistants. We won’t give you spam mails</h4>
                  <form>
                    <div className="newsletter-group">
                      <input className="newsletter-input" type="text" name="" placeholder="Enter your email" />
                      <button className="btn-submit">Sign In</button>
                    </div>
                  </form>
                  <p>Looking for work? <a href="/">Apply as a virtual assistant here</a></p>
                </div>
              </div>
            </div>
            <div className="col-md-4 col-sm-4 col-lg-4">
              <div className="footer-info-images">
                <div className="footer-images-top">
                  <div className="images-ssl">	
                    <img src="/images/positivessl_trust_seal_lg_222x54.png" alt="SSL" />
                  </div>
                  <div className="images-satisfaction">
                    <img src="/images/satisfaction.png" height="90" alt="" />
                  </div>
                </div>
                <div className="images-paypal">
                  <img src="/images/logo-center-solution-graphics.png"  width="319" height="110" alt="" />
                </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bottom-footer">
          <div className="container">
            <div className="row">
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="footer-copyright">
                  <p>© VIRTDROP. All rights reserved. Powered By: <a href="http://niletechnologies.com/" target="_blank" rel="noopener noreferrer">Nile Technologies</a></p>
                </div>
              </div>
              <div className="col-md-6 col-sm-6 col-lg-6">
                <div className="footer-nav-list">
                  <ul>
                    <li><a href="/">Privacy Policy</a></li>
                    <li><a href="/">Terms of Service</a></li>
                    <li><a href="/">Sitemap</a></li>
                    <li><a href="/"> Why Us?</a></li>
                  </ul>                       
                </div>
              </div>
            </div>
          </div>
        </div>
    </footer>

  );
}

export default frontEndFooter;