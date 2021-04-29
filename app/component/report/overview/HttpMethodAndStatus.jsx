import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import {LExpansionPanelSummary} from "../../common/LExpansionPanelSummary";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import React, {Fragment, useEffect} from "react";
import Grid from "@material-ui/core/Grid";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {LCell} from "../../common/table/LCell";
import {connect} from "react-redux";
import {ApiClient} from "../../../util/ApiClient";
import {LocalEvent} from "../../../Const";

const defaultData = {
    loaded: false,
    byMethod: [],
    byStatus: [],
};

const HttpMethodAndStatus = ({reportJob}) => {
    const apiClient = ApiClient();
    const [data, setData] = React.useState(defaultData);
    const reportTestRef = React.useRef(reportJob);

    const getData = () => {
        apiClient.get(`/report/${reportTestRef.current.id}/http/method-and-status`).then(res => res.data ?
            setData({
                loaded: true,
                byMethod: res.data.byMethod,
                byStatus: res.data.byStatus,
            }) :
            setData(defaultData)
        );
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
                <LExpansionPanelSummary id="http-info" expandIcon={<ExpandMoreIcon/>}>
                    <Box align="center" width={1}>
                        <Typography variant="subtitle2">
                            Http Method & Status
                        </Typography>
                    </Box>
                </LExpansionPanelSummary>
                <ExpansionPanelDetails style={{padding: "5px 20px 15px 20px"}}>
                    <Grid container spacing={0}>
                        {data.loaded ?
                            <Fragment>
                                <Grid item xs={12}>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <LCell>Method</LCell>
                                                <LCell align="right">Count</LCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.byMethod.map((v, idx) =>
                                                <TableRow key={idx}>
                                                    <LCell bb="0">{v.method}</LCell>
                                                    <LCell bb="0" align="right">{v.count}</LCell>
                                                </TableRow>
                                            )}
                                        </TableBody>
                                    </Table>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <LCell>Status</LCell>
                                                <LCell align="right">Count</LCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {data.byStatus.map((v, idx) =>
                                                <TableRow key={idx}>
                                                    <LCell bb="0">{v.status}</LCell>
                                                    <LCell bb="0" align="right">{v.count}</LCell>
                                                </TableRow>
                                            )}
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

export default connect(stateToProps)(HttpMethodAndStatus);
