import React, {Fragment, useEffect} from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Grid from "@material-ui/core/Grid";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Table from "@material-ui/core/Table";
import TableRow from "@material-ui/core/TableRow";
import {LExpansionPanelSummary} from "../../common/LExpansionPanelSummary";
import {TableBody} from "@material-ui/core";
import {LCell} from "../../common/table/LCell";
import {ApiClient} from "../../../util/ApiClient";
import {Label, LocalEvent} from "../../../Const";
import {connect} from "react-redux";
import ms from "pretty-ms";

const defaultData = {
    loaded: false,
    maxRpm: 0,
    avgRpm: 0,
    httpCount: 0,
    httpFailed: 0,
};

const KeyFactors = ({reportJob}) => {
    const apiClient = ApiClient();
    const [data, setData] = React.useState(defaultData);
    const reportTestRef = React.useRef(reportJob);

    const getData = () => {
        apiClient.get(`/report/${reportTestRef.current.id}/http/key-factors`).then(res => {
            if (res.data) {
                console.log(">>>", res.data);
                setData({...res.data, loaded: true});
            } else {
                setData(defaultData);
            }
        });
    };

    useEffect(() => {
        reportTestRef.current = reportJob;
        getData();
    }, [reportJob]);

    useEffect(() => {
        const fn = () => getData();
        LocalEvent.on("refresh report data", fn);
        return () => {
            LocalEvent.removeListener("refresh report data", fn);
        };
    }, []);

    return (
        <Box ml="5px" mr="10px" mt="10px">
            <ExpansionPanel defaultExpanded={true}>
                <LExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    id="key-factors"
                >
                    <Box align="center" width={1}>
                        <Typography variant="subtitle2">
                            Key Factors
                        </Typography>
                    </Box>
                </LExpansionPanelSummary>
                <ExpansionPanelDetails style={{padding: "5px 20px 15px 20px"}}>
                    <Grid container spacing={0}>
                        {data.loaded ?
                            <Fragment>
                                <Grid item xs={12}>
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <LCell bb="0" p="0" width="150px">
                                                    <Typography variant="subtitle2">{Label.MaximumRpm}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="0" align="right">{data.maxRpm}</LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.AverageRpm}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 0 0" align="right">{data.avgRpm}</LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.HttpRequests}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 0 0" align="right">{data.httpCount}</LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.HttpFailure}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 0 0" align="right">
                                                    {Math.round(data.httpFailed / data.httpCount * 10000) / 100}%
                                                </LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.P90}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 0 0" align="right">{ms(data.p90)}</LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.P75}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 0 0" align="right">{ms(data.p75)}</LCell>
                                            </TableRow>
                                            <TableRow>
                                                <LCell bb="0" p="6px 0 12px 0" width="150px">
                                                    <Typography variant="subtitle2">{Label.P50}:</Typography>
                                                </LCell>
                                                <LCell bb="0" p="6px 0 12px 0" align="right">{ms(data.p50)}</LCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Fragment>
                            :
                            <Grid item xs={12}>
                                <Table>
                                    <TableBody>
                                        <TableRow>
                                            <LCell bb="0" p="0" align="center">{"No Existing Data"}</LCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        }
                    </Grid>
                </ExpansionPanelDetails>
            </ExpansionPanel>
        </Box>
    );
};

const stateToProps = (state) => ({
    reportJob: state.reportJob,
});

export default connect(stateToProps)(KeyFactors);
