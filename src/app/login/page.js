'use client'

import { useEffect, useState } from "react";
import api from "../../utils/api";
import { 
    Box,
    Input
 } from "@mui/material";
import imageUploadApi from "@/utils/imagUploadApi";
import apiError from "@/utils/apiError";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";


const Login = () => {
    // const router = useRouter();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const router = useRouter();
    const token = Cookies.get('token');
    useEffect(()=>{
        if(token) router.push('/');
    }, [])

    const loginUser=async(e)=>{
        e.preventDefault();
        console.log("logging user: ", email, password);
        try{
            const res = await api.post('/api/auth/login', {email, password});
            if(res?.data?.success){
                toast.success(res.data.message, {
                    position: 'top-center',
                    hideProgressBar: false
                });
                Cookies.set("token", res?.data?.token);
                api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
                router.push('/');
            }

        }catch(error){
            apiError(error);
        }
    }

    return (
        <Box className="registerOuterBox">
            <form onSubmit={loginUser}>
                <Box>
                    <label>Email: </label>
                    <Box><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/></Box>
                </Box>
                <Box>
                    <label>Password:</label>
                    <Box><input type={hidePassword?"password":"text"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required/></Box>
                </Box>
                <Box mt={1}>
                    <button>Login</button>
                </Box>

            </form>
        </Box>
    )
}

export default Login;