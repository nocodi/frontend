import AuthLayout from "../components/authLayout";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";


export default function ForgetPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const [_, setError] = useState("");


    const handleForgetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError("");
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
            } else {
                console.log(response.status);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const apiError = err.response?.data;
                if (apiError?.message) {
                    setError( apiError.message );
                } else if (apiError?.detail) {
                    setError(apiError.detail);
                } else if (apiError?.code) {
                    setError(apiError.code[0]);
                } else {
                    setError("خطایی رخ داد. لطفاً دوباره امتحان کنید." );
                }
            } else {
                setError("خطای ناشناخته‌ای رخ داد.");
            }
        } finally {
            setLoading(false);
        }
    };

    return(
    <AuthLayout title="ورود بدون رمز عبور">
        <form onSubmit={handleForgetPassword} className="bg-patina-50 p-6 rounded-xl shadow-md">
            <div className="form-control">
                <label className="label text-patina-700">ایمیل</label>
                <input
                    type="email"
                    placeholder="ایمیل خود را وارد کنید"
                    className="input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400"
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
            </div>
            <button className="btn btn-patina w-full mt-6 bg-patina-500 text-patina-100 hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" type="submit" disabled={loading}>
                {loading ? "در حال ارسال...": "ارسال"}                
            </button>
        </form>

    </AuthLayout>
    );
}