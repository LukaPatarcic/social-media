import * as React from "react";
import {MDBBtn, MDBCol, MDBContainer, MDBFooter, MDBInput, MDBRow} from "mdbreact";
import SimpleReactValidator from "simple-react-validator";
import {Link} from "react-router-dom";

export default class Footer extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            emailNewsletter: ''
        }
        this.validator = new SimpleReactValidator();
    }


    submitHandler = event => {
        event.preventDefault();
        if (this.validator.allValid()) {
            alert('You submitted the form and stuff!');
        } else {
            this.validator.showMessages();
            // rerender to show messages for the first time
            // you can use the autoForceUpdate option to do this automatically`
            this.forceUpdate();
        }
    };

    changeHandler = event => {
        this.setState({ [event.target.name]: event.target.value});
    };

    render() {
        return (
            <MDBFooter color="grey" className="font-small pt-4 mt-5">
                <MDBContainer fluid className="text-center text-md-left">
                    <MDBRow>
                        <MDBCol md="6">
                            <h5 className="title">Allshak</h5>
                            <p>
                                Get links to our social media and other
                            </p>
                            <form noValidate onSubmit={this.submitHandler}>
                                <MDBRow>
                                    <MDBCol md={6}>
                                        <MDBInput
                                            value={this.state.emailNewsletter}
                                            name="emailNewsletter"
                                            onChange={this.changeHandler}
                                            label="Newsletter Email"
                                            group
                                            type='email'
                                        />
                                        <small>{this.validator.message('emailNewsletter', this.state.emailNewsletter, 'required|email|max:255')}</small>
                                    </MDBCol>
                                    <MDBCol md={6}>
                                        <MDBBtn size={'sm'} outline color={'elegant'} style={{marginTop: 42}}>Subscribe</MDBBtn>
                                    </MDBCol>
                                </MDBRow>
                            </form>
                        </MDBCol>
                        <MDBCol md="3" className={'text-center'}>
                            <h5 className="title text-center">Links</h5>
                            <ul className={'pl-0'}>
                                <li className="list-unstyled">
                                    <Link to={'/'}>Home</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/about'}>About</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/contact'}>Contact</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/register'}>Register</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/login'}>Login</Link>
                                </li>
                            </ul>
                        </MDBCol>
                        <MDBCol md="3">
                            <h5 className="title">Social Media</h5>
                            <ul className={'pl-0'}>
                                <li className="list-unstyled">
                                    <Link to={'/'}>Facebook</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/about'}>Instagram</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/contact'}>Twitter</Link>
                                </li>
                                <li className="list-unstyled">
                                    <Link to={'/register'}>YouTube</Link>
                                </li>
                            </ul>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: <a href="https://lukaku.tech"> Lukaku Tech </a>
                    </MDBContainer>
                </div>
            </MDBFooter>
        );
    }
}