import { useState } from "react";
import AuthLayout from "../components/authLayout";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();



  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors("");
    setLoading(true);

    try{
      const response = await axios.post("http://api.nocodi.ir/iam/login/pasword/", {
        email: email,
        password: password
      });
      if(response.status == 200){
        console.log(response.status);
        console.log(response.data);
        localStorage.setItem("token", response.data.access_token);
        // navigate("/forgetPassword");
        toast.success("ورود موفقیت آمیز بود", {
          position: "top-right",
          autoClose: 3000,
      });
      }
      else{
        console.log(response.status);
        toast.error("ورود ناموفق بود", {
          position: "top-right",
          autoClose: 3000,
        });
      }
    } catch (err) {
      // setError(err.response?.data?.message || "خطایی رخ داد. لطفاً دوباره امتحان کنید.");
      toast.error("خطایی رخ داد. لطفاً دوباره امتحان کنید.", {
        position: "top-right",
        autoClose: 3000,
      });
    }
    finally {
      setLoading(false);
    }
  
    let validationErrors = {};
    if (!email) validationErrors.email = "ایمیل را وارد کنید";
    if (!password) validationErrors.password = "رمز عبور را وارد کنید";
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted", { email, password });
    }
  };

  return (
    <AuthLayout title="ورود">
      <ToastContainer />
      <form onSubmit={handleSubmit} className="bg-patina-50 p-6 rounded-xl shadow-md">
        <div className="form-control">
          <label className="label text-patina-700">ایمیل</label>
          <input 
            type="email" 
            placeholder="ایمیل خود را وارد کنید" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-1 focus:ring-patina-400 ${errors.email ? 'border-red-500' : 'border-patina-500'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        
        <div className="form-control mt-4">
          <label className="label text-patina-700">رمز عبور</label>
          <input 
            type="password" 
            placeholder="رمز عبور خود را وارد کنید" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.password ? 'border-red-500' : 'border-patina-500'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>
        
        <button className="btn btn-patina w-full mt-6 bg-patina-500 text-patina-100 hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" type="submit" disabled={loading}>
          {loading ? "در حال ورود..." : "ورود"}
        </button>
        
        <p className="text-center mt-4 text-sm text-patina-700">
          حساب کاربری ندارید؟ <a href="/signup" className="text-patina-500 hover:text-patina-700">ثبت نام</a>
        </p>
        <p className="text-center mt-4 text-sm text-patina-700">
          ورود بدون رمز عبور؟ <a href="/forgetPassword" className="text-patina-500 hover:text-patina-700">ورود</a>
        </p>
      </form>
    </AuthLayout>
  );
}