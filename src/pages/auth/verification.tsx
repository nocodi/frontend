import { use, useState } from "react";
import axios from "axios";
import AuthLayout from "../../components/authLayout";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../services/api";
import { AuthContext } from "../../services/Auth";

const getRequestId = () => localStorage.getItem("request_id");

export default function Verification() {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = use(AuthContext);

  if (!getRequestId()) void navigate("/login");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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

      localStorage.removeItem("request_id");
      localStorage.removeItem("request_type");
      login(response.data.access_token);
      toast.success("You are successfully logged in");
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
    <AuthLayout title="Email Verification">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 sm:max-w-md md:max-w-lg"
      >
        <div>
          <label className="label text-primary">Verification Code</label>
          <input
            type="text"
            placeholder="Enter verification code"
            className="input w-full tracking-widest"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errors.code && <p className="text-sm text-error">{errors.code}</p>}
        </div>
        <button
          className="btn w-full transition-all btn-lg btn-primary"
          type="submit"
          disabled={loading}
        >
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthLayout>
  );
}
