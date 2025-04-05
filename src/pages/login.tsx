import { useState } from "react";
import AuthLayout from "../components/authLayout";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, email: "Enter Email" }));
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setErrors((prev) => ({ ...prev, email: "Email is invalid" }));
    } else {
      setErrors((prev) => ({ ...prev, email: "" }));
    }
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Enter Password" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = {};
    if (!email) validationErrors.email = "Enter Email";
    if (!password) validationErrors.password = "Enter Password";

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://api.nocodi.ir/iam/login/password/", {
        email,
        password
      });

      if (response.status === 200) {
        localStorage.setItem("token", response.data.access_token);
        toast.success("You are successfully logged in", { position: "top-left", autoClose: 3000 });
        navigate("/");
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage, { position: "top-left", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Login">
      <ToastContainer />

      <form onSubmit={handleSubmit} className="bg-patina-50 p-12 rounded-xl shadow-md w-1/2 relative overflow-hidden">
        <div className="form-control">
          <label className="label text-patina-700">Email</label>
          <input 
            type="email" 
            placeholder="Enter your email" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-1 focus:ring-patina-400 ${errors.email ? 'border-red-500' : 'border-patina-500'}`}
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="form-control mt-4">
          <label className="label text-patina-700">Password</label>
          <input 
            type="password" 
            placeholder="Enter your password" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.password ? 'border-red-500' : 'border-patina-500'}`}
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </div>

        <button className="btn btn-patina w-full mt-6 bg-patina-500 text-white hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" type="submit" disabled={loading}>
          {loading ? "logging in.." : "Login"}
        </button>
        
        <p className="text-center mt-4 text-sm text-patina-700">
          Don't you have an account? <a href="/signup" className="text-patina-500 hover:text-patina-700">Signup</a>
        </p>
        <p className="text-center mt-4 text-sm text-patina-700">
          Login without password? <a href="/passwordlessLogin" className="text-patina-500 hover:text-patina-700">Enter</a>
        </p>
      </form>
      
      <div className="absolute top-0 right-0 h-full w-1/2 bg-patina-500 rounded-r-xl"></div>
    </AuthLayout>
  );
}
