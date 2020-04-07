import {MDBBtn, MDBCol, MDBIcon, MDBPopover, MDBPopoverBody, MDBPopoverHeader} from "mdbreact";
import {
    FacebookIcon,
    FacebookShareButton, RedditIcon, RedditShareButton,
    TwitterIcon,
    TwitterShareButton,
    WhatsappIcon,
    WhatsappShareButton
} from "react-share";
import React from "react";

export default class PostShare extends React.Component{
    render() {
        return (
            <MDBPopover placement={'top'} popover={true} clickable={true} id={'share-media'}>
                <MDBBtn color={'white'} block={true} style={{boxShadow: 'none'}}>
                    <MDBIcon far={false} icon={'share'} size={'2x'}/>
                </MDBBtn>
                <div>
                    <MDBPopoverHeader>Share media</MDBPopoverHeader>
                    <MDBPopoverBody>
                        <FacebookShareButton
                            url={'https://allshack.lukaku.tech'}
                            quote={'Testing123'}>
                            <FacebookIcon size={32} round />
                        </FacebookShareButton>
                        <TwitterShareButton
                            url={'https://allshack.lukaku.tech'}
                            quote={'Testing123'}
                        >
                            <TwitterIcon size={32} round />
                        </TwitterShareButton>
                        <WhatsappShareButton>
                            <WhatsappIcon size={32} round />
                        </WhatsappShareButton>
                        <RedditShareButton
                            url={'https://allshack.lukaku.tech'}
                            quote={'Testing123'}
                        >
                            <RedditIcon size={32} round/>
                        </RedditShareButton>
                    </MDBPopoverBody>
                </div>
            </MDBPopover>
        );
    }
}