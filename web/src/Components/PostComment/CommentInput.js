import React, {createRef,Component} from "react";
import {MDBBtn, MDBCardBody, MDBCol, MDBIcon, MDBInputGroup, MDBRow} from "mdbreact";
import {BASE_URL} from "../../Config";
import cookie from "react-cookies";

export default class CommentInput extends Component{

    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        }

        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.inputRef = createRef();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return nextProps.inputVisibility !== this.props.inputVisibility
    }

    onChangeHandler(e) {
        this.setState({comment: e.target.value})
    }

    keyPress(e) {
        if (e.keyCode === 13) {
            this.submitHandler();
        }
    }

    submitHandler() {
        const {comment} = this.state;
        const id = this.props.id;

        fetch(BASE_URL+'/comment',{
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' +  cookie.load('access-token')
            },
            method: "POST",
            body: JSON.stringify({text:comment,post:id})
        })
            .then((response => response.json()))
            .then((data => {
                if(data.success) {
                    this.setState({comment: ''},() => {
                        this.props.setNewSingleComment(data.comment);
                        this.props.setNewCommentCount();
                        if(this.props.modal) {
                            this.props.setNewComments(data.comment);
                            document.getElementsByClassName('modal-body')[0].scrollTop = 0;
                        }
                    });

                }
            }))
            .catch(err => {
                this.setState({error: 'Oops... Something went wrong!',loading: false});
            })
    }


    render() {
        const {inputVisibility} = this.props;

        return (
            <MDBRow className={inputVisibility ? 'd-block' : 'd-none'}>
                <MDBCol>
                    <MDBInputGroup
                        ref={this.inputRef}
                        material
                        name={'comment'}
                        value={this.state.comment}
                        onChange={this.onChangeHandler}
                        onKeyDown={this.keyPress}
                        containerClassName="mb-2 mt-0"
                        hint={'Enter comment...'}
                        append={
                            <MDBBtn color={'white'} style={{boxShadow: 'none'}} onClick={this.submitHandler}>
                                <MDBIcon  far={true} style={{color: 'red'}} icon={'paper-plane'} size={'2x'}/>
                            </MDBBtn>
                        }
                    />
                </MDBCol>
            </MDBRow>
        );
    }
}