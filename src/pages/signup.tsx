import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setError] = useState({ email: "", password: "", api: ""});
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();


    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError({ email: "", password: "", api: ""});
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
                toast.success("ثبت نام موفقیت آمیز بود", {
                    position: "top-right",
                    autoClose: 3000,
                });
                navigate("/verification");
            }
            else{
                console.log(response.status);
                toast.error("ثبت نام ناموفق بود", {
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
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="ثبت نام">
            <form onSubmit={handleSignup} className="bg-patina-50 p-6 rounded-xl shadow-md">
                <div className="form-control">
                    <label className="label text-patina-700">ایمیل</label>
                    <input
                        type="email"
                        placeholder="ایمیل خود را وارد کنید"
                        className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.email ? 'border-red-500' : 'border-patina-500'}`}
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
                
                
                {errors.api && <p className="text-red-500 text-sm mt-2">{errors.api}</p>}
                
                <button className="btn btn-patina w-full mt-6 bg-patina-500 text-patina-100 hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" disabled={loading}>
                    {loading ? "در حال ثبت نام..." : "ثبت نام"}
                </button>
                
                <p className="text-center mt-4 text-sm text-patina-700">
                    حساب کاربری دارید؟ <a href="/" className="text-patina-500 hover:text-patina-700">ورود</a>
                </p>
            </form>
        </AuthLayout>
    );
}
