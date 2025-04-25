import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const validationErrors = { email: "", password: "" };
    if (!email) validationErrors.email = "Enter Email";
    if (!password) validationErrors.password = "Enter Password";
    setErrors(validationErrors);

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

        <div>
          <label className="label text-primary">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            className={`input w-full tracking-widest ${
              errors.password ? "input-error" : "input-primary"
            }`}
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <span className="text-sm text-error">{errors.password}</span>
          )}
        </div>

        <button
          className="btn w-full transition-all btn-lg btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="space-y-2 text-center text-sm">
          <p>
            Do you have an account?{" "}
            <Link to="/login" className="link-primary">
              Enter
            </Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
