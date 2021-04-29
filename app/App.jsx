import React from "react";
import {BrowserRouter, Switch} from "react-router-dom";
import LayoutRoute from "./layout/LayoutRoute";
import Job from "./page/Job";
import Overview from "./page/Overview";
import URL from "./page/URL";

const App = () => {
    return (
        <BrowserRouter>
            <Switch>
                <LayoutRoute exact path="/" component={Job}/>
                <LayoutRoute exact path="/overview" component={Overview}/>
                <LayoutRoute exact path="/url" component={URL}/>
            </Switch>
        </BrowserRouter>
    );
};

export default App;
