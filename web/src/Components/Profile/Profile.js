import * as React from "react";
import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody,
    MDBCol,
    MDBContainer,
    MDBIcon,
    MDBModal, MDBModalBody, MDBModalFooter,
    MDBModalHeader,
    MDBRow
} from "mdbreact";
import {Link} from "react-router-dom";
import {setProfilePicture} from "../../Helpers";
import PostContainer from "../Post/PostContainer";
import PropTypes from 'prop-types';
import Loading from "../../Helpers/Loading";
import ls from "local-storage";
import ScrollContainer from "react-indiana-drag-scroll";
import Files from "react-butterfiles";
import Cropper from "react-cropper";
import {editUserPicture} from "../../Api/editUser";


export default class Profile extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            file: [],
            error: [],
            modal: false,
            croppedImage: null
        }

        this.toggle = this.toggle.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.cropper = React.createRef(null);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    saveChanges() {
        this.toggle();
        this.setState((prevState) => {
            prevState.file[0].src.base64 = this.cropper.current.getCroppedCanvas().toDataURL();
            return {
                file: prevState.file,
                croppedImage: null,
                imageToEdit: null,
                imageToEditId: null,
            }
        }, () => {
            editUserPicture(this.state.file[0].src.base64)
                .then(data => {
                    console.log(data);
                })
                .catch(err => err.response.json().then(err => {
                    console.log(err)
                }))
        });
    }

    render() {
        const {loading,user} = this.props;
        const isMe = ls.get('user').profileName === user.profileName
        return (
            <MDBContainer>
                <MDBModal isOpen={this.state.modal} toggle={this.toggle}>
                    <MDBModalHeader toggle={this.toggle}>MDBModal title</MDBModalHeader>
                    <MDBModalBody>
                        <Cropper
                            ref={this.cropper}
                            src={this.state.file.length > 0 ? this.state.file[0].src.base64 : ''}
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
                <MDBRow className={'mt-5'}>
                    <MDBCol size={12} sm={12} md={10} className={'offset-md-1'}>
                        <MDBCard>
                            <MDBCardBody>
                                {isMe &&
                                <span className={'float-right'}>
                                    <Link to={'/profile/edit'} style={{color: 'black'}}>
                                        <MDBIcon icon={'ellipsis-v'} color={'black'} />
                                    </Link>
                                </span>
                                }
                                <MDBRow className={'d-flex align-items-center justify-content-center'}>
                                    <MDBCol size={4} sm={4} md={2} className={'offset-md-2'} >
                                        <Loading loading={loading}>
                                            <div className={'image-wrap'}>
                                                <img
                                                    alt={''}
                                                    className={'img-fluid menu-image rounded-circle'}
                                                    src={
                                                        this.state.file.length > 0 ?
                                                            this.state.file[0].src.base64 :
                                                            user.profilePicture ? user.profilePicture :
                                                            setProfilePicture(user.firstName,user.lastName,128)
                                                    }
                                                />
                                                <div className={'overlay overlay-rounded'}>
                                                    <Files
                                                        multiple={false}
                                                        maxSize="10mb"
                                                        accept={["image/jpeg","image/png","image/gif"]}
                                                        onSuccess={file => {
                                                            this.setState({ file })
                                                            this.toggle()
                                                        }}
                                                        onError={error => this.setState({ error })}
                                                        convertToBase64={true}
                                                    >
                                                        {({ browseFiles }) => (
                                                            <MDBIcon
                                                                className={'edit-profile-picture'}
                                                                icon={'camera'}
                                                                color={'white'}
                                                                size={'2x'}
                                                                onClick={browseFiles}
                                                            />
                                                        )}
                                                    </Files>
                                                </div>
                                            </div>
                                        </Loading>
                                    </MDBCol>
                                    <MDBCol size={8}>
                                        <h3>
                                           <Loading loading={loading}>
                                               {' '+user.profileName}<br />
                                           </Loading>
                                        </h3>
                                        <h6>
                                            <Loading loading={loading}>
                                                {` ${user.firstName} ${user.lastName}`}
                                            </Loading>
                                        </h6>
                                        <MDBRow>
                                            <MDBCol sm={6} md={3}>
                                                Followers:{'\u00A0'}
                                                <Loading loading={loading}>
                                                    <MDBBadge style={{fontSize: 14}} color={'red'}>{user.followers}</MDBBadge>
                                                </Loading>
                                            </MDBCol>
                                            <MDBCol sm={6} md={3}>
                                                Following:{'\u00A0'}
                                                <Loading loading={loading}>
                                                    <MDBBadge style={{fontSize: 14}} color={'red'}>{user.following}</MDBBadge>
                                                </Loading>
                                            </MDBCol>
                                        </MDBRow>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol sm={12}>
                        {loading ? null : <PostContainer showCreatePost={isMe} profile={user.id} onlyMe={isMe} />}
                    </MDBCol>
                </MDBRow>
            </MDBContainer>
        );
    }
}

Profile.propTypes = {
    loading: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired
};