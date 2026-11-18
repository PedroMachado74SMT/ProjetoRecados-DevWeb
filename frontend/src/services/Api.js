import axios from "axios";

const Api = axios.create({
    baseURL: "/api",
    withCredentials: true,
    withXSRFToken: true,
    headers: {
        Accept: "application/json"
    }
});

export default Api;