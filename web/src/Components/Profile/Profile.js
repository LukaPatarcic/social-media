import * as React from "react";
import {
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
import Files from "react-butterfiles";
import Cropper from "react-cropper";
import toastr from 'toastr'
import FollowContainer from "./FollowContainer";

export default class Profile extends React.Component{

    render() {
        const {loading,user,file,error,uploadingImage,modal,onToggle,onSaveChanges,cropper,onChooseFile,onImageErrorHandler} = this.props;
        const isMe = ls.get('user').profileName === user.profileName
        error.map((err,index) => (
            toastr.error(err.type)
        ))
        return (
            <MDBContainer>
                <MDBModal isOpen={modal} toggle={onToggle}>
                    <MDBModalHeader toggle={onToggle}>Resize image</MDBModalHeader>
                    <MDBModalBody>
                        <Cropper
                            ref={cropper}
                            src={file.length > 0 ? file[0].src.base64 : ''}
                            style={{height: 400, width: '100%'}}
                            aspectRatio={1}
                            viewMode={1}
                            dragMode={'move'}
                            guides={true}
                        />
                    </MDBModalBody>
                    <MDBModalFooter>
                        <MDBBtn color="grey" onClick={onToggle}>Close</MDBBtn>
                        <MDBBtn color="danger" onClick={onSaveChanges}>Save changes</MDBBtn>
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
                                        <Loading loading={loading || uploadingImage}>
                                            <div className={isMe ?'image-wrap': {}}>
                                                <img
                                                    alt={''}
                                                    className={isMe ? 'img-fluid menu-image rounded-circle' : 'img-fluid rounded-circle'}
                                                    src={
                                                        file.length > 0 ?
                                                            file[0].src.base64 :
                                                            user.profilePicture ? user.profilePicture :
                                                            setProfilePicture(user.firstName,user.lastName,128)
                                                    }
                                                />
                                                {isMe &&
                                                <div className={'overlay overlay-rounded'}>
                                                    <Files
                                                        multiple={false}
                                                        maxSize="10mb"
                                                        accept={["image/jpeg","image/png","image/gif"]}
                                                        onSuccess={file => {
                                                            onChooseFile(file);
                                                        }}
                                                        onError={error => {
                                                            onImageErrorHandler(error)
                                                        }}
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
                                                }
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
                                            {loading ? null : <FollowContainer loading={loading} followers={user.followers} following={user.following} profileId={user.id} />}
                                        </MDBRow>
                                    </MDBCol>
                                </MDBRow>
                            </MDBCardBody>
                        </MDBCard>
                    </MDBCol>
                </MDBRow>
                <MDBRow>
                    <MDBCol sm={12}>
                        {loading ? null : <PostContainer showCreatePost={isMe} profile={user.profileName} onlyMe={isMe} />}
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