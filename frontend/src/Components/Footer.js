import * as React from "react";
import {MDBCol, MDBContainer, MDBFooter, MDBInput, MDBRow} from "mdbreact";
import SimpleReactValidator from "simple-react-validator";

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
            <MDBFooter color="blue" className="font-small pt-4 mt-4">
                <MDBContainer fluid className="text-center text-md-left">
                    <MDBRow>
                        <MDBCol md="6">
                            <h5 className="title">Allshak</h5>
                            <p>
                                Get links to our social media and other
                            </p>
                            <form noValidate onSubmit={this.submitHandler}>
                                <MDBInput
                                    value={this.state.emailNewsletter}
                                    name="emailNewsletter"
                                    onChange={this.changeHandler}
                                    label="Email"
                                    icon="at"
                                    group
                                    type='email'
                                />
                                <small>{this.validator.message('emailNewsletter', this.state.emailNewsletter, 'required|email|max:255')}</small>
                            </form>
                        </MDBCol>
                        <MDBCol md="6">
                            <h5 className="title">Links</h5>
                            <ul>
                                <li className="list-unstyled">
                                    <a href="#!">Link 1</a>
                                </li>
                                <li className="list-unstyled">
                                    <a href="#!">Link 2</a>
                                </li>
                                <li className="list-unstyled">
                                    <a href="#!">Link 3</a>
                                </li>
                                <li className="list-unstyled">
                                    <a href="#!">Link 4</a>
                                </li>
                            </ul>
                        </MDBCol>
                    </MDBRow>
                </MDBContainer>
                <div className="footer-copyright text-center py-3">
                    <MDBContainer fluid>
                        &copy; {new Date().getFullYear()} Copyright: <a href="https://www.MDBootstrap.com"> Lukaku Tech </a>
                    </MDBContainer>
                </div>
            </MDBFooter>
        );
    }
}