import React from "react";
import "./BlogPage.css";
import { Link } from 'react-router-dom';

class BlogPage extends React.Component {
  
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <>        
        <section className="blog-section">
           <div className="container">
              <div className="row">
                <div className="col-lg-12 col-md-12 col-sm-12 mx-auto">
                    <div className="row">
                       <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="single-blog">
                              <div className="post-tags green-bg">
                                  <Link to="/blog/category/design">Design,</Link>
                                  <Link to="/blog/category/branding">Branding</Link>
                              </div>
                              <div className="post-img">
                                  <img src="/images/t2.jpg" alt="" />
                              </div>
                              <div className="post-content">
                                    <div className="post-meta">
                                        <Link to="/blog/user/admin"><i className="ti-user"></i>Admin</Link>
                                        <i className="ti-calendar"></i>October 10, 2019
                                  </div>
                                  <h2><Link to="/blog/had-creepeth-them-multiply-lights-brought-had-said">Had creepeth them multiply lights brought had said</Link></h2>
                              </div>
                          </div>
                       </div>
                       <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="single-blog">
                              <div className="post-tags primary-bg">
                                <Link to="/blog/category/design">Design,</Link>
                                <Link to="/blog/category/branding">Branding</Link>
                              </div>
                              <div className="post-img">
                                  <img src="/images/t2.jpg" alt="" />
                              </div>
                              <div className="post-content">
                                  <div className="post-meta">
                                    <Link to="/blog/user/admin"><i className="ti-user"></i>Admin</Link>
                                    <i className="ti-calendar"></i>October 10, 2019
                                  </div>
                                  <h2><Link to="/blog/tree-can-grass-to-cattle-made-forth-beet-doing-morning">Tree can grass to cattle made forth beet doing morning.</Link></h2>
                              </div>
                          </div>
                      </div>
                       <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="single-blog">
                              <div className="post-tags primary-bg">
                                <Link to="/blog/category/design">Design,</Link>
                                <Link to="/blog/category/branding">Branding</Link>
                              </div>
                              <div className="post-img">
                                  <img src="/images/t2.jpg" alt="" />
                              </div>
                              <div className="post-content">
                                  <div className="post-meta">
                                    <Link to="/blog/user/admin"><i className="ti-user"></i>Admin</Link>
                                    <i className="ti-calendar"></i>October 10, 2019
                                  </div>
                                  <h2><Link to="/blog/had-creepeth-them-multiply-lights-brought-had-said">Dominion in for beast Also said was subdue which seas.</Link></h2>
                              </div>
                          </div>
                      </div>
                       <div className="col-lg-4 col-md-4 col-sm-6">
                          <div className="single-blog">
                              <div className="post-tags orange-bg">
                                <Link to="/blog/category/design">Design,</Link>
                                <Link to="/blog/category/branding">Branding</Link>
                              </div>
                              <div className="post-img">
                                  <img src="/images/t2.jpg" alt="" />
                              </div>
                              <div className="post-content">
                                  <div className="post-meta">
                                    <Link to="/blog/user/admin"><i className="ti-user"></i>Admin</Link>
                                    <i className="ti-calendar"></i>October 10, 2019
                                  </div>
                                  <h2><Link to="/blog/had-creepeth-them-multiply-lights-brought-had-said">Fruit appear light appear two form evening they are right.</Link></h2>
                              </div>
                          </div>
                      </div>
                       <div className="col-lg-12 col-md-12 col-sm-12 text-center">
                        <Link to="/blog/had-creepeth-them-multiply-lights-brought-had-said" className="bttn-mid btn-fill-3">More Post</Link>
                      </div>
                    </div>
                 </div>
              </div>
            </div>
        </section>
            
      </>
    );
  }
}

export default BlogPage;
