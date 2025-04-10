import AuthLayout from "../components/authLayout";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import api from "../services/api";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const getRequestId = () => localStorage.getItem("request_id");

export default function LoginVerification() {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!getRequestId()) void navigate("/");

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ code: "" });
    setLoading(true);

    try {
      const response = await api.post("iam/login/otp/verify/", {
        otp: code,
        request_id: getRequestId(),
      });

      if (response.status === 201) {
        console.log(response.data);
        toast.success("You are successfully logged in", {
          position: "top-left",
          autoClose: 3000,
        });
      } else {
        console.log(response.status);
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
    <AuthLayout title="Email Verification">
      <ToastContainer />
      <form
        onSubmit={handleVerification}
        className="relative w-1/2 overflow-hidden rounded-xl bg-patina-50 p-12 shadow-md"
        dir="ltr"
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
