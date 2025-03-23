import { useState } from "react";
import AuthLayout from "../components/authLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "" });


  const handleSubmit = (e) => {
    e.preventDefault();
    let validationErrors = {};
    if (!email) validationErrors.email = "ایمیل را وارد کنید";
    if (!password) validationErrors.password = "رمز عبور را وارد کنید";
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      console.log("Form submitted", { email, password });
    }
  };

  return (
    <AuthLayout title="ورود">
      <form onSubmit={handleSubmit} className="bg-patina-50 p-6 rounded-xl shadow-md">
        <div className="form-control">
          <label className="label text-patina-700">ایمیل</label>
          <input 
            type="email" 
            placeholder="ایمیل خود را وارد کنید" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-1 focus:ring-patina-400 ${errors.email ? 'border-red-500' : 'border-patina-500'}`}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email}</span>}
        </div>
        
        <div className="form-control mt-4">
          <label className="label text-patina-700">رمز عبور</label>
          <input 
            type="password" 
            placeholder="رمز عبور خود را وارد کنید" 
            className={`input input-bordered w-full bg-patina-100 border-patina-500 text-patina-900 tracking-widest rounded-xl focus:ring-2 focus:ring-patina-400 ${errors.password ? 'border-red-500' : 'border-patina-500'}`}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password}</span>}
        </div>
        
        <button className="btn btn-patina w-full mt-6 bg-patina-500 text-patina-100 hover:bg-patina-700 transition-all rounded-xl text-lg font-semibold" type="submit">
          ورود
        </button>
        
        <p className="text-center mt-4 text-sm text-patina-700">
          حساب کاربری ندارید؟ <a href="/signup" className="text-patina-500 hover:text-patina-700">ثبت نام</a>
        </p>
      </form>
    </AuthLayout>
  );
}
