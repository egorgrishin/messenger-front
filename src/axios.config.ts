import axios from "axios";
import {AxiosInstance} from "axios";

const request: AxiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:8000',
});

export {
    request,
};