import {fetchJson} from "./index";

export const authenticateUser = () => {
    return fetchJson('/auth',{},true)
};

export const login = (email,password) => {
    return fetchJson('/login',{
        method: 'POST',
        body: JSON.stringify({email,password})
    },false)
};

export const register = (data) => {
    return fetchJson('/register',{
        method: 'POST',
        body: JSON.stringify({...data})
    })
};