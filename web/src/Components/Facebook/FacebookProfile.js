import * as React from "react";
import {Col, Container, Image, ListGroup, Row} from "react-bootstrap";

export default class FacebookProfile extends React.Component{

    constructor(props) {
        super(props);
    }

    render() {

        const {first_name,last_name,gender,age_range,picture,birthday,friends} = this.props.facebookData;
        return (
            <Container>
                <Row>
                    <Col sm={12}>
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
                        </ListGroup>
                    </Col>
                    <Col sm={12}>
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