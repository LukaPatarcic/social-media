import React from "react";
import PropTypes from 'prop-types';

export default function ShowMoreReplies(props) {
    return (
        <p className={'text-center pb-0 mb-0'}>
            <a className={'text-muted'} style={{fontSize: 13}} href={'#'} onClick={props.showMoreReplies}>
                Show more replies...({props.subCommentCount})
            </a>
        </p>
    )
}

ShowMoreReplies.propTypes = {
    showMoreReplies: PropTypes.func.isRequired,
    subCommentCount: PropTypes.number.isRequired
}