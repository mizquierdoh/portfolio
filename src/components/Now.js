import React, { Component } from 'react';
import { Row, Col, Container } from 'react-bootstrap'

class Now extends Component {

    constructor(props) {
        super(props);
        console.log('props', this.props);
    }
    render() {
        return (
            <Container>
                <Row>
                    <Col>
                        <h2>Main </h2>
                    </Col>
                    <Col>
                        <h2>Ritual </h2>
                    </Col>
                    <Col>
                        <h2>Chaos </h2>
                    </Col>
                    <Col>
                        <h2>Desert </h2>
                    </Col>

                </Row>
            </Container>

        )
    }
}

export default Now;