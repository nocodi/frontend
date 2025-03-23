import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";

export default function Signup() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        

        try {
            const response = await axios.post("http://api.nocodi.ir/iam/signup", {
                email,
                password,
            });
            if (response.status == 201){
                console.log(response.status);
            }
            else{
                console.log(response.status);
            }
        } catch (err) {
            setError(err.response?.data?.message || "خطایی رخ داد. لطفاً دوباره امتحان کنید.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="ثبت نام">
            <form onSubmit={handleSignup}>
                <div className="form-control">
                    <label className="label">ایمیل</label>
                    <input
                        type="email"
                        placeholder="ایمیل خود را وارد کنید"
                        className="input input-bordered bg-gray w-full"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-control mt-4">
                    <label className="label">رمز عبور</label>
                    <input
                        type="password"
                        placeholder="رمز عبور خود را وارد کنید"
                        className="input input-bordered bg-gray w-full"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
                <button className="btn btn-primary w-full mt-6" disabled={loading}>
                    {loading ? "در حال ثبت نام..." : "ثبت نام"}
                </button>
                <p className="text-center mt-4 text-sm">
                    حساب کاربری دارید؟ <a href="/" className="text-white-500">ورود</a>
                </p>
            </form>
        </AuthLayout>
    );
}
