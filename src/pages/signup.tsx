import { useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setError] = useState({ email: "", password: "", api: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError({ email: "", password: "", api: "" });
    setLoading(true);

    try {
      const response = await axios.post("http://api.nocodi.ir/iam/signup/", {
        email,
        password,
      });
      if (response.status == 201) {
        console.log(response.status);
        console.log(response.data);
        localStorage.setItem("request_id", response.data.request_id);
        toast.success("ثبت نام موفقیت آمیز بود", {
          position: "top-right",
          autoClose: 3000,
        });
        await navigate("/verification");
      } else {
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
      <form
        onSubmit={handleSignup}
        className="mt-5 rounded-xl bg-patina-50 p-6 shadow-md"
      >
        <div className="form-control">
          <label className="label mb-1.5 text-patina-700">ایمیل</label>
          <input
            type="email"
            placeholder="ایمیل خود را وارد کنید"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${errors.email ? "border-red-500" : "border-patina-500"}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="form-control mt-4">
          <label className="label mb-1.5 text-patina-700">رمز عبور</label>
          <input
            type="password"
            placeholder="رمز عبور خود را وارد کنید"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${errors.password ? "border-red-500" : "border-patina-500"}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </div>

        {errors.api && (
          <p className="mt-2 text-sm text-red-500">{errors.api}</p>
        )}

        <button
          className="btn-patina btn mt-6 w-full rounded-xl bg-patina-500 text-lg font-semibold text-patina-100 transition-all hover:bg-patina-700"
          disabled={loading}
        >
          {loading ? "در حال ثبت نام..." : "ثبت نام"}
        </button>

        <div className="mt-3 text-center text-sm text-patina-700">
          حساب کاربری دارید؟{" "}
          <a href="/" className="text-patina-500 hover:text-patina-700">
            ورود
          </a>
        </div>
      </form>
    </AuthLayout>
  );
}
