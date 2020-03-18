import React from "react";
import {MDBBtn, MDBIcon, MDBTooltip} from "mdbreact";
import cookie from "react-cookies";
import {BASE_URL} from "../../Config";

export default class LikeButton extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            heartClicked: false,
        }

    }

    componentDidMount() {
        this.setState({heartClicked: !this.props.liked})
    }

    handleLike() {
        fetch(BASE_URL + '/like/post',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.load('access-token')
            },
            method: this.state.heartClicked ? 'POST' : 'DELETE',
            body: JSON.stringify({id: this.props.postId})
        })
            .then((response => response.json()))
            .then((data => {
                if(!data.error) {
                    this.props.handleLikes(this.state.heartClicked);
                    this.setState((prevState) => ({heartClicked: !prevState.heartClicked}))
                }
            }))
    }


    render() {
        const {heartClicked} = this.state;

        return (
            <MDBTooltip>
            <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}} onClick={this.handleLike.bind(this)}>
                <MDBIcon className={'text-danger'} far={heartClicked} icon={'heart'} size={'2x'}/><br/>
            </MDBBtn>
                <div>{heartClicked ? 'Like':'Liked'}</div>
            </MDBTooltip>
        );
    }
}