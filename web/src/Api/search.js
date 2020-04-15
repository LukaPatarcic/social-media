import {fetchJson} from "./index";

export const searchForUsers = () => {
    return fetchJson('/auth',{},true)
};
