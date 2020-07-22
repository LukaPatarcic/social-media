import React from 'react';
import AsyncStorage from '@react-native-community/async-storage'
import {BASE_URL} from "../config";

export const AuthContext = React.createContext({ isAuth: false,token: null,isLoading: true });

export class AuthProvider extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            token: null,
            isLoading: true
        };

        this.setIsAuth = this.setIsAuth.bind(this);
        this.authenticateUser = this.authenticateUser.bind(this);
    }

    setIsAuth() {
        this.setState({isAuth: !this.state.isAuth})
    }


    componentDidMount() {
        this.authenticateUser();
    }

    authenticateUser() {
        this.setState({isLoading:true});
        AsyncStorage.getItem('access-token')
            .then(data => {
                if(data) {
                    this.setState({token: data})
                }
            })
            .catch(err => {
                AsyncStorage.removeItem('access-token');
            })
            .done(() => {
                // AsyncStorage.clear();
                fetch(BASE_URL+'/auth',{
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + this.state.token
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                        this.setState({isLoading:false});
                        if(data.error === 'Authentication Required' || data.error === 'Invalid JWT Token') {
                            this.setState({isAuth:false})
                        } else {
                            console.log(data.id.toString());
                            AsyncStorage.setItem("id",data.id.toString())
                            this.setState({isAuth:true})
                        }
                    })
                    .catch(err => {
                        this.setState({isLoading:false});
                    })
            });
    }

    render() {
        return (
            <AuthContext.Provider value={{state: this.state,setIsAuth: this.setIsAuth}}>
                {this.props.children}
            </AuthContext.Provider>
        );
    }
}