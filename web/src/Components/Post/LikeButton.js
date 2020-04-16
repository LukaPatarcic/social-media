import React from "react";
import {MDBBtn, MDBIcon, MDBTooltip} from "mdbreact";
import PropTypes from 'prop-types';

export default class LikeButton extends React.Component{
    constructor(props) {
        super(props);

    }

    // shouldComponentUpdate(nextProps, nextState, nextContext) {
    //     return nextProps.liked !== this.props.liked;
    // }

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
};