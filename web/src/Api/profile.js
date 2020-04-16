import {fetchJson} from "./index";

export const getUserData = (profileName) => {
    return fetchJson(`/user?profileName=${profileName}`,{},true)
};