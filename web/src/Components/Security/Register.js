import React,{createRef,Component} from "react";
import RegisterForm from "./RegisterForm";
import {register} from "../../Api/security";

export default class Register extends Component{

    constructor(props) {
        super(props);
        this.state = {
            error: [],
            loading: false,
            successMessage: ''
        };

        this.submitHandler = this.submitHandler.bind(this);
        this.refistrationFormRef = createRef();

        document.title = 'Allshak | Register';
    }

    submitHandler(data) {
        const {firstName,lastName,profileName,email,password,confirmPassword} = data;

            this.setState({loading: true,error: [],successMessage: ''});

            register({firstName,lastName,profileName,email,'password' :{'first':password,'second':confirmPassword}})
                .then(data => {
                    this.setState({
                        successMessage: 'A verification link has been sent to your email account',
                        error: [],
                        loading: false
                    });
                    this.refistrationFormRef.current.resetForm();
                })
                .catch(err => {
                    err.response.json().then(err => {
                        this.setState({error: err.error,loading:false})
                    })
                })
    };


    render() {

        return (
           <RegisterForm
               ref={this.refistrationFormRef}
               {...this.state}
               onSubmitHandler={this.submitHandler}
           />
        )
    }
}