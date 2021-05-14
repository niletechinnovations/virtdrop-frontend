import React from "react";
import "./BlogPage.css";
import { Link } from 'react-router-dom';

class SingleBlogPage extends React.Component {
  
  render() {
    return (
      <>        
        
<section className="blog-section">
  <div className="container">
    <div className="row">
      <div className="content-side col-lg-9 col-md-8 col-sm-12 col-xs-12">
        <div className="blog-single">
          <div className="news-block-three">
            <div className="inner-box">
              <div className="image">
                  <img src="/images/t2.jpg" alt="" />
              </div>
              <div className="content-column">
                  <div className="upper-box">
                      <div className="title-box">
                          <div className="date"><span>08</span>Dec</div>
                          <h3>Had creepeth them multiply lights brought had said</h3>
                          <ul className="post-meta">
                              <li><Link to="/blog"><span className="icon flaticon-user-shape"></span> John Loe</Link></li>
                              <li><Link to="/blog"><span className="icon fa fa-comments"></span> 207</Link></li>
                          </ul>
                      </div>
                  </div>
                  <div className="lower-box">
                      <div className="text">
                        <p>Rganically grow the holistic world view of disruptive innovation via workplace diversity and .rganically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.ampowerment.Rganically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.Leverage agile frameworks to provide a robust synopsis for high level overviews. Iterative approaches to corporate strategy foster collaborative thinking to further the overall value proposition. Organically grow the holistic world view of disruptive innovation via workplace diversity and empowerment.</p>
                          <p>Bring to the table win-win survival strategies to ensure proactive domination. At the end of the day, going forward, a new normal that has evolved from generation X is on the runway heading towards a streamlined cloud solution. User generated content in real-time will have multiple touchpoints for offshoring.</p>
                          <p>Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.</p>
                          <blockquote>
                            <div className="blockquote-inner">
                              <div className="quote-icon flaticon-left-quote"></div>
                                <div className="blockquote-text">Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps.</div>
                              </div>
                          </blockquote>
                          <p>Capitalize on low hanging fruit to identify a ballpark value added activity to beta test. Override the digital divide with additional clickthroughs from DevOps. Nanotechnology immersion along the information highway will close the loop on focusing solely on the bottom line.</p>
                      </div>
                  </div>
              </div>
          </div>
      </div>
  </div>
</div>
            
    <div className="sidebar-side col-lg-3 col-md-4 col-sm-12 col-xs-12">
        <div className="sidebar">
              <div className="sidebar-widget popular-posts">
                  <div className="sidebar-title">
                      <h2>related Posts</h2>
                  </div>
                  <article className="post">
                    <figure className="post-thumb"><Link to="/blog"><img src="/images/t2.jpg" alt="" /></Link></figure>
                      <h4><Link to="/blog">man named Brady who was with three boys.</Link></h4>
                      <div className="price">Dec 12, 2016</div>
                  </article>

                  <article className="post">
                    <figure className="post-thumb"><Link to="/blog"><img src="/images/t1.jpg" alt="" /></Link></figure>
                      <h4><Link to="/blog">These Happy Days are yours mine Happy Days.</Link></h4>
                      <div className="price">Dec 26, 2016</div>
                  </article>
                  
                  <article className="post">
                    <figure className="post-thumb"><Link to="/blog"><img src="/images/t3.jpg" alt="" /></Link></figure>
                      <h4><Link to="/blog">Pork belly strip steak  flan pastrami biltong</Link></h4>
                      <div className="price">Sep 16, 2016</div>
                  </article>

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

export default SingleBlogPage;
