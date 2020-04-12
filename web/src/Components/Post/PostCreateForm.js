import React,{Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow, MDBTooltip} from "mdbreact";
import {isMobile} from "react-device-detect";
import {ClipLoader} from "react-spinners";
import {Picker as EmojiPicker} from "emoji-mart";
import SimpleReactValidator from "simple-react-validator";
import './Post.css'
import PropTypes from 'prop-types'

export default class PostCreateForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            chosenEmoji: null,
            setChosenEmoji: null,
            text: '',
            showEmojis: false,
        };

        this.showEmojis = this.showEmojis.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.resetText = this.resetText.bind(this);
        this.validator = new SimpleReactValidator();
    }

    validateForm() {
        if (this.validator.allValid()) {
            this.props.onSendPostHandler(this.state.text)
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    resetText() {
        this.setState({text: ''})
    }

    showEmojis(e) {
        this.setState(
            {
                showEmojis: true
            },
            () => document.addEventListener("click", this.closeMenu)
        );
    };

    closeMenu(e) {
        if (this.emojiPicker !== null && !this.emojiPicker.contains(e.target)) {
            this.setState(
                {
                    showEmojis: false
                },
                () => document.removeEventListener("click", this.closeMenu)
            );
        }
    };

    handleChange(e) {
        this.setState({[e.target.name]: e.target.value})
    }

    addEmoji(e) {
        let emoji = e.native;
        this.setState((prevState) => ({text: prevState.text + emoji}))
    }

    render() {
        const {text,showEmojis} = this.state;
        const {loading,size} = this.props;
        const textColor = text.length > 180 ? 'text-danger' : 'text-dark';
        return (
            <MDBRow center className={'mt-3'}>
                <MDBCol md={size ? size : 8} sm={12}>
                    <MDBCard>
                        <MDBCardBody>
                            <form noValidate>
                                <MDBInput
                                    outline={true}
                                    name={'text'}
                                    value={text}
                                    type={'textarea'}
                                    label={'What\'s on your mind...'}
                                    rows={5}
                                    onChange={this.handleChange}
                                />
                                <small>{this.validator.message('text', text, 'required|max:180')}</small>
                            </form>
                            <small className={'float-right ' + textColor}>{text.length}/180</small><br/>
                            <MDBBtn outline={true} circle={true} color={'grey'} size={'sm'}><MDBIcon icon={'image'} size={'2x'} /></MDBBtn>
                            {!isMobile &&
                            <MDBTooltip placement="top">
                                <MDBBtn onClick={this.showEmojis} outline={true} circle={true} color={'grey'} size={'sm'}><MDBIcon icon={'laugh-wink'} size={'2x'}/></MDBBtn>
                                <div>Select an emoji...</div>
                            </MDBTooltip>
                            }
                            <MDBTooltip placement="top">
                                <MDBBtn
                                    className={'float-right'}
                                    outline={true}
                                    color={'red'}
                                    size={'sm'}
                                    disabled={(!!(text.length > 180 || text.length < 1 || loading))}
                                    onClick={this.validateForm}
                                >
                                    {loading
                                        ?
                                        <ClipLoader
                                            sizeUnit={"px"}
                                            size={12}
                                            color={'#f00'}
                                            loading={loading}
                                        />
                                        :
                                        <MDBIcon icon={'plus'}/>
                                    }
                                </MDBBtn>
                                <div>Post this to your timeline...</div>
                            </MDBTooltip>
                            {showEmojis &&
                            <span ref={el => (this.emojiPicker = el)}>
                                <EmojiPicker  emojiTooltip={true}
                                              title="Allshak"
                                              style={{position: 'absolute', zIndex: 1}}
                                              onSelect={this.addEmoji.bind(this)}
                                />
                            </span>
                            }
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }
}

PostCreateForm.propTypes = {
    loading: PropTypes.bool.isRequired,
    onSendPostHandler: PropTypes.func.isRequired,
    size: PropTypes.number
}
PostCreateForm.defaultProps = {
    size: 8
}