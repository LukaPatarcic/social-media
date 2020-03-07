import React,{createContext} from "react";
import {BASE_URL} from "../Config";
import cookie from 'react-cookies'

export const AuthContext = createContext();

export default class AuthContextProvider extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false
        }

    }

    componentDidMount() {
        if(cookie.load('access-token')) {
            this.authenticateUser();
        }
    }

    authenticateUser = () => {
        fetch(BASE_URL + '/auth', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookie.load('access-token')
            }
        })
            .then(response => response.json())
            .then(data => {
                this.setState({
                    authenticated: !!data.success
                })
                if(typeof data.success === 'undefined') {
                    cookie.remove('access-token')
                }
            })
            .catch(err => {
                cookie.remove('access-token')
            })
    }

    setAuthenticated = (authenticated = true) => {
        this.setState({authenticated: authenticated})
    }

    render() {
        return (
            <AuthContext.Provider value={{...this.state, authenticateUser: this.authenticateUser, setAuthenticated: this.setAuthenticated}}>
                {this.props.children}
            </AuthContext.Provider>
        )
    }

}