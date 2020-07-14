import React,{Component} from "react";
import Profile from "./Profile";
import {getUserData} from "../../Api/profile";
import ImageCompression from "../../Helpers/ImageCompression";
import {editUserPicture} from "../../Api/editUser";
import toastr from 'toastr'

export default class ProfileContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            loading: true,
            file: [],
            error: [],
            uploadingImage: false,
            croppedImage: null,
            modal: false
        };

        this.getData = this.getData.bind(this);
        this.toggle = this.toggle.bind(this);
        this.saveChanges = this.saveChanges.bind(this);
        this.chooseFile = this.chooseFile.bind(this);
        this.imageErrorHandler = this.imageErrorHandler.bind(this);
        this.cropper = React.createRef(null);
        this.imageCompresssion = new ImageCompression();
    }

    getData(profileName) {
        this.setState({loading: true})
        getUserData(profileName)
            .then(response => {
                this.setState({
                    user: response,
                    loading: false
                })
            })
            .catch(err => err.response.json().then(err => {
                toastr.error(err.error);
                this.setState({loading: false})
            }))
    }

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        if(nextProps.match.params.profileName !== this.props.match.params.profileName) {
            this.getData(nextProps.match.params.profileName);
            return true;
        }
        return  nextState !== this.state;
    }

    componentDidMount() {
        const profileName = this.props.match.params.profileName;
        document.title = `Allshack | ${profileName}`
           this.getData(this.props.match.params.profileName)

    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        })
    }

    chooseFile(file) {
        this.setState({ file,error: [] })
        this.toggle()
    }

    imageErrorHandler(error) {
        this.setState({
            error
        })
    }

    saveChanges() {
        this.toggle();
        this.setState((prevState) => {
            prevState.file[0].src.base64 = this.cropper.current.getCroppedCanvas().toDataURL();
            return {
                file: prevState.file,
                error: [],
                uploadingImage: true,
                croppedImage: null,
                imageToEdit: null,
                imageToEditId: null,
            }
        }, () => {
            const img = this.imageCompresssion.compressImages(this.state.file[0],100,100);
            img.then(data => {
                ImageCompression.getBase64(data)
                    .then(base64 => {
                        this.setState((prevState) => {
                            prevState.file.map((img, index) => {
                                img.src.base64 = base64;
                                return img;
                            })
                            return {file: prevState.file}
                        })
                    })
                    .finally(() => {
                        editUserPicture(this.state.file[0].src.base64)
                            .then(data => {
                               this.setState({
                                   uploadingImage: false
                               })
                                toastr.success('Profile picture changed')
                            })
                            .catch(err => err.response.json().then(err => {
                                this.setState({
                                    uploadingImage: false
                                })
                                toastr.error('Oops there was an error. Please try again later')
                            }))
                    })
            })
        });
    }


    render() {
        return (
            <Profile
                {...this.props}
                {...this.state}
                onToggle={this.toggle}
                onSaveChanges={this.saveChanges}
                cropper={this.cropper}
                onChooseFile={this.chooseFile}
                onImageErrorHandler={this.imageErrorHandler}
            />
        )
    }
}