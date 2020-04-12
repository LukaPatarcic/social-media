import {fetchJson} from "./index";

export const contact = (data) => {
    return fetchJson('/contact',{
        method: 'POST',
        body: JSON.stringify({...data})
    })
};