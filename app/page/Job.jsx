import React, {useEffect} from "react";
import {connect} from "react-redux";
import {Desc, Label, LocalEvent} from "../Const";
import LTable from "../component/common/table/LTable";
import {isEmpty} from "../util/Lang";
import Paging from "../component/common/table/Paging";
import {ApiClient} from "../util/ApiClient";
import {SaveReportJob} from "../reducer/report";
import DashboardIcon from "@material-ui/icons/Dashboard";
import {useHistory} from "react-router-dom";
import {gotoPage} from "../component/layout/LeftMenu";
import Fab from "@material-ui/core/Fab";
import RefreshIcon from "@material-ui/icons/Refresh";
import {makeStyles} from "@material-ui/core";
import Box from "@material-ui/core/Box";

const useStyles = makeStyles(theme => ({
    fabRoot: {
        marginRight: theme.spacing(0.5)
    },
    fabLabel: {
        paddingRight: theme.spacing(1)
    },
    refreshIcon: {
        padding: theme.spacing(0.5),
        fontSize: 30
    }
}));

const LToolbarBtn = ({text, onClick}) => {
    const classes = useStyles();
    return (
        <Fab
            variant="extended"
            size="small"
            color="secondary"
            classes={{
                root: classes.fabRoot,
                label: classes.fabLabel
            }}
            onClick={onClick}
        >
            <RefreshIcon className={classes.refreshIcon}/>
            {text}
        </Fab>
    );
};

const Job = ({dispatch}) => {
    const history = useHistory();
    const apiClient = ApiClient();
    const [searchQuery, setSearchQuery] = React.useState("");
    const paging = Paging();

    const saveData = data => {
        paging.setData(data.slice.map(v => ({id: v, name: v})));
        paging.setPage(0);
        paging.setPageCount(0);
        paging.setRowsPerPage(15);
    };

    const listJobs = () => {
        if (isEmpty(searchQuery)) {
            apiClient.get("/job").then(res => saveData(res.data));
        } else {
            apiClient.get(`/job/search/${searchQuery}`).then(res => saveData(res.data));
        }
    };

    const viewReport = row => {
        dispatch({
            type: SaveReportJob,
            value: {id: row.id, name: row.name},
        });
        gotoPage(history, dispatch, 20);
    };

    useEffect(() => {
        const fn = query => setSearchQuery(query);
        LocalEvent.on("search query", fn);
        return () => {
            LocalEvent.emit("clear query");
            LocalEvent.removeListener("search query", fn);
        };
    }, []);

    useEffect(() => listJobs(), [paging.trigger, searchQuery]);

    const columns = [
        {
            id: "name",
            label: Label.Name,
        }
    ];

    return (
        <Box m="10px">
            <LTable
                id="job-table"
                title={Label.JobList}
                columns={columns}
                rows={paging.data}
                toolbar={() =>
                    <LToolbarBtn
                        text={Label.Refresh}
                        onClick={() => listJobs()}/>
                }
                actions={[
                    row => (
                        {
                            icon: <DashboardIcon/>,
                            name: Label.Dashboard,
                            onClick: () => viewReport(row),
                        }
                    ),
                ]}
                emptyHint={Desc._00000021}
                paging={paging}
            />
        </Box>
    );
};

export default connect()(Job);
