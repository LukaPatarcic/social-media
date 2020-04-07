import {MDBBtn, MDBCol, MDBIcon, MDBInputGroup} from "mdbreact";
import React from "react";

export default class CommentCreate extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
    }

    onChangeHandler(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    submitHandler() {
        const {comment} = this.state;
        console.log(comment)
    }

    render() {
        return (
            <MDBInputGroup
                id={'commentInput'}
                material
                ref={this.props.commentInputRef}
                name={'comment'}
                onChange={this.onChangeHandler}
                containerClassName="mb-2 mt-0"
                hint={'Enter comment...'}
                append={
                    <MDBBtn color={'white'} style={{boxShadow: 'none'}} onClick={this.submitHandler}>
                        <MDBIcon  far={true} style={{color: 'red'}} icon={'paper-plane'} size={'2x'}/>
                    </MDBBtn>
                }
            />
        );
    }
}