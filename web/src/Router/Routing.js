import * as React from "react";
import {BrowserRouter as Router, Link, Route, Switch} from 'react-router-dom';
import Navigation from "../Components/Include/Navigation";
import Login from "../Components/Security/Login";
import Register from "../Components/Security/Register";
import Logout from "../Components/Security/Logout";
import Footer from "../Components/Include/Footer";
import Homepage from "../Components/Home/Homepage";
import CookiePolicy from "../Components/Legal/CookiePolicy";
import TermsOfService from "../Components/Legal/TermsOfService";
import PrivacyPolicy from "../Components/Legal/PrivacyPolicy";
import {setBackground} from "../Helpers";
import Profile from "../Components/Profile/Profile";
import NotificationList from "../Components/Notification/NotificationList";
import FriendProfile from "../Components/Profile/FriendProfile";
import Notfound from "../Components/Error/Notfound";
import MobileAppModal from "../Components/Mobile/MobileAppModal";
import CookieConsent from "react-cookie-consent";
import {LOGIN_URL, REGISTER_URL} from "../Config";
import ProfileContainer from "../Components/Profile/ProfileContainer";
import ProfileEdit from "../Components/Profile/ProfileEdit";

export default class Routing extends React.Component{

    constructor(props) {
        super(props);
        setBackground();
    }

    render() {

        return (
            <Router>
                <Navigation search={this.props.search}/>
                <Switch>
                    {/* SECURITY */}
                    <Route exact={true} path={REGISTER_URL} component={Register}/>
                    <Route exact={true} path={LOGIN_URL} component={Login}/>
                    <Route exact={true} path="/logout" component={Logout}/>
                    {/* LEGAL */}
                    <Route exact={true} path="/legal/cookie" component={CookiePolicy} />
                    <Route exact={true} path="/legal/privacy" component={PrivacyPolicy} />
                    <Route exact={true} path="/legal/tos" component={TermsOfService} />
                    {/* USER */}
                    <Route exact={true} path="/" component={Homepage}/>
                    <Route exact={true} path="/profile/edit" component={ProfileEdit} />
                    <Route exact={true} path="/profile/:username" component={FriendProfile}/>
                    <Route exact={true} path="/notification/list" component={NotificationList} />
                    <Route exact={true} path="/profile" component={ProfileContainer} />
                    {/* NOT FOUND */}
                    <Route exact={true} path="/notFound" component={Notfound} />
                </Switch>
                <MobileAppModal />
                <CookieConsent
                    style={{ background: "#d9d9d9",color: '#2a2a2a' }}
                    buttonStyle={{ color: "#fff", backgroundColor: '#f00', marginRight: 30}}
                >
                    By using our site, you acknowledge that you have read and understand our
                    <Link to={'/legal/cookie'}> Cookie Policy</Link>,
                    <Link to={'/legal/privacy'}> Privacy Policy</Link>,
                    and our <Link to={'/legal/tos'}> Terms of Service</Link>.
                </CookieConsent>
                <Footer/>
            </Router>
        );
    }
}