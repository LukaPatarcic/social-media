import * as React from "react";
import { Col, Container, Row} from "react-bootstrap";
import {Card} from 'react-materialize';
import RegistrationForm from "./RegistrationForm";

export default class Register extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            formError: ''
        }
    }

    render() {
        return (
            <Container>
                <Row className={'mt-5'}>
                    <Col sm={12} md={{span: 6, offset: 3}}>
                        <Card className={'text-center'} title={"Register"}>
                            <RegistrationForm />
                        </Card>
                    </Col>
                </Row>
            </Container>
        );
    }
}