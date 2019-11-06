import * as React from "react";
import cookie from 'react-cookies'
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import {Col, Container, Image, ListGroup, Row} from "react-bootstrap";
import {Redirect} from "react-router-dom";

export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            facebookData: null,
            redirectToLogin: false
        }
    }

    componentDidMount() {
        if(!cookie.load('facebook-access-token')) {
            this.setState({
                redirectToLogin: true
            })
        }
        fetch('http://localhost:8000/connect/facebook/get/user',{
            method: "POST",
            body: JSON.stringify({'facebook-access-token': cookie.load('facebook-access-token')})

        })
            .then(response => response.json())
            .then(data => {this.setState({facebookData: data})})
            .catch(err => {
                this.setState({
                    redirectToLogin: true
                })
            })
    }

    render() {
        if(this.state.facebookData === null) {
            return null;
        }

        if(this.state.redirectToLogin) {
            return (<Redirect to='/login'/>)
        }

        const {first_name,last_name,gender,age_range,picture,birthday,friends} = this.state.facebookData;
        return (
            <Container>
                <Row>
                    <Col sm={12} md={{span: 6, offset: 3}}>
                        <ListGroup>
                            <ListGroup.Item>
                                <Image src={picture.data.url}/>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Name: {first_name} {last_name} ({gender})
                            </ListGroup.Item>

                            <ListGroup.Item>
                                Born: {birthday} ({age_range.min})
                            </ListGroup.Item>

                            <ListGroup.Item>
                            </ListGroup.Item>
                        </ListGroup>
                    </Col>
                    <Col sm={6}>
                        {/*{friends in this.state.facebookData*/}
                        {/*    ?*/}
                            <ListGroup>
                                {friends.data.map(friend => {
                                    console.log(friend);
                                    return(<ListGroup.Item key={friend.id}><Image src={friend.picture.data.url}/>{friend.name}</ListGroup.Item>)
                                })}
                            </ListGroup>
                        {/*    `Total firends: <span className={'text-secondary'}>{friends.summary.total_count}</span>`*/}
                        {/*    :*/}
                        {/*    "No Friends"*/}
                        {/*}*/}

                    </Col>
                </Row>
            </Container>

        );
    }
}