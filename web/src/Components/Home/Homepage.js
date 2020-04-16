import React,{Component} from "react";
import {MDBContainer} from "mdbreact";
import Banner from "./Banner";
import About from "./About";
import Contact from "./Contact";
import './Home.css'
import {AuthContext} from "../../Contexts/AuthContext";
import PostCreate from "../Post/PostCreate";
import PostContainer from "../Post/PostContainer";

export default class Homepage extends Component{
    static contextType = AuthContext;

    constructor(props) {
        super(props);
    }

    render() {
        const {authenticated} = this.context;
        document.title = authenticated ? 'Allshack' : 'Welcome to Allshack';

        return (
            <MDBContainer className={authenticated ? null : 'text-center pt-5'}>
                {authenticated ?
                    <PostContainer />
                :
                    <>
                        <Banner/>
                        <About/>
                        <Contact/>
                    </>
                }
            </MDBContainer>
        );
    }

}