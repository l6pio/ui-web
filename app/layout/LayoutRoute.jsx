import React from "react";
import {Route} from "react-router-dom";
import Layout from "./Layout";
import {connect} from "react-redux";

const LayoutRoute = ({component: Component, ...rest}) => {
    return (
        <Route {...rest} render={matchProps => (
            <Layout>
                <Component {...matchProps} />
            </Layout>
        )}/>
    );
};

export default connect()(LayoutRoute);
