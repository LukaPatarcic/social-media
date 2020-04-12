import {BASE_URL} from "../Config";
import cookie from "react-cookies";

export const fetchJson = (url, options,token = false) => {

    let headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };

    if (options && options.headers) {
        headers = {...options.headers, ...headers};
        delete options.headers;
    }


    if(token) {
        headers = {
            ...headers,
            'Authorization': 'Bearer ' +  cookie.load('access-token')
        }
    }

    return fetch(BASE_URL+url, Object.assign({
        headers: headers,
    }, options))
        .then(checkStatus)
        .then(response => {

            // decode JSON, but avoid problems with empty responses
            return response.text()
                .then(text => text ? JSON.parse(text) : '')
        });
}

function checkStatus(response) {
    if (response.status >= 200 && response.status < 400) {
        return response;
    }

    const error = new Error(response.statusText);
    error.response = response;

    throw error
}
