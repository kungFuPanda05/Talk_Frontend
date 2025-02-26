'use client';

import { useEffect, useState } from "react";
import { Box } from "@mui/material";
import imageUploadApi from "@/utils/imagUploadApi";
import apiError from "@/utils/apiError";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "@/styles/register.module.scss";
import Loader from 'react-fullscreen-loading';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (token) router.push("/");
    }, []);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        const formData = new FormData();
        formData.append("name", name);
        formData.append("gender", gender);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("logo", file);

        try {
            const res = await imageUploadApi.post("/api/auth/register", formData);
            setIsLoading(false);
            if (res?.data?.success) {
                toast.success(res.data.message, {
                    position: "top-center",
                    hideProgressBar: false,
                });
                router.push("/login");
            }
        } catch (error) {
            setIsLoading(false);
            apiError(error);
        }
    };

    return (
        <div style={{height: '100%', width: '100%', border: '0.1px solid white', background: 'linear-gradient(to top right,rgb(1, 77, 158),rgb(68, 155, 248),rgb(113, 182, 252))'}}>
            <Box className={styles.registerOuterBox}>
                <form onSubmit={handleSubmit} className={styles.form}>
                    <div style={{ textAlign: "center", fontSize: "35px", color: '#007bff', fontWeight: 'bold', textShadow: '1px 1.5px rgb(45, 45, 46)'}}>ChitTalk</div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>UserName:</label>
                        <input
                            type="text"
                            placeholder="Name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Gender:</label>
                        <select
                            value={gender}
                            onChange={(e) => setGender(e.target.value)}
                            required
                            className={styles.select}
                        >
                            <option value="">Select</option>
                            <option value="M">Male</option>
                            <option value="F">Female</option>
                        </select>
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Email:</label>
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Password:</label>
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <label className={styles.label}>Display picture:</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className={styles.fileInput}
                        />
                    </div>
                    <div className={styles.inputGroup}>
                        <button type="submit" className={styles.button}>
                            Register
                        </button>
                    </div>
                    <div className={styles.footerText}>
                        <h6>
                            Already have an account?{" "}
                            <Link href="/login" className={styles.link}>
                                Sign In
                            </Link>
                        </h6>
                    </div>
                </form>
            </Box>
            {isLoading && <Loader loading  loaderColor="#3498db" />}
        </div>
    );
};

export default Register;
