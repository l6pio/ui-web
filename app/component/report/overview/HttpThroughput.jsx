import React from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {LExpansionPanelSummary} from "../../common/LExpansionPanelSummary";
import TimelineChart from "../../chart/http/TimelineChart";
import {Label} from "../../../Const";

const HttpThroughput = () => {
    return (
        <Box ml="10px" mr="10px">
            <ExpansionPanel defaultExpanded={true}>
                <LExpansionPanelSummary id="http-throughput-chart" expandIcon={<ExpandMoreIcon/>}>
                    <Box align="center" width={1}>
                        <Typography variant="subtitle2">{Label.HttpThroughput}</Typography>
                    </Box>
                </LExpansionPanelSummary>
                <ExpansionPanelDetails style={{padding: "0 10px 10px 10px"}}>
                    <TimelineChart/>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Box>
    );
};

export default HttpThroughput;
