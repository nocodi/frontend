import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useState, useEffect } from "react";

export default function Verification() {
    const [code, setCode] = useState("");
    const [errors, setErrors] = useState({ code: "" });
    const [loading, setLoading] = useState(false);
    const [requestId, setRequestId] = useState(null); 

    useEffect(() => {
        const storedRequestId = localStorage.getItem("request_id");
        if (storedRequestId) {
            setRequestId(storedRequestId);
        } else {
            setErrors({ code: "لطفاً ابتدا ثبت نام کنید." });
        }
    }, []);

    const handleVerification = async (e) => {
        e.preventDefault();
        setErrors({ code: "" });
        setLoading(true);

        if (!requestId) {
            setErrors({ code: "کد درخواست یافت نشد. لطفاً دوباره ثبت‌نام کنید." });
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post("http://api.nocodi.ir/iam/signup/verify/", { 
                otp: code,
                request_id: requestId,
            });

            if (response.status === 201) {
                console.log(response.data);
            } else {
                console.log(response.status);
            }
        } catch (err) {
            setErrors({ code: err.response?.data?.message || "خطایی رخ داد. لطفاً دوباره امتحان کنید." });
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="تایید ایمیل">
            <form onSubmit={handleVerification} className="bg-patina-50 p-6 rounded-xl shadow-md">
                <div className="form-control">
                    <label className="label text-patina-700 text-lg font-medium">
                        کد تایید
                    </label>
                    <input
                        type="text"
                        placeholder="کد تایید را وارد کنید"
                        className="input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 text-center text-sm tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400"
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                    />
                    {errors.code && <p className="text-red-500 text-sm">{errors.code}</p>}
                </div>
                <button className="btn w-full mt-6 bg-patina-500 text-patina-100 hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" disabled={loading}>
                    {loading ? "در حال تایید..." : "تایید"}
                </button>
            </form>
        </AuthLayout>
    );
}
