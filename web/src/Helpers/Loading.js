import React,{Component} from "react";
import {ClipLoader} from "react-spinners";
import PropTypes from 'prop-types';

export default class Loading extends Component {
    render() {
        const {loading,color,size} = this.props;
        return (
            <>
            {loading ?
                <ClipLoader
                    sizeUnit={"px"}
                    size={size}
                    color={color}
                    loading={loading}
                />
                :
                this.props.children
            }
            </>
        );
    }

    static defaultProps = {
        color: '#f00',
        size: 20
    }
}

Loading.propTypes = {
    loading: PropTypes.bool.isRequired,
    size: PropTypes.number,
    color: PropTypes.string
}