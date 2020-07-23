import React from 'react';
import socketIOClient from "socket.io-client";
import {WS_URL} from "../config";
import {AsyncStorage} from "react-native";
export const WebsocketContext = React.createContext({ io: null });

export class WebsocketProvider extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            id: null,
            io: null
        }
    }


    componentDidMount() {
        AsyncStorage.getItem("id")
            .then(id => {
                this.setState({
                    id: id
                },() => {
                    console.log(id);
                    this.setState({
                        io: socketIOClient.connect(WS_URL,{query: `id=${this.state.id}`})
                    })
                })
            })
            .finally(() => {
                this.state.io.on("message", (response) => {
                    console.log(response);
                })
            })

    }

    onMessage(message) {
        this.state.io.emit("message",message);
    }


    render() {
        return (
            <WebsocketContext.Provider value={{io: this.state.io}}>
                {this.props.children}
            </WebsocketContext.Provider>
        );
    }
}