import React,{Component} from "react";
import Profile from "./Profile";
import toastr from 'toastr/build/toastr.min'
import {getUserData} from "../../Api/profile";

export default class ProfileContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            loading: true
        };

        this.getData = this.getData.bind(this);
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


    render() {
        return (
            <Profile
                {...this.props}
                {...this.state}
            />
        )
    }
}