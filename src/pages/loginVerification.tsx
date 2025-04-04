import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";

export default function LoginVerification() {

    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({ code: "" });
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState(null); 
    
    
    useEffect(() => {
        const reqID = localStorage.getItem("request_id");
        if (reqID) {
            setRequestId(reqID);
        }
    }, []);


  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ code: "" });
    setLoading(true);


        if (!requestId) {
            setErrors({ code: "Request code not found. Please register again." });
            setLoading(false);
            return;
        }


    try {
      const response = await axios.post(
        "http://api.nocodi.ir/iam/login/otp/verify/",
        {
          otp: code,
          request_id: requestId,
        },
      );

            if (response.status === 201) {
                console.log(response.data);
                toast.success("You are successfully logged in", {position: "top-left", autoClose: 3000})
            } else {
                console.log(response.status);
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
            // setErrors({ code: err.response?.data?.message || "An error occurred. Please try again." });
            toast.error(errorMessage, {position: "top-left", autoClose: 3000})
        } finally {
            setLoading(false);  
        }
  };

    return (
        <AuthLayout title="Email Verification">
            <ToastContainer />
            <form onSubmit={handleVerification} className="bg-patina-50 p-12 w-1/2 rounded-xl shadow-md relative overflow-hidden" dir="ltr">
                <div className="form-control">
                    <label className="label text-patina-700 text-lg font-medium">
                        Verification Code 
                    </label>
                    <input
                        type="text"
                        placeholder="Enter verification code"
                        className="input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 text-center text-sm tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>
                <button className="btn w-full mt-6 bg-patina-500 text-white hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" disabled={loading}>
                    {loading ? "Verifying..." : "Verify"}
                </button>
            </form>
            <div className="absolute top-0 right-0 h-full w-1/2 bg-patina-500 rounded-r-xl"></div>

        </AuthLayout>
    );
}
