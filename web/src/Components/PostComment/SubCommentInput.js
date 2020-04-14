import React, {createRef,Component} from "react";
import {MDBBtn, MDBCol, MDBIcon, MDBInput, MDBRow} from "mdbreact";
import SimpleReactValidator from "simple-react-validator";
import PropTypes from 'prop-types'
import {ClipLoader} from "react-spinners";

export default class SubCommentInput extends Component{

    constructor(props) {
        super(props);
        this.state = {
            comment: ''
        };

        this.validateForm = this.validateForm.bind(this);
        this.keyPress = this.keyPress.bind(this);
        this.onChangeHandler = this.onChangeHandler.bind(this);
        this.validator = new SimpleReactValidator();
        this.inputRef = createRef();
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextState.comment !== this.state.comment) {
            return true;
        }

        if(nextState.sendingCommentReply !== this.props.sendingCommentReply) {
            return true;
        }

        return nextProps.inputVisibility !== this.props.inputVisibility
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if(!prevProps.inputVisibility) {
            this.inputRef.current.inputElementRef.current.focus();
        }
    }

    keyPress(e) {
        if (e.keyCode === 13) { this.validateForm(e); }
    }

    onChangeHandler(e) {
        this.setState({comment: e.target.value})
    }

    validateForm(e) {
        e.preventDefault();
        if (this.validator.allValid()) {
            this.props.onHandleCommentReply(this.props.commentId,this.state.comment);
            this.setState({comment: ''})
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    render() {
        const {inputVisibility,sendingCommentReply} = this.props;
        const {comment} = this.state;

        return (
            <MDBRow className={inputVisibility ? 'd-block' : 'd-none'}>
                <MDBCol>
                    <MDBRow>
                        <MDBCol size={10} className={'pr-0'}>
                            <MDBInput
                                ref={this.inputRef}
                                value={comment}
                                name={'comment'}
                                label={'Enter comment...'}
                                onKeyDown={this.keyPress}
                                onChange={this.onChangeHandler}
                            />
                            <small className="grey-text">{this.validator.message('comment', comment, 'required|max:50')}</small>
                        </MDBCol>
                        <MDBCol size={2} className={'d-flex align-items-center justify-content-center pl-0'}>
                            <MDBBtn color={'white'} className={'text-center'} style={{boxShadow: 'none'}} onClick={this.validateForm}>
                                {
                                    sendingCommentReply ?
                                        <ClipLoader
                                            sizeUnit={"px"}
                                            size={20}
                                            color={'#f00'}
                                            loading={sendingCommentReply}
                                        />
                                        :
                                        <MDBIcon  far={true} style={{color: 'red'}} icon={'paper-plane'} size={'2x'}/>
                                }
                            </MDBBtn>
                        </MDBCol>
                    </MDBRow>
                </MDBCol>
            </MDBRow>
        );
    }
}

SubCommentInput.propTypes = {
    inputVisibility: PropTypes.bool.isRequired,
    onHandleCommentReply: PropTypes.func.isRequired,
    sendingCommentReply: PropTypes.bool.isRequired,
    commentId: PropTypes.number.isRequired,
}