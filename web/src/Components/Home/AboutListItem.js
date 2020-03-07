import * as React from "react";
import {MDBCol, MDBRow} from "mdbreact";
import PropTypes from 'prop-types';

export default class AboutListItem extends React.Component{
    constructor(props) {
        super(props);

    }

    render() {
        return (
            <MDBRow>
                <MDBCol size={1} className="mr-3">
                    <i className={'fa-2x ' + this.props.icon + ' ' + this.props.iconColor}></i>
                </MDBCol>
                <MDBCol size={10}>
                    <h5 className="feature-title text-danger">{this.props.title}</h5>
                    <p className="grey-text">{this.props.description}</p>
                </MDBCol>
            </MDBRow>
        );
    }
}

AboutListItem.propTypes = {
    icon: PropTypes.string,
    iconColor: PropTypes.string,
    title: PropTypes.string,
    description: PropTypes.string
};