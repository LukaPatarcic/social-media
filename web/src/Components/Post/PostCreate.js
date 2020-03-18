import React from "react";
import {MDBBtn, MDBCard, MDBCardBody, MDBCol, MDBContainer, MDBIcon, MDBInput, MDBRow, MDBTooltip} from "mdbreact";
import { Picker as EmojiPicker } from 'emoji-mart'
import {isMobile} from "react-device-detect";
import SimpleReactValidator from "simple-react-validator";
import cookie from "react-cookies";
import {ClipLoader} from "react-spinners";
import {BASE_URL} from "../../Config";

export default class Post extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            chosenEmoji: null,
            setChosenEmoji: null,
            text: '',
            showEmojis: false,
            loading: false
        }
        this.validator = new SimpleReactValidator();
    }
    sendPost() {
        if (this.validator.allValid()) {
            this.setState({loading: true})
            fetch(BASE_URL+'/post',{
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' +  cookie.load('access-token')
                },
                method: "POST",
                body: JSON.stringify({text: this.state.text})
            })
                .then((response => response.json()))
                .then((data => {
                    this.setState({loading: false, text: ''});
                }))
                .catch(err => {
                    this.setState({error: true,loading: false});
                })
        } else {
            this.validator.showMessages();
            this.forceUpdate();
        }
    }


    showEmojis = e => {
        this.setState(
            {
                showEmojis: true
            },
            () => document.addEventListener("click", this.closeMenu)
        );
    };

    closeMenu = e => {
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

    log (gif) {
        console.log(gif)
    }

    render() {
        const {text,showEmojis,loading} = this.state;
        const textColor = text.length > 180 ? 'text-danger' : 'text-dark';
        return (
            <MDBRow center className={'mt-3'}>
                <MDBCol md={this.props.size ? this.props.size : 8} sm={12}>
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
                                    onChange={this.handleChange.bind(this)}
                                />
                                <small>{this.validator.message('text', text, 'required|max:180')}</small>
                            </form>
                            <small className={'float-right ' + textColor}>{text.length}/180</small><br/>
                            <MDBBtn outline={true} circle={true} color={'grey'} size={'sm'}><MDBIcon icon={'image'} size={'2x'} /></MDBBtn>
                            {!isMobile &&
                            <MDBTooltip placement="top">
                                <MDBBtn onClick={this.showEmojis.bind(this)} outline={true} circle={true} color={'grey'} size={'sm'}><MDBIcon icon={'laugh-wink'} size={'2x'}/></MDBBtn>
                                <div>Select an emoji...</div>
                            </MDBTooltip>
                            }
                            <MDBTooltip placement="top">
                            <MDBBtn
                                className={'float-right'}
                                outline={true}
                                color={'red'}
                                size={'sm'}
                                disabled={(!!(text.length > 180 || text.length < 1))}
                                onClick={this.sendPost.bind(this)}
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
                            {/*<Picker onSelected={this.log.bind(this)} />*/}
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }
}