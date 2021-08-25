import React from "react";
import { Link } from "react-router-dom";
import { Input, Button, Form } from "reactstrap";
import Loader from "../../views/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import commonService from "../../core/services/commonService";
import ebookFile from "../../assets/ebook/e-Book_VirtDROP.pdf";
import PricingPage from "../../views/Pages/Frontend/Pricing/PrcingPage";
// import './FrontEndHeader.css';
// import '../FrontEndLayout/FrontEndHeader.css';

class CommonFrontEndFooter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      newsletterName: "",
      newsletterEmail: "",
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitNewsletterForm = this.submitNewsletterForm.bind(this);
  }

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };
  submitNewsletterForm(e) {
    e.preventDefault();
    console.log(this.state);
    if (this.state.newsletterEmail !== "" && this.state.newsletterName !== "") {
      const formData = {
        contactPerson: this.state.newsletterName,
        email: this.state.newsletterEmail.toLowerCase(),
      };
      this.setState({ loading: true }, () => {
        commonService
          .postAPI(`common/newsletter`, formData)
          .then((res) => {
            localStorage.setItem("newsletterSubscribed", true);
            if (undefined === res.data || !res.data.status) {
              this.setState({ loading: false });
              toast.error(res.data.message);
              return;
            }
            toast.success(res.data.message);
            this.setState({ newsletterEmail: "", loading: false, errors: {} });

            var strWindowFeatures =
              "location=yes,height=650,width=520,scrollbars=yes,status=yes";
            setTimeout(() => {
              window.open(ebookFile, "_blank", strWindowFeatures);
            }, 200);
          })
          .catch((err) => {
            toast.error(err.message);
            this.setState({ loading: false });
          });
      });
    } else {
      toast.error("Name and Email should not be empty!");
      return;
    }
  }

  render() {
    const { loading, newsletterName, newsletterEmail } = this.state;
    let loaderElement = "";
    if (loading) loaderElement = <Loader />;

    return (
      <>
        <ToastContainer />
        {loaderElement}
        <footer className="footer">
          <div className="top-footer">
            <div className="container">
              <div className="row">
                <div className="col-md-3 col-lg-3 col-sm-12">
                  <div className="footer-about-info">
                    <div className="footer-logo">
                      <a href="https://www.virtdrop.com/">
                        <img
                          height="33"
                          src="../images/wh-logo.png"
                          className="attachment-large size-large"
                          alt=""
                          loading="lazy"
                        />
                      </a>
                    </div>
                    <p>
                      VirtDrop is a Virtual Assistant company registered in New
                      York. We supply high-quality Virtual Assistant services to
                      individual clients and major businesses alike. VirtDrop
                      provides ongoing training and support for our Virtual
                      Assistants, guaranteeing our client’s goals can always be
                      achieved. VirtDrop began operations in 2019.
                    </p>
                  </div>
                </div>
                <div className="col-md-2 col-lg-2 col-sm-12">
                  <div className="footer-link-info">
                    <h2>Useful Links</h2>
                    <ul className="footer-link-list">
                      {/* <li><Link to="/how-it-works">How it works</Link></li>
                    <li><Link to="/services">Services</Link></li>
                    <li><Link to="/pricing">Plan & Pricing</Link></li>
                    <li><Link to="/contact-us">Contact Us</Link></li> */}
                      <li>
                        <a href="https://www.virtdrop.com/">Home</a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/how-it-works/">
                          How it works?
                        </a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/our-services/">
                          Our Services
                        </a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/pricing/">Pricing</a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/blog/">Blog</a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/faq/">FAQ</a>
                      </li>
                      <li>
                        <a href="https://www.virtdrop.com/contact-us/">
                          Contact Us
                        </a>
                      </li>

                      {/* <li> <Link to={{ pathname: "https://www.virtdrop.com/how-it-works/" }} target="_blank">How it works?</Link></li> */}
                      {/* <li> <Link to={{ pathname: "https://www.virtdrop.com/our-services/" }} target="_blank">Our Services</Link></li> */}
                      {/* <li> <Link to={{ pathname: "https://www.virtdrop.com/pricing/" }} target="_blank">Pricing</Link></li> */}
                      {/* <li> <Link to={{ pathname: "https://www.virtdrop.com/contact-us/" }} target="_blank">Contact Us</Link></li> */}
                    </ul>
                  </div>
                </div>
                <div className="col-md-4 col-lg-4 col-sm-12">
                  <div className="footer-link-info">
                    <h2>Tags</h2>
                    <ul className="footer-tags-list">
                      <li>Virtual Assistant</li>
                      <li>Consulting Agency</li>
                      <li>Virtdrop</li>
                      <li>Freelancer</li>
                      <li>Virtually Drop</li>
                      <li>Dedicated Professionals</li>
                      <li>Virtual Employee</li>
                    </ul>
                  </div>
                </div>
                <div className="col-md-3 col-lg-3 col-sm-12">
                  <div className="footer-link-info">
                    <h2>Address</h2>
                    <ul className="footer-contact-list">
                      <li>
                        <i aria-hidden="true" className="fa fa-map-marker"></i>
                        <span className="footer-contact-text">
                          576 Fifth Avenue, New York
                        </span>
                      </li>
                      <li>
                        <a href="tel:212-518-3183">
                          <i aria-hidden="true" className="fa fa-phone"></i>
                          <span className="footer-contact-text">
                            212-518-3183
                          </span>
                        </a>
                      </li>
                      <li>
                        <a href="mailto:support@virtdrop.com">
                          <i aria-hidden="true" className="fa fa-envelope"></i>
                          <span className="footer-contact-text">
                            support@virtdrop.com
                          </span>
                        </a>
                      </li>
                    </ul>

                    <div className="footer-social">
                      <ul>
                        {/* <li><a href="/services"> Services</a></li>
                      <li><a href="/privacy-policy">Privacy Policy</a></li>
                      <li><a href="/terms-of-service">Terms of Service</a></li> */}

                        {/* <li> <a href="https://www.virtdrop.com/our-services/" >Our Services</a></li>
                      <li><a href="/sitemap.xml" target="_blank">Sitemap</a></li> */}
                        <li>
                          <a
                            className="facebook"
                            href="https://www.facebook.com/virtdrop"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fa fa-facebook"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="twitter"
                            href="https://twitter.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fa fa-twitter"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="linkedin"
                            href="https://www.linkedin.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fa fa-linkedin"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="instagram"
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fa fa-instagram"></i>
                          </a>
                        </li>
                        <li>
                          <a
                            className="youtube"
                            href="https://www.instagram.com/"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fa fa-youtube-play"></i>
                          </a>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bottom-footer">
            <div className="container">
              <div className="copyright-text">
                © VIRTDROP. All rights reserved.
              </div>
            </div>
          </div>
        </footer>
        <div className="discovery-call-info">
          <div className="discovery-call-inner">
            <Link to="/booking">
              <div className="pulse">
                <i className="fa fa-phone" aria-hidden="true"></i>
              </div>
              <div className="booking-text">Book Discovery Call</div>
            </Link>
          </div>
        </div>
      </>
    );
  }
}

export default CommonFrontEndFooter;
