import React from 'react';
import {Link} from 'react-router-dom';

const frontEndFooter = () => {
  return (

    <footer className="footer">
      <div className="footer-contact">
        <div className="row">
              <div className="col-md-4">
                <div className="footer-contact-card">
                  <div className="footer-contact-icon">
                    <img src="/images/mail.svg" alt="" />
                  </div>
                  <div className="footer-contact-content">
                    <p>Eamil Address</p>
                    <h2><a href="mailto:support@virtdrop.com">support@virtdrop.com</a></h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="footer-contact-card">
                  <div className="footer-contact-icon">
                    <img src="/images/phone.svg" alt="phone" />
                  </div>
                  <div className="footer-contact-content">
                    <p>Phone Number</p>
                    <h2><a href="tel:+22140 006754">+22 140 006 754</a></h2>
                  </div>
                </div>
              </div>

              <div className="col-md-4">
                <div className="footer-contact-card">
                  <div className="footer-contact-icon">
                    <img src="/images/location.svg" alt="Location" />
                  </div>
                  <div className="footer-contact-content">
                    <p>Office Address</p>
                    <h2>576 Fifth Avenue,New York</h2>
                  </div>
                </div>
              </div>
            </div>
      </div>
      <div className="top-footer">
        <div className="container">
            
          <div className="row">
            <div className="col-md-3 col-lg-3 col-sm-12">
              <div className="footer-about-info">
                <h2>About VirtDrop</h2>
                <p>VirtDrop is a Virtual Assistant company registered in New York. We supply high-quality Virtual Assistant services to individual clients and major businesses alike. VirtDrop provides ongoing training and support for our Virtual Assistants, guaranteeing our client’s goals can always be achieved. VirtDrop began operations in 2019.</p>
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
                  <h4>Sign up for news, deals, and time-saving ideas regarding Virtual Assistants. We know your inbox is already overflowing so we won’t send you spam!</h4>
                  <form>
                    <div className="newsletter-group">
                      <input className="newsletter-input" type="text" name="" placeholder="Enter your email" />
                      <button className="btn-submit">Sign In</button>
                    </div>
                  </form>
                  <p>Looking for work? <a href="/be-a-virdrop-va">Apply here to become a Virtual Assistant</a></p>
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
                    <li><a href="/services"> Services</a></li>
                    <li><a href="/">Privacy Policy</a></li>
                    <li><a href="/">Terms of Service</a></li>
                    <li><a href="/">Sitemap</a></li>
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