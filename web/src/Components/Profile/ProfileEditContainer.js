import React,{Component} from "react";
import ProfileEdit from "./ProfileEdit";
import {editUser} from "../../Api/editUser";
import ls from "local-storage";

export default class ProfileEditContainer extends Component{

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            error: []
        }
        this.submitHandler = this.submitHandler.bind(this);
    }


    submitHandler(data) {
        const user = {'firstName': data.firstName, 'lastName': data.lastName,'profileName': data.profileName,'email': data.email};
        this.setState({loading: true})
        editUser(data)
            .then(data => {
                ls.set('user',user);
                this.setState({loading: false})
            })
            .catch(err => err.response.json().then(error => {
                this.setState({loading: false, error: error.error})
            }))
    }


    render() {
        return (
            <ProfileEdit
                {...this.state}
                onSubmitHandler={this.submitHandler}
            />
        )
    }
}