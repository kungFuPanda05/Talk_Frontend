import Cookies from "js-cookie";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const apiError = (err) => {
  console.log("The error is: ", err);
  if (err?.response?.data.messages) {
    console.log("Inside the api error", err.response.data.messages);
    let error = err.response.data.messages;
      for (let i = 0; i < error.length; i++) {
        toast.error(error[i], {
          position: "top-center",
          hideProgressBar: false,
        });
    }
    if (err?.response?.status === 401) {
      Cookies.remove("token");
      window.location.assign("/login");
    }
  }
};

export default apiError;
