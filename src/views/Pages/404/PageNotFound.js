import React from "react";
import { Container, Row, Col} from 'reactstrap';
import "./PageNotFound.css";

class PageNotFound extends React.Component {
  
  render() {
    return (
      <>        

        <section className="main-content">
            <Container>
                <Row>
                <Col md="12" lg="12">
                    <h2>Page Not Found</h2>
                </Col>
                </Row>
            </Container>
        </section>
            
      </>
    );
  }
}

export default PageNotFound;