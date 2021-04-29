import EventEmitter from "events";

export const LocalEvent = new EventEmitter();
LocalEvent.setMaxListeners(99);

export const Label = {
    AverageRpm: "Average RPM",
    Dashboard: "Dashboard",
    HttpRequests: "HTTP Requests",
    HttpFailure: "HTTP Failure",
    HttpThroughput: "Http Throughput (RPM)",
    JobList: "Job List",
    LastUpdate: "Last Update",
    MaximumRpm: "Maximum RPM",
    More: "More ...",
    Name: "Name",
    P90: "P90",
    P75: "P75",
    P50: "P50",
    Refresh: "Refresh",
    Search: "Search ...",
    Status: "Status",
};

export const Desc = {
    _00000021: "No Existing Jobs",
    _00000031: "No Existing URLs",
    _00000045: "Total number of http requests.",
    _00000046: "The percentage of HTTP requests that fail, a failed request means that the status code of the request is 4xx or 5xx.",
    _00000047: "The average latency of http requests.",
    _00000048: "The coefficient of variation for all http request latencies. If the CV is greater than 15%, the data should be considered as possibly abnormal.",
    _00000049: "Total number of cases executed.",
    _00000050: "The percentage of cases that fail to run.",
    _00000051: "The average time spent running cases.",
    _00000052: "The coefficient of variation of the time taken to run case. If the CV is greater than 15%, the data should be considered as possibly abnormal.",
};
