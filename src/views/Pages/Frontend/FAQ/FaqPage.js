import React from "react";
import { Container, Row, Col, NavLink, Collapse, Card, CardHeader, CardBody } from 'reactstrap';
import "./FaqPage.css";

class FaqPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { collapse: 0, cards: [1, 2, 3, 4, 5] };
    this.toggle = this.toggle.bind(this);
  }
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  toggle(e) {
    let event = e.target.dataset.event;
    this.setState({ collapse: this.state.collapse === Number(event) ? 0 : Number(event) });
  }
  
  render() {
    const {collapse} = this.state;

    return (
      <> 
      <section className="banner-section">
        <div className="banner-media-content">
          <div className="banner-media">
            <img src="/images/banner4.jpg" alt="FAQ's" />
          </div>
          <div className="banner-content">
            <h2>Lorem Ipsum is composed in a pseudo-Latin language which more or less corresponds to 'proper' Latin.</h2>
          </div>
        </div>
      </section>
        
        <section className="faq-page-section">
          <Container> 
            <Row>
              <Col md="5">
                <div className="faqs-info-media text-center">
                  <img src="images/faq.svg" height="500" alt="FAQ" />
                </div>
              </Col>
              <Col md="7">
                <div className="faqs-info-box">
                  <h2>Frequently Asked Questions (FAQs)</h2>
                  <div id="accordion">
                    <Card>
                        <CardHeader>
                          <h5><NavLink className={ (collapse !== 0 ? "btn btn-link collapsed" : "btn btn-link expanded") } onClick={this.toggle} data-event="0">How the virtdrop Works?</NavLink></h5>
                        </CardHeader>
                        <Collapse isOpen={collapse === 0}>
                          <CardBody>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                          </CardBody>
                        </Collapse>  
                    </Card>
                    <Card>
                        <CardHeader>
                          <h5><NavLink className={ (collapse !== 1 ? "btn btn-link collapsed" : "btn btn-link expanded") }  onClick={this.toggle} data-event="1">How do I get in touch with a 24/7 assistant?</NavLink></h5>
                        </CardHeader>
                        <Collapse isOpen={collapse === 1}>
                          <CardBody>
                            <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                          </CardBody>
                        </Collapse>  
                    </Card>
                    <Card>
                      <CardHeader>
                        <h5><NavLink className={ (collapse !== 2 ? "btn btn-link collapsed" : "btn btn-link expanded") }  onClick={this.toggle} data-event="2">Would I be assigned a dedicated Virtual Assistant?</NavLink></h5>
                      </CardHeader>
                      <Collapse isOpen={collapse === 2}>
                        <CardBody>
                          <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                        </CardBody>
                      </Collapse>  
                    </Card>
                    <Card>
                      <CardHeader>
                        <h5><NavLink className={ (collapse !== 3 ? "btn btn-link collapsed" : "btn btn-link expanded") }  onClick={this.toggle} data-event="3">How do I get in touch with a 24/7 assistant?</NavLink></h5>
                      </CardHeader>
                      <Collapse isOpen={collapse === 3}>
                        <CardBody>
                          <p>Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs. The passage is attributed to an unknown typesetter in the 15th century who is thought to have scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in a type specimen book.</p>
                        </CardBody>
                      </Collapse>  
                    </Card>
                  </div>
                </div>
              </Col>
            </Row>  
          </Container>
        </section>
      </>
    );
  }
}

export default FaqPage;
