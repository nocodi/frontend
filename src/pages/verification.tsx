import AuthLayout from "../components/authLayout";

export default function Verification() {
    return(
        <AuthLayout title="تایید ایمیل">
            <div className="form-control">
                <label className="label">کد تایید</label>
                <input type="text" placeholder="کد تایید را وارد کنید" className="input input-bordered bg-gray w-full"/>
            </div>
            <button className="btn btn-primary w-full mt-6">تایید</button>
            
        </AuthLayout>
    )
}