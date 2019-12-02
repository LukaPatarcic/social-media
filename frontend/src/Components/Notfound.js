import * as React from "react";
import {Col, Container, Row} from "react-bootstrap";

export default class Notfound extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            col: []
        }
        this.renderCol = this.renderCol.bind(this);

    }

    componentDidMount() {
        this.renderCol();
    }

    renderCol() {
        let cols = [];
        for (let i = 1; i <= 6; i++) {
            cols.push(<Col sm={12} md={6} xl={4}>
                <h2>Post Title {i}</h2>
                <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ab ea eaque error, est perferendis quae
                    quam quia quod repellendus voluptatem.</p>
            </Col>);
        }
        console.log(cols);
        this.setState({
            col: cols
        })
    }

    render() {
        return (
            <Container>
                <Row>
                    <h1 className={'text-center'}>My First Bootstrap Website</h1>
                </Row>
                <Row>
                    {this.state.col.map((co) => co)}
                </Row>
            </Container>
        );
    }
}