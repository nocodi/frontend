import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import AuthLayout from "../../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";

export default function PasswordlessLogin() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ email: "" });
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = { email: "" };
    if (!email) validationErrors.email = "Enter Email";
    setErrors(validationErrors);

    if (!email) return;
    setLoading(true);

    try {
      const response = await api.post("iam/login/otp/send/", { email });
      localStorage.setItem("request_id", response.data.request_id);
      localStorage.setItem("request_type", "login");
      toast.success("OTP sent to your email");
      await navigate("/verification");
    } catch (err) {
      const errorMessage =
        axios.isAxiosError(err) ?
          err.response?.data?.message || err.message
        : "An unexpected error occurred.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="Passwordless Login">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 sm:max-w-md md:max-w-lg"
      >
        <div>
          <label className="label text-primary">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`input w-full tracking-widest ${
              errors.email ? "input-error" : "input-primary"
            }`}
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <span className="text-sm text-error">{errors.email}</span>
          )}
        </div>
        <button
          className="btn w-full transition-all btn-lg btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </form>
    </AuthLayout>
  );
}
