import axios from "axios";
import AuthLayout from "../components/authLayout";
import { use, useState } from "react";
import { toast } from "react-toastify";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/Auth";

const getRequestId = () => localStorage.getItem("request_id");

export default function Verification() {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = use(AuthContext);

  if (!getRequestId()) void navigate("/login");

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!code) {
      setErrors({ code: "Please enter the code" });
      return;
    }
    setErrors({ code: "" });
    setLoading(true);

    try {
      const requestType = localStorage.getItem("request_type");
      let requestPath;
      if (requestType == "login") requestPath = "iam/login/otp/verify/";
      else if (requestType == "signup") requestPath = "iam/signup/verify/";
      else {
        await navigate("/login");
        return;
      }

      const response = await api.post(requestPath, {
        otp: code,
        request_id: getRequestId(),
      });

      login(response.data.access_token);
      toast.success("You are successfully logged in", {
        position: "top-left",
        autoClose: 3000,
      });
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
    <AuthLayout title="Email Verification">
      <form
        onSubmit={handleVerification}
        className="relative w-1/2 overflow-hidden rounded-xl bg-patina-50 p-12 shadow-md"
      >
        <div className="form-control">
          <label className="label text-lg font-medium text-patina-700">
            Verification Code
          </label>
          <input
            type="text"
            placeholder="Enter verification code"
            className="input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 text-center text-sm tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
        </div>
        <button
          className="btn mt-6 w-full rounded-xl bg-patina-500 text-lg font-semibold text-white transition-all hover:bg-patina-700"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
      <div className="absolute top-0 right-0 h-full w-1/2 rounded-r-xl bg-patina-500"></div>
    </AuthLayout>
  );
}
