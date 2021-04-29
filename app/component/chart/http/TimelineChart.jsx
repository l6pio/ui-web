import React, {useEffect} from "react";
import {connect} from "react-redux";
import ReactApexChart from "react-apexcharts";
import moment from "moment";
import Box from "@material-ui/core/Box";
import {ApiClient} from "../../../util/ApiClient";
import {isEmpty} from "../../../util/Lang";
import {LocalEvent} from "../../../Const";

const defaultData = {
    min: 0,
    max: 0,
    startTime: 0,
    warmUpDone: 0,
    endTime: 0,
    series: [],
};

const chartOptions = data => {
    let timelineMarks = [];

    if (data.max > 0) {
        timelineMarks.push({
            x: data.endTime,
            strokeDashArray: 4,
            borderColor: "#00a896",
        });
    }

    if (data.warmUpDone > data.startTime) {
        timelineMarks.push({
            x: data.warmUpDone,
            strokeDashArray: 4,
            borderColor: "#00a896",
        });
    }

    return {
        timeline: {
            colors: ["#00bbf9", "#ff6b6b"],
            chart: {
                id: "chartArea",
                zoom: {
                    enabled: false,
                },
                toolbar: {
                    show: false,
                },
                parentHeightOffset: 5,
            },
            dataLabels: {
                enabled: false
            },
            stroke: {
                curve: "smooth",
                width: [2, 2],
                dashArray: [0, 0]
            },
            markers: {
                size: 0,
                hover: {
                    sizeOffset: 6
                }
            },
            xaxis: {
                type: "datetime",
                min: data.min,
                max: data.max,
                labels: {
                    formatter: (value, timestamp) => moment(new Date(timestamp)).format("HH:mm")
                },
            },
            tooltip: {
                x: {
                    show: true,
                    formatter: value => moment(new Date(value)).format("YYYY-MM-DD HH:mm")
                },
            },
            grid: {
                borderColor: "#f1f1f1",
                padding: {
                    left: 10,
                    right: 25,
                }
            },
            legend: {
                position: "bottom",
                horizontalAlign: "center",
                show: true,
                itemMargin: {
                    vertical: 5,
                },
                offsetY: 5,
            },
            annotations: {
                xaxis: timelineMarks
            },
        },
        brush: {
            chart: {
                id: "chartBrush",
                offsetY: -27,
                brush: {
                    target: "chartArea",
                    enabled: true
                },
                selection: {
                    enabled: true,
                    xaxis: {
                        min: data.min,
                        max: data.max,
                    }
                },
                sparkline: {
                    enabled: false,
                },
            },
            colors: ["#00bbf9"],
            fill: {
                type: "gradient",
                gradient: {
                    opacityFrom: 0.8,
                    opacityTo: 0.8,
                }
            },
            grid: {
                show: false,
            },
            xaxis: {
                type: "datetime",
                tooltip: {
                    enabled: false
                },
                labels: {
                    show: false
                },
                axisBorder: {
                    show: false,
                },
            },
            yaxis: {
                tickAmount: 2,
            },
            legend: {
                show: false,
            },
        },
    };
};

const TimelineChart = ({reportJob}) => {
    const apiClient = ApiClient();
    const [data, setData] = React.useState(defaultData);
    const options = chartOptions(data);
    const reportTestRef = React.useRef(reportJob);
    const chartRef = React.useRef(null);
    const rangeRef = React.useRef({min: 0, max: 0});

    const getData = () => {
        apiClient.get(`/report/${reportTestRef.current.id}/http/timeline`).then(res => {
            let timeline = res.data.timeline;

            if (isEmpty(timeline)) {
                setData(defaultData);
                return;
            }

            const chartMin = Math.min(...timeline.map(v => v.from));
            const chartMax = Math.max(...timeline.map(v => v.to));

            timeline.push({from: chartMin, to: chartMin, count: 0, failed: 0});
            timeline = timeline.sort((a, b) => a.to < b.to ? -1 : a.to > b.to ? 1 : 0);

            setData({
                min: chartMin,
                max: chartMax,
                startTime: res.data.startTime,
                warmUpDone: res.data.warmUpDone,
                endTime: res.data.endTime,
                series:
                    [{
                        name: "Requests",
                        data: timeline.map(v => [v.to, v.count]),
                    }, {
                        name: "Fails",
                        data: timeline.map(v => [v.to, v.failed]),
                    }]
            });

            rangeRef.current = {
                min: chartMin,
                max: chartMax,
            };
        });
    };

    useEffect(() => {
        reportTestRef.current = reportJob;
        getData();
    }, [reportJob]);

    useEffect(() => {
        const fn = () => {
            if (!rangeRef.current || !chartRef.current) {
                // 如果图表还没有被初始化则持续读取数据
                getData();
            } else {
                // 当用户改变了图表区间则暂停图表刷新
                const chartConfig = chartRef.current.chart.w.config;
                if (rangeRef.current.min === chartConfig.xaxis.min && rangeRef.current.max === chartConfig.xaxis.max) {
                    getData();
                }
            }
        };
        LocalEvent.on("refresh report data", fn);
        return () => {
            LocalEvent.removeListener("refresh report data", fn);
        };
    }, []);

    return (
        data.series.length > 0 ?
            <Box id="charts" style={{position: "relative", height: 290, width: "100%"}}>
                <div style={{position: "relative", top: "-30px"}}>
                    <div id="chart1" style={{zIndex: 100}}>
                        <ReactApexChart ref={chartRef} options={options.timeline} series={data.series} type="line" height="250"/>
                    </div>
                    <div id="chart2">
                        <ReactApexChart options={options.brush} series={data.series} type="area" height="100"/>
                    </div>
                </div>
            </Box> :
            <Box id="charts" style={{position: "relative", height: 230, width: "100%"}}>
                <div style={{position: "relative", top: "-20px"}}>
                    <div id="chart1" style={{zIndex: 100}}>
                        <ReactApexChart options={options.timeline} series={[]} type="line" height="250"/>
                    </div>
                </div>
            </Box>
    );
};

const stateToProps = (state) => ({
    reportJob: state.reportJob,
});

export default connect(stateToProps)(TimelineChart);
