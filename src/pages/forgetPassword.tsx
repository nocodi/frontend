import AuthLayout from "../components/authLayout";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";


export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [error, setErrors] = useState("");
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    
        if (!value) {
          setErrors((prev) => ({ ...prev, email: "Enter an Email" }));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
      };


    const handleForgetPassword = async (e) => {
        e.preventDefault();
        if (!email) return;
        // setError("");
        setLoading(true);

        try {
            const response = await axios.post("http://api.nocodi.ir/iam/login/otp/send/", {
                email,
            });
            if (response.status == 200) {
                console.log(response.status);
                console.log(response.data);
                localStorage.setItem("request_id", response.data.request_id);
                navigate("/loginVerification");
                toast.success("You are successfully logged in", {position: "top-left", autoClose: 3000})
            } else {
                console.log(response.status);
            }
        }
        catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            // setErrors(err.response?.data?.message || "An error occurred. Please try again.");
            toast.error(errorMessage, {position: "top-left", autoClose: 3000})
        }
        finally {
            setLoading(false);
        }
    };

    return(
    <AuthLayout title="Passwordless Login">
        <ToastContainer />
        <form onSubmit={handleForgetPassword} className="bg-patina-50 p-15 w-1/2 rounded-xl shadow-md relative overflow-hidden" dir="ltr">
            <div className="form-control">
                <label className="label text-patina-700">Email</label>
                <input
                    type="email"
                    placeholder="Enter your Email"
                    className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${error.email ? 'border-red-500' : 'border-patina-500'}`}
                    onChange={handleEmailChange}
                    value={email}
                />
                {error.email && <span className="text-red-500 text-sm">{error.email}</span>}
            </div>
            <button className="btn btn-patina w-full mt-6 bg-patina-500 text-white hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send"}                
            </button>
        </form>
        <div className="absolute top-0 right-0 h-full w-1/2 bg-patina-500 rounded-r-xl"></div>


    </AuthLayout>
    );
}