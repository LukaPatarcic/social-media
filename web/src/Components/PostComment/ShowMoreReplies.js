import React from "react";
import PropTypes from 'prop-types';

export default function ShowMoreReplies(props) {
    return (
        <p className={'text-right'}>
            <a className={'text-muted'} href={'#'} onClick={props.showMoreReplies}>
                Show more replies...(+{props.subCommentCount})
            </a>
        </p>
    )
}

ShowMoreReplies.propTypes = {
    showMoreReplies: PropTypes.func.isRequired,
    subCommentCount: PropTypes.number.isRequired
}