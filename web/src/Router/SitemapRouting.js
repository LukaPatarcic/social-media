import React from 'react'
import {Route} from 'react-router'
import {LOGIN_URL, REGISTER_URL} from "../Config";

export default (
    <Route>
        <Route  path={REGISTER_URL} />
        <Route  path={LOGIN_URL} />
        <Route  path="/logout" />
        {/* LEGAL */}
        <Route  path="/legal/cookie" />
        <Route  path="/legal/privacy" />
        <Route  path="/legal/tos"  />
        {/* USER */}
        <Route  path="/" />
        <Route  path="/profile/edit" />
        <Route  path="/profile/:profileName" />
        <Route  path="/notification/list" />
        {/* NOT FOUND */}
        <Route path={'/notfound'} />
        <Route />
    </Route>
)