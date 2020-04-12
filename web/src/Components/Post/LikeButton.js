import React from "react";
import {MDBBtn, MDBIcon, MDBTooltip} from "mdbreact";
import cookie from "react-cookies";
import {BASE_URL} from "../../Config";
import PropTypes from 'prop-types';

export default class LikeButton extends React.Component{
    constructor(props) {
        super(props);

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

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.liked !== this.props.liked;
    }

    render() {
        const {liked,onHandlePostLike,id} = this.props;
        return (
            <MDBTooltip>
            <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}} onClick={() => onHandlePostLike(id,liked)}>
                <MDBIcon className={'text-danger'} far={!liked} icon={'heart'} size={'2x'}/><br/>
            </MDBBtn>
                <div>{liked ? 'Liked':'Like'}</div>
            </MDBTooltip>
        );
    }
}

LikeButton.propTypes = {
    liked: PropTypes.bool.isRequired,
    id: PropTypes.number.isRequired,
    onHandlePostLike: PropTypes.func.isRequired
}