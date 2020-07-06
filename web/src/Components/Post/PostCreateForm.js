import React,{Component} from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBIcon, MDBInput, MDBRow, MDBTooltip} from "mdbreact";
import {isMobile} from "react-device-detect";
import Files from "react-butterfiles";
import {Picker as EmojiPicker} from "emoji-mart";
import SimpleReactValidator from "simple-react-validator";
import './Post.css'
import PropTypes from 'prop-types'
import Loading from "../../Helpers/Loading";

export default class PostCreateForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            chosenEmoji: null,
            setChosenEmoji: null,
            text: '',
            showEmojis: false,
            files: [],
            errors: []
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
            this.setState({showEmojis: false},
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

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
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
                                    <Loading loading={loading}>
                                        <MDBIcon icon={'plus'}/>
                                    </Loading>
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
                            <Files
                                multiple={true}
                                maxSize="3mb"
                                multipleMaxSize="15mb"
                                multipleMaxCount={5}
                                onSuccess={files => this.setState({ files })}
                                onError={errors => this.setState({ errors })}
                                convertToBase64={true}
                            >
                                {({ browseFiles }) => (
                                    <>
                                        <MDBBtn outline={true} circle={true} color={'grey'} size={'sm'} onClick={browseFiles}><MDBIcon icon={'image'} size={'2x'} /></MDBBtn>
                                        <ol>
                                            {this.state.files.map((file,index) => {
                                                return (<img key={index} className={'mr-2 '} src={file.src.base64} width={100} height={100} />)
                                            })}
                                            {this.state.errors.map(error => (
                                                <li key={error.file.name}>
                                                    {error.file.name} - {error.type}
                                                </li>
                                            ))}
                                        </ol>
                                    </>
                                )}
                            </Files>
                            {this.state.errors.length > 0 && <div>An error occurred.</div>}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }

    static defaultProps = {
        size: 8
    }
}

PostCreateForm.propTypes = {
    loading: PropTypes.bool.isRequired,
    onSendPostHandler: PropTypes.func.isRequired,
    size: PropTypes.number
}