'use client';

import { useEffect, useState } from "react";
import {
    ArrowForwardRounded,
    AutoAwesomeRounded,
    ChatBubbleRounded,
    CloudUploadRounded,
    FavoriteRounded,
    LockRounded,
    MailOutlineRounded,
    PersonRounded,
    ShieldRounded,
    Visibility,
    VisibilityOff,
    WcRounded,
} from "@mui/icons-material";
import imageUploadApi from "@/utils/imagUploadApi";
import apiError from "@/utils/apiError";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import styles from "@/styles/register.module.scss";

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [gender, setGender] = useState("");
    const [file, setFile] = useState(null);
    const [hidePassword, setHidePassword] = useState(true);

    const router = useRouter();
    const token = Cookies.get("token");

    useEffect(() => {
        if (token) router.push("/");
    }, [token, router]);

    const handleFileChange = (event) => {
        setFile(event.target.files?.[0] || null);
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

            if (res?.data?.success) {
                toast.success(res.data.message, {
                    position: "top-center",
                    hideProgressBar: false,
                });
                router.push("/login");
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

            <section className={styles.authShell} aria-label="Create a ChitTalk account">
                <div className={styles.formPanel}>
                    <div className={styles.mobileBrand}>
                        <span className={styles.brandMark} aria-hidden="true"><ChatBubbleRounded /></span>
                        <span>ChitTalk</span>
                    </div>

                    <header className={styles.formHeader}>
                        <span className={styles.kicker}>Join the conversation</span>
                        <h1>Create your space to connect.</h1>
                        <p>A few details and you&apos;re ready to meet someone new.</p>
                    </header>

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.twoColumnFields}>
                            <div className={styles.fieldGroup}>
                                <label htmlFor="register-name">Display name</label>
                                <div className={styles.inputShell}>
                                    <PersonRounded aria-hidden="true" />
                                    <input
                                        id="register-name"
                                        name="name"
                                        type="text"
                                        autoComplete="name"
                                        placeholder="What should we call you?"
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.fieldGroup}>
                                <label htmlFor="register-gender">Gender</label>
                                <div className={`${styles.inputShell} ${styles.selectShell}`}>
                                    <WcRounded aria-hidden="true" />
                                    <select
                                        id="register-gender"
                                        name="gender"
                                        value={gender}
                                        onChange={(event) => setGender(event.target.value)}
                                        required
                                    >
                                        <option value="" disabled>Select one</option>
                                        <option value="M">Male</option>
                                        <option value="F">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className={styles.fieldGroup}>
                            <label htmlFor="register-email">Email address</label>
                            <div className={styles.inputShell}>
                                <MailOutlineRounded aria-hidden="true" />
                                <input
                                    id="register-email"
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
                                <label htmlFor="register-password">Password</label>
                                <span><ShieldRounded aria-hidden="true" /> Keep it memorable</span>
                            </div>
                            <div className={styles.inputShell}>
                                <LockRounded aria-hidden="true" />
                                <input
                                    id="register-password"
                                    name="password"
                                    type={hidePassword ? "password" : "text"}
                                    autoComplete="new-password"
                                    placeholder="Create a secure password"
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

                        <div className={styles.fieldGroup}>
                            <span className={styles.fieldLabel}>Display picture <small>Optional</small></span>
                            <input
                                id="register-photo"
                                name="logo"
                                type="file"
                                accept="image/jpeg, image/png"
                                onChange={handleFileChange}
                                className={styles.fileInput}
                            />
                            <label htmlFor="register-photo" className={styles.uploadCard}>
                                <span className={styles.uploadAvatar} aria-hidden="true">
                                    {name.trim().charAt(0).toUpperCase() || <PersonRounded />}
                                </span>
                                <span className={styles.uploadCopy}>
                                    <strong>{file ? file.name : "Add a friendly face"}</strong>
                                    <small>{file ? "Click to choose a different photo" : "JPG or PNG · choose from your device"}</small>
                                </span>
                                <span className={styles.uploadIcon} aria-hidden="true"><CloudUploadRounded /></span>
                            </label>
                        </div>

                        <button type="submit" className={styles.submitButton} disabled={isLoading}>
                            <span>{isLoading ? "Creating your account..." : "Create my account"}</span>
                            <ArrowForwardRounded aria-hidden="true" />
                        </button>

                        <p className={styles.footerText}>
                            Already have an account?{" "}
                            <Link href="/login" className={styles.link}>Sign in</Link>
                        </p>
                    </form>
                </div>

                <aside className={styles.showcase}>
                    <div className={styles.brand}>
                        <span className={styles.brandMark} aria-hidden="true"><ChatBubbleRounded /></span>
                        <span>ChitTalk</span>
                    </div>

                    <div className={styles.showcaseCopy}>
                        <span className={styles.eyebrow}>
                            <AutoAwesomeRounded aria-hidden="true" />
                            Made for serendipity
                        </span>
                        <h2>A warm hello can become your favorite story.</h2>
                        <p>Step into a playful space built for kind, spontaneous conversations.</p>
                    </div>

                    <div className={styles.orbitScene} aria-hidden="true">
                        <span className={`${styles.orbitAvatar} ${styles.avatarOne}`}>N</span>
                        <span className={`${styles.orbitAvatar} ${styles.avatarTwo}`}>K</span>
                        <span className={`${styles.orbitAvatar} ${styles.avatarThree}`}>J</span>
                        <div className={styles.centerBubble}>
                            <ChatBubbleRounded />
                            <i className={styles.sparkOne}>✦</i>
                            <i className={styles.sparkTwo}>✦</i>
                        </div>
                        <span className={styles.orbitLineOne} />
                        <span className={styles.orbitLineTwo} />
                    </div>

                    <div className={styles.kindnessCard}>
                        <span aria-hidden="true"><FavoriteRounded /></span>
                        <div>
                            <strong>Come as you are</strong>
                            <small>A friendly corner of the internet is waiting.</small>
                        </div>
                    </div>
                </aside>
            </section>
        </main>
    );
};

export default Register;
