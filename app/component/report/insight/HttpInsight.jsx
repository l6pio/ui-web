import React, {useEffect} from "react";
import ReactApexChart from "react-apexcharts";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Table from "@material-ui/core/Table";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import TableBody from "@material-ui/core/TableBody";
import Box from "@material-ui/core/Box";
import {LCell} from "../../common/table/LCell";
import {ApiClient} from "../../../util/ApiClient";
import {connect} from "react-redux";
import {Label, LocalEvent} from "../../../Const";
import ms from "pretty-ms";
import {isEmpty} from "../../../util/Lang";

const defaultData = {
    loaded: false,
    maxRpm: 0,
    avgRpm: 0,
    httpCount: 0,
    httpFailed: 0,
    p95: 0,
    p90: 0,
    p75: 0,
    p50: 0,
    timeline: [],
    byMethod: [],
    byStatus: [],
};

const HttpInsight = ({reportJob}) => {
    const apiClient = ApiClient();
    const [data, setData] = React.useState(defaultData);
    const reportTestRef = React.useRef(reportJob);

    const getData = () => {
        let reportId = reportTestRef.current.id;

        apiClient.get(`/report/${reportId}/key-factors`).then(res => {
            if (isEmpty(res.data)) {
                setData(defaultData);
                return;
            }

            const keyFactors = res.data;

            apiClient.get(`/report/${reportId}/http/timeline`).then(res => {
                const timelineData = res.data.timeline;
                if (isEmpty(timelineData.length)) {
                    return;
                }

                // 离散的选出一组数据显示在简略图表上
                let timeline = [];
                const slotLen = Math.ceil(timelineData.length / 10);
                for (let i = 0; i < timelineData.length; i++) {
                    if (i % slotLen === 0) {
                        timeline.push(timelineData[i].count);
                    }
                }

                apiClient.get(`/report/${reportId}/http/method-and-status`).then(res => {
                    if (isEmpty(res.data)) {
                        return;
                    }

                    setData({
                        loaded: true,
                        ...keyFactors,
                        timeline: timeline,
                        byMethod: res.data.byMethod,
                        byStatus: res.data.byStatus,
                    });
                });
            });
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
        <Box style={{maxWidth: 1120, margin: "20px auto 0 auto"}}>
            <Grid container spacing={3} style={{paddingBottom: "16px", borderBottom: "1px solid #E0E0E0"}}>
                <Grid item md={8} sm={7} xs={6}>
                    {data.loaded ?
                        <ReactApexChart
                            options={{
                                chart: {
                                    height: 160,
                                    sparkline: {
                                        enabled: true
                                    },
                                },
                                tooltip: {
                                    enabled: false,
                                },
                                stroke: {
                                    curve: "straight"
                                },
                                fill: {
                                    opacity: 0.3,
                                },
                                yaxis: {
                                    min: 0,
                                    labels: {
                                        show: false
                                    }
                                },
                                colors: ["#DCE6EC"],
                                title: {
                                    text: data.maxRpm,
                                    offsetX: 0,
                                    style: {
                                        fontSize: "24px",
                                        cssClass: "apexcharts-yaxis-title"
                                    }
                                },
                                subtitle: {
                                    text: "Max RPM",
                                    offsetX: 0,
                                    style: {
                                        fontSize: "14px",
                                        cssClass: "apexcharts-yaxis-title"
                                    }
                                }
                            }}
                            series={[{data: data.timeline}]}
                            type="area" height="160"
                        /> : null
                    }
                </Grid>
                <Grid item md={4} sm={5} xs={6}>
                    <Table>
                        <TableBody>
                            <TableRow>
                                <LCell bb="0" p="0" width="150px">
                                    <Typography variant="subtitle2">{Label.AverageRpm}:</Typography>
                                </LCell>
                                <LCell bb="0" p="0" align="right">{data.avgRpm}</LCell>
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
                                    {data.httpCount > 0 ? Math.round(data.httpFailed / data.httpCount * 10000) / 100 : 0}%
                                </LCell>
                            </TableRow>
                            <TableRow>
                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                    <Typography variant="subtitle2">P95 Resp Time:</Typography>
                                </LCell>
                                <LCell bb="0" p="6px 0 0 0" align="right">{ms(data.p95)}</LCell>
                            </TableRow>
                            <TableRow>
                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                    <Typography variant="subtitle2">P90 Resp Time:</Typography>
                                </LCell>
                                <LCell bb="0" p="6px 0 0 0" align="right">{ms(data.p90)}</LCell>
                            </TableRow>
                            <TableRow>
                                <LCell bb="0" p="6px 0 0 0" width="150px">
                                    <Typography variant="subtitle2">P75 Resp Time:</Typography>
                                </LCell>
                                <LCell bb="0" p="6px 0 0 0" align="right">{ms(data.p75)}</LCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
            <Grid container spacing={3} style={{paddingTop: "8px"}}>
                <Grid item sm={7} xs={12}>
                    <ReactApexChart
                        options={{
                            chart: {
                                sparkline: {
                                    enabled: true
                                },
                            },
                            dataLabels: {
                                enabled: true,
                            },
                            labels: data.byMethod.map(v => v.method),
                            plotOptions: {
                                pie: {
                                    customScale: 0.9,
                                    donut: {
                                        size: "38%"
                                    }
                                }
                            },
                            legend: {
                                show: false,
                                position: "right",
                                fontSize: "14px",
                                fontFamily: "TT Norms Pro",
                                offsetX: -15,
                                itemMargin: {
                                    horizontal: 5,
                                    vertical: 0
                                },
                            }
                        }}
                        series={data.byMethod.map(v => v.count)}
                        type="donut" height="200"
                    />
                    <Table style={{marginTop: "8px"}}>
                        <TableHead>
                            <TableRow>
                                <LCell>Method</LCell>
                                <LCell align="right">Count</LCell>
                                <LCell align="right">Failure</LCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.byMethod.map((v, idx) =>
                                <TableRow key={idx}>
                                    <LCell bb="0" bc={idx % 2 === 1 ? "#EEEEEE" : null}>{v.method}</LCell>
                                    <LCell bb="0" bc={idx % 2 === 1 ? "#EEEEEE" : null} align="right">{v.count}</LCell>
                                    <LCell bb="0" bc={idx % 2 === 1 ? "#EEEEEE" : null} align="right">
                                        {Math.round(v.failed / v.count * 10000) / 100}%
                                    </LCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Grid>
                <Grid item sm={5} xs={12}>
                    <ReactApexChart
                        options={{
                            chart: {
                                sparkline: {
                                    enabled: true
                                },
                            },
                            labels: data.byStatus.map(v => `Status ${v.status}`),
                            dataLabels: {
                                enabled: true,
                            },
                            plotOptions: {
                                pie: {
                                    customScale: 0.9,
                                    donut: {
                                        size: "38%"
                                    }
                                }
                            },
                            legend: {
                                show: false,
                                position: "right",
                                fontSize: "14px",
                                fontFamily: "TT Norms Pro",
                                offsetX: -15,
                                itemMargin: {
                                    horizontal: 5,
                                    vertical: 0
                                },
                            }
                        }}
                        series={data.byStatus.map(v => v.count)}
                        type="donut" height="200"
                    />
                    <Table style={{marginTop: "8px"}}>
                        <TableHead>
                            <TableRow>
                                <LCell>Status</LCell>
                                <LCell align="right">Count</LCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.byStatus.map((v, idx) =>
                                <TableRow key={idx}>
                                    <LCell bb="0" bc={idx % 2 === 1 ? "#EEEEEE" : null}>{v.status}</LCell>
                                    <LCell bb="0" bc={idx % 2 === 1 ? "#EEEEEE" : null} align="right">{v.count}</LCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </Grid>
            </Grid>
        </Box>
    );
};

const stateToProps = (state) => ({
    reportJob: state.reportJob,
});

export default connect(stateToProps)(HttpInsight);
