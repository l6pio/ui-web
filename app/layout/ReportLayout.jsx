import React, {Fragment, useEffect} from "react";
import {connect} from "react-redux";
import {LocalEvent} from "../Const";
import {isEmpty, useInterval} from "../util/Lang";
import {ApiClient} from "../util/ApiClient";
import {SaveReportJob} from "../reducer/report";

const ReportLayout = ({dispatch, children, reportJob}) => {
    const apiClient = ApiClient();

    const searchJobs = query => {
        apiClient.get(`/job/search/${query}?page=1&order=-lastUpdate`)
            .then(res => {
                let data = res.data.slice.map(v => ({id: v.id, name: v.name}));
                if (data.length === 1) {
                    dispatch({
                        type: SaveReportJob,
                        value: data[0],
                    });
                } else if (data.length > 1) {
                    LocalEvent.emit("search menu items", data);
                }
            });
    };

    useEffect(() => {
        const showTestNameOnSearchBar = () => LocalEvent.emit("set query text", reportJob.name);

        const onSearchQuery = query => !isEmpty(query) && searchJobs(query);
        const onSearchMenuSelected = data => {
            dispatch({
                type: SaveReportJob,
                value: data,
            });
        };

        showTestNameOnSearchBar();
        LocalEvent.on("search bar mounted", showTestNameOnSearchBar);
        LocalEvent.on("search query", onSearchQuery);
        LocalEvent.on("search menu selected", onSearchMenuSelected);
        return () => {
            LocalEvent.emit("clear query");
            LocalEvent.removeListener("search query", onSearchQuery);
            LocalEvent.removeListener("search bar mounted", onSearchQuery);
        };
    }, []);

    useInterval(() => LocalEvent.emit("refresh report data"), 15000);

    return <Fragment>{children}</Fragment>;
};

const stateToProps = (state) => ({
    reportJob: state.reportJob,
});

export default connect(stateToProps)(ReportLayout);
