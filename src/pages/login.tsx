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
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="space-y-2 text-center text-sm">
          <p>
            Don't you have an account?{" "}
            <a href="/signup" className="link-primary">
              Signup
            </a>
          </p>
          <p>
            Login without password?{" "}
            <a href="/passwordlessLogin" className="link-primary">
              Enter
            </a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
}
