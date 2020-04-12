import * as React from "react";
import toastr from 'toastr/build/toastr.min'
import 'toastr/build/toastr.min.css'
import ContactForm from "./ContactForm";
import {contact} from "../../Api/contact";
import {createRef} from "react";

export default class About extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        };


        this.submitHandler = this.submitHandler.bind(this);
        this.contactFormRef = createRef();

    }

    submitHandler(data) {
            this.setState({loading: true});
            contact(data)
                .then(response => {
                    toastr.success(response.success);
                    this.setState({loading:false});
                    this.contactFormRef.current.resetForm()
                })
                .catch(err => err.response.json().then(err => {
                    toastr.error(err.error);
                    this.setState({loading:false})
                }))
    }

    render() {
        const {loading} = this.state;

        return (
           <ContactForm
               ref={this.contactFormRef}
               loading={loading}
               onSubmitHandler={this.submitHandler}
           />
        );
    }

}