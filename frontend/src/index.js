import React from 'react';
import ReactDOM from 'react-dom';
import './css/style.css'
import Register from "./Components/Register";
import Notfound from "./Components/Notfound";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import Profile from "./Components/Profile/Profile";
import Login from "./Components/Login/Login"
import LoginFacebook from "./Components/Login/LoginFacebook";
import WS from "./Components/WebSocketConnection";


const routing = (
    <Router>
        <Switch>
            <Route path="/register" component={Register} />
            <Route path="/profile" component={Profile} />
            <Route path="/ws" component={WS} />
            <Route path="/login" component={Login}/>
            <Route path="/login/facebook" component={LoginFacebook} />
            <Route component={Notfound} />
        </Switch>
    </Router>
);

ReactDOM.render(routing, document.getElementById('root'));