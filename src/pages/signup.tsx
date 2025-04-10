import { ChangeEvent, FormEvent, useState } from "react";
import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
    // setErrors("");
    setLoading(true);

    try {
      const response = await axios.post("iam/signup/", {
        email,
        password,
      });
      if (response.status == 201) {
        console.log(response.status);
        console.log(response.data);
        localStorage.setItem("request_id", response.data.request_id);
        toast.success("Registration was successful", {
          position: "top-left",
          autoClose: 3000,
        });
        await navigate("/verification");
      } else {
        console.log(response.status);
        toast.error("Registration failed", {
          position: "top-left",
          autoClose: 3000,
        });
      }
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
    <AuthLayout title="SignUp">
      <ToastContainer />
      <form
        onSubmit={handleSignup}
        className="relative w-1/2 overflow-hidden rounded-xl bg-patina-50 p-16 shadow-md"
        dir="ltr"
      >
        <div className="form-control">
          <label className="label text-patina-700">Email</label>
          <input
            type="email"
            placeholder="Enter your Email"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${errors.email ? "border-red-500" : "border-patina-500"}`}
            value={email}
            onChange={handleEmailChange}
          />
          {errors.email && (
            <span className="text-sm text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="form-control mt-4">
          <label className="label text-patina-700">Password</label>
          <input
            type="password"
            placeholder="Enter your Password"
            className={`input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400 ${errors.password ? "border-red-500" : "border-patina-500"}`}
            value={password}
            onChange={handlePasswordChange}
          />
          {errors.password && (
            <span className="text-sm text-red-500">{errors.password}</span>
          )}
        </div>

        <button
          className="btn-patina btn mt-6 w-full rounded-xl bg-patina-500 text-lg font-semibold text-white transition-all hover:bg-patina-700"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="mt-4 text-center text-sm text-patina-700">
          Do you have an account?
          <a href="/" className="text-patina-500 hover:text-patina-700">
            Enter
          </a>
        </p>
      </form>
      <div className="absolute top-0 right-0 h-full w-1/2 rounded-r-xl bg-patina-500"></div>
    </AuthLayout>
  );
}
