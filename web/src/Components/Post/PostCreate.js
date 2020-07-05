import React, {createRef} from "react";
import toastr from 'toastr/build/toastr.min'
import PostCreateForm from "./PostCreateForm";
import {sendPost} from "../../Api/post";
import PropTypes from 'prop-types';

export default class PostCreate extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }

        this.sendPostHandler = this.sendPostHandler.bind(this);
        this.postCreateFormRef = createRef();

    }

    sendPostHandler(text) {
        this.setState({loading: true})
        sendPost(text)
            .then(response => {
                this.setState({loading: false});
                this.postCreateFormRef.current.resetText();
                if(this.props.onlyMe) {
                    this.props.onSendPostHandler(response.post)
                }

                toastr.success('Post added to timeline!')
            })
            .catch(err => {err.response.json().then(err => {
                this.setState({loading: false});
                toastr.error(err.error)
            })});

    }

    render() {
        const {loading} = this.state;
        return (
            <PostCreateForm
                ref={this.postCreateFormRef}
                loading={loading}
                onSendPostHandler={this.sendPostHandler}
            />
        )
    }
}

PostCreate.propTypes = {
    onSendPostHandler: PropTypes.func
}