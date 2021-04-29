import axios from "axios";

export function ApiClient() {
    return axios.create({baseURL: "/api/v1", timeout: 15000});
}
