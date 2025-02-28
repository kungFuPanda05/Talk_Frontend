'use client';

import { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import api from "../../utils/api";
import apiError from "@/utils/apiError";
import { toast } from "react-toastify";
import styles from "../../styles/login.module.scss";
// import Loader from 'react-fullscreen-loading';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [hidePassword, setHidePassword] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (token) router.push("/");
    }, [token, router]);

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            setIsLoading(true);
            const res = await api.post("/api/auth/login", { email, password });
            setIsLoading(false);
            if (res?.data?.success) {
                toast.success(res.data.message, {
                    position: "top-center",
                    hideProgressBar: false,
                });
                Cookies.set("token", res?.data?.token);
                api.defaults.headers.Authorization = `Bearer ${res.data.token}`;
                router.push("/");
            }
        } catch (error) {
            setIsLoading(false);
            apiError(error);
        }
    };

    return (
        <>
            <Box className={styles.container}>
                <Box className={styles.loginBox}>
                    <div style={{ textAlign: "center", fontSize: "35px", color: '#007bff', fontWeight: 'bold', textShadow: '1px 1.5px rgb(45, 45, 46)' }}>ChitTalk</div>
                    <form onSubmit={loginUser} className={styles.form}>
                        {/* Email Field */}
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            margin="normal"
                        />

                        {/* Password Field */}
                        <TextField
                            label="Password"
                            type={hidePassword ? "password" : "text"}
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            margin="normal"
                        // InputProps={{
                        //     endAdornment: (
                        //         <InputAdornment position="end">
                        //             <IconButton
                        //                 onClick={() => setHidePassword(!hidePassword)}
                        //                 edge="end"
                        //             >
                        //                 {hidePassword ? <VisibilityOff /> : <Visibility />}
                        //             </IconButton>
                        //         </InputAdornment>
                        //     ),
                        // }}
                        />

                        {/* Login Button */}
                        <Button type="submit" variant="contained" fullWidth className={styles.button}>
                            Login
                        </Button>

                        {/* Footer */}
                        <Typography className={styles.footerText}>
                            {"Don't have an account? "}
                            <a href="/register" className={styles.link}>
                                Register
                            </a>
                        </Typography>

                    </form>
                </Box>
            </Box>
            {/* {isLoading && <Loader loading  loaderColor="#3498db" />} */}
        </>
    );
};

export default Login;
