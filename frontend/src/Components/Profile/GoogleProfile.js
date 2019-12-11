import * as React from "react";
import {Col, Container, Image, ListGroup, Row} from "react-bootstrap";

export default class GoogleProfile extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {
        const {given_name,family_name,picture,email,} = this.props.googleData;
        return (
            <Container>
                <Row>
                    <Col sm={12}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Image src={picture}/>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Name: {given_name} {family_name}
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Email: {email}
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                </Row>
            </Container>
        );
    }
}