import { ChangeEvent, FormEvent, use, useState } from "react";
import AuthLayout from "../components/authLayout";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../services/Auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = use(AuthContext);

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
      const response = await api.post("iam/login/password/", {
        email,
        password,
      });

      login(response.data.access_token);
      toast.success("You are successfully logged in", {
        position: "top-left",
        autoClose: 3000,
      });
      await navigate("/");
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
    <AuthLayout title="Login">
      <form onSubmit={handleSubmit} className="w-full space-y-6">
        <div className="form-control">
          <label className="label text-sm font-semibold text-patina-700">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className={`input-bordered input w-full rounded-xl border bg-patina-100 tracking-widest text-patina-900 focus:ring-1 focus:ring-patina-400 ${
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
            placeholder="Enter your password"
            className={`input-bordered input w-full rounded-xl border bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${
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
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="space-y-2 text-center text-sm text-patina-700">
          <p>
            Don't you have an account?{" "}
            <a href="/signup" className="text-patina-500 hover:text-patina-700">
              Signup
            </a>
          </p>
          <p>
            Login without password?{" "}
            <a
              href="/passwordlessLogin"
              className="text-patina-500 hover:text-patina-700"
            >
              Enter
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
