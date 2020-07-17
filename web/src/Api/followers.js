import {fetchJson} from "./index";

export const getUsers = (url) => {
    return fetchJson(url,{},true)
}