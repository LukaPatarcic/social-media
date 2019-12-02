import * as React from "react";
import WS from 'reactjs-autobahn';
import * as AutobahnReact from "jest-worker";

export default class WebSocketConnection extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            socketState: "",
            socketErorState: ""
        };
        this.send = this.send.bind(this);
        console.log(WS);
        AutobahnReact.initialize('ws://127.0.0.1:8000/ws', 'realm');
    }

    componentDidMount() {
        // Callback called whenever the connection is lost
        AutobahnReact.Connection.onLost((details) => {
            console.log("Connection lost :/!");
        });
        // Callback called whenever the connection is ready
        AutobahnReact.Connection.onReady((details) => {
            console.log("Connection established!");
        });
        // This function initialize and establish an anonymous connection to the router, it returns a promise which resolve when the connection is established and reject if the connection is never established.
        AutobahnReact.browserInitialize(8000, 'ws', 'realm1');
        });

    }

    send() {
        this.ws.send('asd');
    }

    render(){
        return(
            <div>
                <button onClick={this.send}>Send</button>
                <div>Socket Success State: {this.setState.socketState}</div>
                <div>Socket Error State: {this.setState.socketErorState}</div>
            </div>
            )

    }
}