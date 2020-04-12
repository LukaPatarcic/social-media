import React,{createContext,Component} from "react";
import cookie from 'react-cookies'
import {authenticateUser} from "../Api/security";

export const AuthContext = createContext(true);

export default class AuthContextProvider extends Component{
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            token: null
        };

        this.checkCredentials = this.checkCredentials.bind(this);
        this.setAuthenticated = this.setAuthenticated.bind(this);

    }

    componentDidMount() {
        const token = cookie.load('access-token');
        if(token) {
            this.setState({token: token,authenticated: true})
            this.checkCredentials()
        }
    }

    checkCredentials() {
        authenticateUser()
            .then(data => this.setState({authenticated: true}))
            .catch(err => {
                cookie.remove('access-token');
                this.setState({authenticated: false})
            })
    }

    setAuthenticated = (authenticated = true) => {
        this.setState({authenticated})
    };

    render() {
        return (
            <AuthContext.Provider value={{
                ...this.state,
                checkCredentials: this.checkCredentials,
                setAuthenticated: this.setAuthenticated
            }}
            >
                {this.props.children}
            </AuthContext.Provider>
        )
    }

}