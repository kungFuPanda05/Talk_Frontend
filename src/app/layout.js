import { Inter } from "next/font/google";
import '../styles/global.scss'
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.css';

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "ChitTalk",
  description: "Chat with random strangers instantly.",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png", // Apple devices ke liye
  },
  openGraph: {
    title: "ChitTalk - Random Stranger Chat",
    description: "Connect and chat with new people instantly.",
    images: ["/apple-touch-icon.png"], // Open Graph image (social media previews)
    type: "website",
  },
};


export default function RootLayout({ children }) {

  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <ToastContainer/>
        </body>
    </html>
  );
}
