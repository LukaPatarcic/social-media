import React,{Component} from "react";
import {
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBIcon,
    MDBInput,
    MDBModal, MDBModalBody, MDBModalFooter,
    MDBModalHeader,
    MDBRow,
    MDBTooltip
} from "mdbreact";
import {isMobile} from "react-device-detect";
import Files from "react-butterfiles";
import {Picker as EmojiPicker} from "emoji-mart";
import SimpleReactValidator from "simple-react-validator";
import ScrollContainer from 'react-indiana-drag-scroll'
import './Post.css'
import PropTypes from 'prop-types'
import Loading from "../../Helpers/Loading";
import ImageCompression from "../../Helpers/ImageCompression";
import Cropper from 'react-cropper';
import {editUserPicture} from "../../Api/editUser";

export default class PostCreateForm extends Component{
    constructor(props) {
        super(props);
        this.state = {
            chosenEmoji: null,
            setChosenEmoji: null,
            text: '',
            showEmojis: false,
            files: [],
            errors: [],
            filesForUpload: [],
            modal: false,
            imageToEdit: null,
            imageToEditId: null,
            croppedImage: null
        };

        this.showEmojis = this.showEmojis.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
        this.validateForm = this.validateForm.bind(this);
        this.resetText = this.resetText.bind(this);
        this.toggle = this.toggle.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.validator = new SimpleReactValidator();
        this.imageCompresssion = new ImageCompression();
        this.cropper = React.createRef(null);

    }

    validateForm() {
        if (this.validator.allValid()) {
            this.state.files.map((file,index) => {
                const img = this.imageCompresssion.compressImages(file);
                img.then(data => {
                    ImageCompression.getBase64(data)
                        .then(base64 => {
                            this.setState((prevState) => ({
                                    filesForUpload: [...prevState.filesForUpload, base64]
                                })
                            )
                        })
                        .finally(() => {
                            if(index === this.state.files.length - 1) {
                                this.props.onSendPostHandler(this.state.text,this.state.filesForUpload);
                            }
                        })
                })
            });
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }

    resetText() {
        this.setState({text: '',files: [],filesForUpload: []})
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

    removeImage(name) {
        this.setState(
        {files:  this.state.files.filter((file) => {
                return name !== file.src.file.name;
            })
        })
    }

    toggle() {
        this.setState({
            modal: !this.state.modal,
        });
    }

    saveChanges() {
        this.toggle();
        this.setState((prevState) => {
            prevState.files.map((file) => {
                if(file.id == this.state.imageToEditId) {
                    file.src.base64 = this.cropper.current.getCroppedCanvas().toDataURL();
                    return file;
                }

                return  file;
            });
            return {
                files: prevState.files,
                croppedImage: null,
                imageToEdit: null,
                imageToEditId: null,
            }
        });
    }

    editImage(image,id) {
        this.toggle();
        this.setState({
            imageToEdit: image,
            imageToEditId: id
        })
    }

    render() {
        const {text,showEmojis,files} = this.state;
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
                                <EmojiPicker
                                    emojiTooltip={true}
                                    title="Allshak"
                                    style={{position: 'absolute', zIndex: 1}}
                                    onSelect={this.addEmoji.bind(this)}
                                />
                            </span>
                            }
                            <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                                <MDBModalHeader toggle={this.toggle}>MDBModal title</MDBModalHeader>
                                <MDBModalBody>
                                    <Cropper
                                        ref={this.cropper}
                                        src={this.state.imageToEdit}
                                        style={{height: 400, width: '100%'}}
                                        aspectRatio={1}
                                        guides={false}
                                    />
                                </MDBModalBody>
                                <MDBModalFooter>
                                    <MDBBtn color="secondary" onClick={this.toggle}>Close</MDBBtn>
                                    <MDBBtn color="primary" onClick={this.saveChanges}>Save changes</MDBBtn>
                                </MDBModalFooter>
                            </MDBModal>
                            <Files
                                multiple={true}
                                maxSize="10mb"
                                accept={["image/jpeg","image/png","image/gif"]}
                                multipleMaxSize="50mb"
                                multipleMaxCount={5}
                                onSuccess={files => this.setState({ files })}
                                onError={errors => this.setState({ errors })}
                                convertToBase64={true}
                            >
                                {({ browseFiles }) => (
                                    <>
                                        <MDBBtn outline={true} circle={true} color={'grey'} size={'sm'} onClick={browseFiles}><MDBIcon icon={'image'} size={'2x'} /></MDBBtn>
                                        <ScrollContainer
                                            className="image-upload-container"
                                            horizontal={true}
                                            vertical={false}
                                            hideScrollbars={false}
                                            nativeMobileScroll={true}
                                        >
                                            {files.map((file,index) => {
                                                return (
                                                    <div className={'image-wrap'} key={index}>
                                                        <img key={index} className={'mr-2 menu-image'} src={file.src.base64} width={100} height={100} style={{objectFit: 'cover'}} />
                                                        <div className={'overlay'}>
                                                            <MDBIcon className={'edit-image'} icon={'edit'} color={'white'} onClick={() => this.editImage(file.src.base64,file.id)} />
                                                            <MDBIcon className={'remove-image'} icon={'times'} color={'white'} onClick={() => this.removeImage(file.src.file.name)} />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </ScrollContainer>
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