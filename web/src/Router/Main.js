import * as React from "react";
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navigation from "../Components/Navigation";
import Login from "../Screens/Login";
import Register from "../Screens/Register";
import Logout from "../Components/Logout";
import Footer from "../Components/Footer";
import Homepage from "../Screens/Homepage";

export default class Main extends React.Component{

    constructor(props) {
        super(props);

    }

    render() {

        return (
            <Router>
                <Navigation/>
                <Switch>
                    <Route exact={true} path="/login" component={Login}/>
                    <Route exact={true} path="/register" component={Register}/>
                    <Route exact={true} path="/logout" component={Logout}/>
                    <Route exact={true} path="/" component={Homepage} />
                </Switch>
                <Footer/>
            </Router>
        );
    }
}