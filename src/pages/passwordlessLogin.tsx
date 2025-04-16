import axios from "axios";
import api from "../services/api";
import AuthLayout from "../components/authLayout";
import { ChangeEvent, FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function PasswordlessLogin() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ email: "" });
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

  const handlePasswordlessLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setLoading(true);

    try {
      const response = await api.post("iam/login/otp/send/", { email });
      localStorage.setItem("request_id", response.data.request_id);
      localStorage.setItem("request_type", "login");
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
    <AuthLayout title="Passwordless Login">
      <form
        onSubmit={handlePasswordlessLogin}
        className="w-full max-w-sm space-y-6 sm:max-w-md md:max-w-lg"
      >
        <div className="form-control">
          <label className="label text-patina-700">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${
              errors.email ? "border-red-500" : "border-patina-500"
            }`}
            onChange={handleEmailChange}
            value={email}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>
        <button
          className="btn-patina btn w-full rounded-xl bg-patina-500 text-lg font-semibold text-white transition-all hover:bg-patina-700"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
      <div className="absolute top-0 right-0 hidden h-full w-1/2 rounded-r-xl bg-patina-500 lg:block"></div>
    </AuthLayout>
  );
}
