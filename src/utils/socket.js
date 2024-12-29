import Cookies from "js-cookie";
import io from 'socket.io-client'
const token = Cookies.get('token');
let socket;
export const getSocketInstance = () => {
    if (!socket) {
        socket = io(`${process.env.NEXT_PUBLIC_API_URL}`, {
            extraHeaders: {
                Authorization: `Bearer ${token}` // Pass JWT token here
            }
        });
    }
    return socket;
}
