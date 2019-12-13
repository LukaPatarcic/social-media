import React from 'react'

export default class LoginErrorMessage extends React.Component{
    render() {
        return (
            <div>
                <p>{this.props.string}</p>
                <small>{this.props.error}</small>
            </div>

        )
    }
}