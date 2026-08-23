'use client';

import { useEffect, useState } from "react";
import {
    ArrowForwardRounded,
    BoltRounded,
    ChatBubbleRounded,
    GroupsRounded,
    LockRounded,
    MailOutlineRounded,
    ShieldRounded,
    Visibility,
    VisibilityOff,
} from "@mui/icons-material";
import Cookies from "js-cookie";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import api from "../../utils/api";
import apiError from "@/utils/apiError";
import styles from "../../styles/login.module.scss";

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

    const loginUser = async (event) => {
        event.preventDefault();

        try {
            setIsLoading(true);
            const res = await api.post("/api/auth/login", { email, password });

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
            apiError(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className={styles.page}>
            <span className={`${styles.decorBubble} ${styles.decorBubbleOne}`} aria-hidden="true" />
            <span className={`${styles.decorBubble} ${styles.decorBubbleTwo}`} aria-hidden="true" />

            <section className={styles.authShell} aria-label="ChitTalk sign in">
                <aside className={styles.showcase}>
                    <div className={styles.brand}>
                        <span className={styles.brandMark} aria-hidden="true">
                            <ChatBubbleRounded />
                        </span>
                        <span>ChitTalk</span>
                    </div>

                    <div className={styles.showcaseCopy}>
                        <span className={styles.eyebrow}>
                            <BoltRounded aria-hidden="true" />
                            Instant connections
                        </span>
                        <h2>Real conversations, made delightfully simple.</h2>
                        <p>
                            Meet someone new, share a thought, and let a great conversation unfold.
                        </p>
                    </div>

                    <div className={styles.chatPreview} aria-hidden="true">
                        <div className={styles.previewHeader}>
                            <div className={styles.avatarStack}>
                                <span className={`${styles.avatar} ${styles.avatarBlue}`}>A</span>
                                <span className={`${styles.avatar} ${styles.avatarCoral}`}>M</span>
                            </div>
                            <div>
                                <strong>New connection</strong>
                                <span><i /> Active now</span>
                            </div>
                            <span className={styles.previewIcon}><GroupsRounded /></span>
                        </div>
                        <div className={`${styles.message} ${styles.messageIncoming}`}>
                            Hey! What are you curious about today?
                        </div>
                        <div className={`${styles.message} ${styles.messageOutgoing}`}>
                            New ideas and good stories ✨
                        </div>
                        <div className={styles.typingBubble}><i /><i /><i /></div>
                    </div>

                    <div className={styles.trustNote}>
                        <span><ShieldRounded aria-hidden="true" /></span>
                        <div>
                            <strong>A space made for conversation</strong>
                            <small>Your sign-in stays private and secure.</small>
                        </div>
                    </div>
                </aside>

                <div className={styles.formPanel}>
                    <div className={styles.mobileBrand}>
                        <span className={styles.brandMark} aria-hidden="true">
                            <ChatBubbleRounded />
                        </span>
                        <span>ChitTalk</span>
                    </div>

                    <header className={styles.formHeader}>
                        <span className={styles.kicker}>Welcome back</span>
                        <h1>Pick up where you left off.</h1>
                        <p>Sign in to continue to your conversations.</p>
                    </header>

                    <form onSubmit={loginUser} className={styles.form}>
                        <div className={styles.fieldGroup}>
                            <label htmlFor="login-email">Email address</label>
                            <div className={styles.inputShell}>
                                <MailOutlineRounded aria-hidden="true" />
                                <input
                                    id="login-email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <div className={styles.labelRow}>
                                <label htmlFor="login-password">Password</label>
                                <span><LockRounded aria-hidden="true" /> Secure sign in</span>
                            </div>
                            <div className={styles.inputShell}>
                                <LockRounded aria-hidden="true" />
                                <input
                                    id="login-password"
                                    name="password"
                                    type={hidePassword ? "password" : "text"}
                                    autoComplete="current-password"
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    required
                                />
                                <button
                                    type="button"
                                    className={styles.passwordToggle}
                                    onClick={() => setHidePassword((current) => !current)}
                                    aria-label={hidePassword ? "Show password" : "Hide password"}
                                    aria-pressed={!hidePassword}
                                >
                                    {hidePassword ? <VisibilityOff /> : <Visibility />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            <span>{isLoading ? "Signing you in..." : "Sign in"}</span>
                            <ArrowForwardRounded aria-hidden="true" />
                        </button>

                        <p className={styles.footerText}>
                            New to ChitTalk?{" "}
                            <Link href="/register" className={styles.link}>
                                Create an account
                            </Link>
                        </p>
                    </form>

                    <div className={styles.formFootnote}>
                        <span aria-hidden="true">●</span>
                        Your next great conversation is one click away.
                    </div>
                </div>
            </section>
        </main>
    );
};

export default Login;
