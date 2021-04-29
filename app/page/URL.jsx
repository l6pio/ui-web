import React, {useEffect} from "react";
import LTable from "../component/common/table/LTable";
import {Desc} from "../Const";
import Paging from "../component/common/table/Paging";
import {connect} from "react-redux";
import {ApiClient} from "../util/ApiClient";
import {isWidthUp} from "@material-ui/core";
import withWidth from "@material-ui/core/withWidth";
import {LPopper} from "../component/common/LPopper";
import ms from "pretty-ms";
import {SaveURLListOrder} from "../reducer/report";
import ReportLayout from "../layout/ReportLayout";
import Box from "@material-ui/core/Box";

const URL = ({dispatch, width, reportJob, urlListOrder}) => {
    const apiClient = ApiClient();
    const paging = Paging(urlListOrder.orderBy, urlListOrder.order);
    const upSm = isWidthUp("sm", width);

    const saveData = data => {
        paging.setData(data.slice.map(v => ({
            id: v.url,
            url: v.url,
            count: v.count,
            failure: Math.round(v.failure * 10000) / 100,
            avg: v.avg,
            cv: v.cv,
        })));
        paging.setPage(data.page);
        paging.setPageCount(data.pageCount);
        paging.setRowsPerPage(data.rowsPerPage);
    };

    const getData = () => {
        apiClient.get(`/report/${reportJob.name}/http/url?page=${paging.page}&order=${paging.order}${paging.orderBy}`)
            .then(res => res.data && saveData(res.data));
    };

    const extraColumns = [
        {
            id: "count",
            label: <LPopper label="Count" description={Desc._00000045}/>,
            align: "right",
            width: 110,
        },
        {
            id: "failure",
            label: <LPopper label="Failure" description={Desc._00000046}/>,
            align: "right",
            width: 110,
            display: v => `${v}%`,
        },
        {
            id: "cv",
            label: <LPopper label="CV" description={Desc._00000048}/>,
            align: "right",
            width: 90,
            display: v => `${Math.round(v * 100)}%`,
        },
    ];

    const columns = [
        {
            id: "url",
            label: "URL",
        },
        {
            id: "avg",
            label: <LPopper label="Avg" description={Desc._00000047}/>,
            align: "right",
            width: 110,
            display: v => ms(v),
        },
        ...(upSm ? extraColumns : []),
    ];

    useEffect(() => getData(), [paging.trigger, reportJob]);

    return (
        <ReportLayout>
            <Box m="10px">
                <LTable
                    id="http-url-table"
                    columns={columns}
                    rows={paging.data}
                    onColClick={(orderBy, order) => {
                        dispatch({
                            type: SaveURLListOrder,
                            value: {orderBy, order},
                        });
                    }}
                    emptyHint={Desc._00000031}
                    paging={paging}
                    showHeader
                    flat
                />
            </Box>
        </ReportLayout>
    );
};

const stateToProps = (state) => ({
    reportJob: state.reportJob,
    urlListOrder: state.urlListOrder,
});

export default connect(stateToProps)(withWidth()(URL));
