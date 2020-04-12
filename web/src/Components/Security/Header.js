import {MDBRow} from "mdbreact";
import React from "react";
import PropTypes from 'prop-types';

function Header(props) {
    return (
        <div className="header pt-3 red">
            <MDBRow className="d-flex justify-content-center">
                <h3 className="white-text mb-3 pt-3 font-weight-bold">
                    {props.name}
                </h3>
            </MDBRow>
        </div>
    )
}

Header.propTypes = {
    name: PropTypes.string.isRequired
};

export default Header;