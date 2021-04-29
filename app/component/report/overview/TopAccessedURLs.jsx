import React, {useEffect} from "react";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import Typography from "@material-ui/core/Typography";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import {LExpansionPanelSummary} from "../../common/LExpansionPanelSummary";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import TableContainer from "@material-ui/core/TableContainer";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import {LCell} from "../../common/table/LCell";
import TableBody from "@material-ui/core/TableBody";
import Button from "@material-ui/core/Button";
import {ApiClient} from "../../../util/ApiClient";
import {connect} from "react-redux";
import Truncate from "react-truncate-html";
import {Label, LocalEvent} from "../../../Const";
import {SaveURLListOrder} from "../../../reducer/report";
import {useHistory} from "react-router-dom";
import {gotoPage} from "../../layout/LeftMenu";

const TopAccessedURLs = ({dispatch, reportJob}) => {
    const history = useHistory();
    const apiClient = ApiClient();
    const [data, setData] = React.useState([]);
    const [expandedUrls, setExpandedUrls] = React.useState({});
    const reportTestRef = React.useRef(reportJob);

    const getData = () => {
        apiClient.get(`/report/${reportTestRef.current.id}/http/url?page=1&order=-count&rowsPerPage=10`)
            .then(res => res.data ? setData(res.data.slice) : setData([]));
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
        <Box ml="10px" mr="5px" mt="10px">
            <ExpansionPanel defaultExpanded={true}>
                <LExpansionPanelSummary
                    expandIcon={<ExpandMoreIcon/>}
                    id="top-accessed-urls"
                >
                    <Box align="center" width={1}>
                        <Typography variant="subtitle2">
                            Top Accessed URLs
                        </Typography>
                    </Box>
                </LExpansionPanelSummary>
                <ExpansionPanelDetails style={{padding: "5px 20px 15px 20px"}}>
                    <Grid container spacing={0}>
                        <Grid item xs={12}>
                            <TableContainer component={Box}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <LCell>URL</LCell>
                                            <LCell align="right" minwidth="100px">Count</LCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {data.length > 0 ?
                                            data.map((v, idx) =>
                                                <TableRow key={idx}>
                                                    <LCell wb="break-all" bb="0" p="10px 16px 0 16px" onClick={() => {
                                                        setExpandedUrls({...expandedUrls, [v.url]: !expandedUrls[v.url]});
                                                    }}>
                                                        {expandedUrls[v.url] ? v.url : <Truncate lines={1} dangerouslySetInnerHTML={{__html: v.url}}/>}
                                                    </LCell>
                                                    <LCell bb="0" p="10px 16px 0 16px" align="right">{v.count}</LCell>
                                                </TableRow>
                                            ) :
                                            <TableRow>
                                                <LCell colSpan={2} bb="0" align="center">{"No Existing Data"}</LCell>
                                            </TableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                        {data.length > 0 ?
                            <Grid item xs={12}>
                                <Box width={1} align="right" paddingTop="10px">
                                    <Button
                                        variant="outlined" size="small" color="primary"
                                        onClick={() => {
                                            dispatch({
                                                type: SaveURLListOrder,
                                                value: {orderBy: "count", order: "-"},
                                            });
                                            gotoPage(history, dispatch, 30);
                                        }}>
                                        {Label.More}
                                    </Button>
                                </Box>
                            </Grid> : null
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

export default connect(stateToProps)(TopAccessedURLs);
