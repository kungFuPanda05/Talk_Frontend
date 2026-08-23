import Cookies from "js-cookie";
import io from 'socket.io-client'
import { API_BASE_URL } from "@/utils/config";

let socket;
let socketToken;

const getSocketOptions = (token) => token
    ? { extraHeaders: { Authorization: `Bearer ${token}` } }
    : {};

export const getSocketInstance = () => {
    const token = Cookies.get('token');

    if (!socket) {
        socketToken = token;
        socket = io(API_BASE_URL, getSocketOptions(token));
    } else if (token !== socketToken) {
        const shouldReconnect = socket.connected;

        if (shouldReconnect) socket.disconnect();

        if (token) {
            socket.io.opts.extraHeaders = getSocketOptions(token).extraHeaders;
        } else {
            delete socket.io.opts.extraHeaders;
        }

        socketToken = token;
        if (shouldReconnect) socket.connect();
    }

    return socket;
}
