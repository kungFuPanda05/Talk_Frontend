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
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";

const Register = ()=>{
    const router = useRouter();
    const token = Cookies.get('token');
    useEffect(()=>{
        if(token) router.push('/');
    }, [])

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
        console.log(name, gender, email, password);
        const formData = new FormData();
        formData.append('name', name);
        formData.append('gender', gender);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('logo', file);
        try{
            const res = await imageUploadApi.post('/api/auth/register', formData);
            console.log(res.data);
            if(res?.data?.success){
                toast.success(res.data.message, {
                    position: 'top-center',
                    hideProgressBar: false
                });
                router.push('/login');
            }

        }catch(error){
            console.log("The error occured: ", error);
            apiError(error);
        }


    }

    return (
        <>
            <Box className="registerOuterBox">
                <form onSubmit={handleSubmit}>
                    <div className="registerDivs">
                        <label>UserName: </label>
                        <div className="regInsideDivs"><input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required/></div>
                    </div>
                    <div className="registerDivs">
                        <label>Gender: </label>
                        <div className="regInsideDivs">
                            <select value={gender} onChange={(e)=> setGender(e.target.value)} required>
                                <option value={""}>select</option>
                                <option value={false}>Male</option>
                                <option value={true}>Female</option>
                            </select>
                        </div>
                    </div>
                    <div className="registerDivs">
                        <label>Email: </label>
                        <div className="regInsideDivs"><input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required/></div>
                    </div>
                    <div className="registerDivs">
                        <label>Password:</label>
                        <div className="regInsideDivs"><input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                    </div>
                    <div className="registerDivs">
                        <label>Display picture: </label>
                        <div className="regInsideDivs"><input type="file" accept="image/*" onChange={handleFileChange}/></div>
                    </div>
                    <div className="registerDivs">
                        <button type="submit">Register</button>
                    </div>
                    <div>
                        <h6>Already have an account? <Link href="/login">Sign In</Link> </h6>
                    </div>
                </form>
            </Box>
        </>
    )
}
export default Register;