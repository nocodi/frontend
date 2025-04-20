import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../services/api";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
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

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setPassword(value);

    if (!value) {
      setErrors((prev) => ({ ...prev, password: "Enter Password" }));
    } else {
      setErrors((prev) => ({ ...prev, password: "" }));
    }
  };

  const handleSignup = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);

    try {
      const response = await api.post("iam/signup/", { email, password });
      localStorage.setItem("request_id", response.data.request_id);
      localStorage.setItem("request_type", "signup");
      await navigate("/verification");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) ?
          err.response?.data?.message || err.message
        : "An unexpected error occurred.";
      toast.error(errorMessage, { position: "top-left", autoClose: 3000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Sign Up">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-sm space-y-6 sm:max-w-md md:max-w-lg"
      >
        <div className="form-control">
          <label className="label text-sm font-semibold text-patina-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your Email"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${
              errors.email ? "border-red-500" : "border-patina-500"
            }`}
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="form-control">
          <label className="label text-sm font-semibold text-patina-700">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your Password"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${
              errors.password ? "border-red-500" : "border-patina-500"
            }`}
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </div>

        <button
          className="btn-patina btn w-full rounded-xl bg-patina-500 py-2 text-lg font-semibold text-white transition-all hover:bg-patina-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="space-y-2 text-center text-sm text-patina-700">
          <p>
            Do you have an account?{" "}
            <a href="/login" className="text-patina-500 hover:text-patina-700">
              Enter
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
