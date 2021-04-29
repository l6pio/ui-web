import React from "react";
import Grid from "@material-ui/core/Grid";
import HttpThroughput from "../component/report/overview/HttpThroughput";
import MostTimeConsumingURLs from "../component/report/overview/MostTimeConsumingURLs";
import TopAccessedURLs from "../component/report/overview/TopAccessedURLs";
import KeyFactors from "../component/report/overview/KeyFactors";
import HttpMethodAndStatus from "../component/report/overview/HttpMethodAndStatus";
import ReportLayout from "../layout/ReportLayout";

const Overview = () => {
    return (
        <ReportLayout>
            <Grid container>
                <Grid item xs={12}>
                    <HttpThroughput/>
                </Grid>
                <Grid item md={8} sm={7} xs={12}>
                    <MostTimeConsumingURLs/>
                    <TopAccessedURLs/>
                </Grid>
                <Grid item md={4} sm={5} xs={12}>
                    <KeyFactors/>
                    <HttpMethodAndStatus/>
                </Grid>
            </Grid>
        </ReportLayout>
    );
};

export default Overview;
