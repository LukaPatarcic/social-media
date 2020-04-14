import React,{Component} from "react";
import Profile from "./Profile";

export default class ProfileContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            following: [],
            followers: [],
            posts: [],
            loading: true
        };

        document.title = 'Allshack | Profile'
    }

    componentDidMount() {
        const profileName = this.props.match.params.profileName;
        // fetch(BASE_URL+'/user',{
        //     headers: {
        //         'Accept': 'application/json',
        //         'Content-Type': 'application/json',
        //         'Authorization': 'Bearer ' + cookie.load('access-token')
        //     },
        //     method: "GET"
        // })
        //     .then((response => response.json()))
        //     .then((data => {
        //         this.setState({userData: data,loading: false});
        //     }))
        //     .catch(err => {
        //     })
        setTimeout(() => {
            this.setState({
                "user": {
                    "id": 24,
                    "firstName": "Luka",
                    "lastName": "Patarcic",
                    "profileName": "Khallion",
                    "followerCount": 1,
                    "followingCount": 2
                },
                "followers": [
                    {
                        "id": 27,
                        "firstName": "Branislav",
                        "lastName": "Velicanstveni",
                        "profileName": "BranislavVelicanstve"
                    }
                ],
                "following": [
                    {
                        "id": 9,
                        "firstName": "Tatjana",
                        "lastName": "Ivosevic",
                        "profileName": "MissIT"
                    },
                    {
                        "id": 27,
                        "firstName": "Branislav",
                        "lastName": "Velicanstveni",
                        "profileName": "BranislavVelicanstve"
                    }
                ],
                loading: false
            })
        },300)
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