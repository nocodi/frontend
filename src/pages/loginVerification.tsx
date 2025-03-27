import axios from "axios";
import AuthLayout from "../components/authLayout";
import { useState, useEffect } from "react";

export default function LoginVerification() {
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState({ code: "" });
  const [loading, setLoading] = useState(false);
  const [requestId, setRequestId] = useState("");

  useEffect(() => {
    const reqID = localStorage.getItem("request_id");
    if (reqID) {
      setRequestId(reqID);
    }
  }, []);

  const handleVerification = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({ code: "" });
    setLoading(true);

    if (!requestId) {
      setErrors({ code: "کد درخواست یافت نشد. لطفاً دوباره ثبت‌نام کنید." });
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://api.nocodi.ir/iam/login/otp/verify/",
        {
          otp: code,
          request_id: requestId,
        },
      );

      if (response.status === 201) {
        console.log(response.data);
      } else {
        console.log(response.status);
      }
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const apiError = err.response?.data;
        console.log(err.response?.data?.message);
        if (apiError?.message?.detail) {
          setErrors({ code: apiError.detail });
        } else if (apiError?.code) {
          setErrors({ code: apiError.code[0] });
        } else {
          setErrors({ code: "خطایی رخ داد. لطفاً دوباره امتحان کنید." });
        }
      } else {
        setErrors({ code: "خطای ناشناخته‌ای رخ داد." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout title="تایید ایمیل">
      <form
        onSubmit={handleVerification}
        className="rounded-xl bg-patina-50 p-6 shadow-md"
      >
        <div className="form-control">
          <label className="label text-lg font-medium text-patina-700">
            کد تایید
          </label>
          <input
            type="text"
            placeholder="کد تایید را وارد کنید"
            className="input-bordered input w-full rounded-xl border-patina-500 bg-patina-100 text-center text-sm tracking-widest text-patina-900 focus:ring-2 focus:ring-patina-400"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
        </div>
        <button
          className="btn mt-6 w-full rounded-xl bg-patina-500 text-lg font-semibold text-patina-100 transition-all hover:bg-patina-700"
          disabled={loading}
        >
          {loading ? "در حال تایید..." : "تایید"}
        </button>
      </form>
    </AuthLayout>
  );
}
