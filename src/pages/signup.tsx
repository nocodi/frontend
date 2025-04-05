import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({ email: "", password: ""});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const handleEmailChange = (e) => {
        const value = e.target.value;
        setEmail(value);
    
        if (!value) {
          setErrors((prev) => ({ ...prev, email: "Enter Email" }));
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          setErrors((prev) => ({ ...prev, email: "The Email is invalid" }));
        } else {
          setErrors((prev) => ({ ...prev, email: "" }));
        }
      };
      const handlePasswordChange = (e) => {
        const value = e.target.value;
        setPassword(value);
    
        if (!value) {
          setErrors((prev) => ({ ...prev, password: "Enter Password" }));
        }
         else if (value.length < 6) {
          setErrors((prev) => ({ ...prev, password: "Password must be at least 6 characters long." }));
        } else {
          setErrors((prev) => ({ ...prev, password: "" }));
        }
      };

    const handleSignup = async (e) => {
        e.preventDefault();
        if(!email || !password) return;
        // setErrors("");
        setLoading(true);
        

        try {
            const response = await axios.post("http://api.nocodi.ir/iam/signup/", {
                email,
                password,
            });
            if (response.status == 201){
                console.log(response.status);
                console.log(response.data);
                localStorage.setItem("request_id", response.data.request_id);
                toast.success("Registration was successful", {
                    position: "top-left",
                    autoClose: 3000,
                });
                navigate("/verification");
            }
            else{
                console.log(response.status);
                toast.error("Registration failed", {
                    position: "top-left",
                    autoClose: 3000,
                });
            }
        } catch (err) {
            toast.error("An error occurred. Please try again.", {
                position: "top-right",
                autoClose: 3000,
            });
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthLayout title="SignUp">
            <ToastContainer />
            <form onSubmit={handleSignup} className="bg-patina-50 p-16 rounded-xl shadow-md w-1/2 relative overflow-hidden" dir="ltr">
                <div className="form-control">
                    <label className="label text-patina-700">
                            Email
                            </label>
                    <input
                        type="email"
                        placeholder="Enter your Email"
                        className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.email ? 'border-red-500' : 'border-patina-500'}`}
                        value={email}
                        onChange={handleEmailChange}
                    />
                    {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
                </div>
                
                <div className="form-control mt-4">
                    <label className="label text-patina-700">Password</label>
                    <input
                        type="password"
                        placeholder="Enter your Password"
                        className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.password ? 'border-red-500' : 'border-patina-500'}`}
                        value={password}
                        onChange={handlePasswordChange}
                    />
                    {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
                </div>
                
                
                {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
                
                <button className="btn btn-patina w-full mt-6 bg-patina-500 text-white hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                </button>
                
                <p className="text-center mt-4 text-sm text-patina-700">
                    Do you have an account?<a href="/" className="text-patina-500 hover:text-patina-700">Enter</a>
                </p>
            </form>
            <div className="absolute top-0 right-0 h-full w-1/2 bg-patina-500 rounded-r-xl"></div>

        </AuthLayout>
    );
}
