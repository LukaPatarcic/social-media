import React,{Component} from "react";
import {MDBBadge, MDBModal, MDBModalBody, MDBModalHeader} from "mdbreact";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';

export default class PostLikes extends Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false,
        };

        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState({modal: !this.state.modal});
    }

    render() {
        const {likes} = this.props;
        const {modal} = this.state;
        return (
            <>
                <a href={'#'} className={'text-dark'} onClick={this.toggle}>
                    <span className={'mr-3'}>
                        Likes <MDBBadge style={{fontSize: 14}} color={'red'}>{likes}</MDBBadge>
                    </span>
                </a>
                <MDBModal size={'lg'} isOpen={modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>Likes ({likes})</MDBModalHeader>
                    <MDBModalBody style={{height: 600,overflowY: 'scroll'}}>
                       <h1>Likes...</h1>
                    </MDBModalBody>
                </MDBModal>
            </>
        );
    }
}

PostLikes.propTypes = {
    likes: PropTypes.number.isRequired
}