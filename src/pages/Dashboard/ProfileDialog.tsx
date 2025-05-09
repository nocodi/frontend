import { use, useRef, useState } from "react";
import { UserRoundCog } from "lucide-react";
import api from "../../services/api";
import axios from "axios";
import { toast } from "react-toastify";
import { AuthContext } from "../../services/Auth";

export default function ProfileDialog() {
  const [pass, setPass] = useState("");
  const [passConfirm, setPassConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const modalRef = useRef<HTMLDialogElement>(null);
  const { logout } = use(AuthContext);

  const resetForm = () => {
    setPass("");
    setPassConfirm("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    api
      .put("iam/update/password/", { email: "kooft@nocodi.ir", password: pass })
      .then(
        () => {
          resetForm();
          modalRef.current?.close();
          toast.success("Password updated successfully!");
        },
        (err) => {
          const errorMessage =
            axios.isAxiosError(err) ?
              err.response?.data?.message || err.message
            : "An unexpected error occurred.";
          toast.error(errorMessage);
        },
      )
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <>
      {/* Open button */}
      <button className="btn" onClick={() => modalRef.current?.showModal()}>
        <UserRoundCog className="size-6" />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          {/* <h3 className="text-lg font-bold">Your Profile</h3> */}

          {/* Profile Section */}
          {/* <div className="flex items-center gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">John Doe</h4>
              <p className="text-sm text-neutral-500">johndoe@example.com</p>
            </div>
          </div> */}

          {/* Password Change Form */}
          <form onSubmit={handleSubmit}>
            <h4 className="mb-4 text-lg font-bold">Set Password</h4>
            <div className="flex w-full flex-col gap-4">
              <input
                type="password"
                placeholder="New password"
                className="input-bordered input w-full input-primary"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                required
              />
              <input
                type="password"
                placeholder="New Password Confirmation"
                className="input-bordered input w-full input-primary"
                value={passConfirm}
                onChange={(e) => setPassConfirm(e.target.value)}
                required
              />
            </div>

            <div className="modal-action">
              <button
                type="button"
                className="btn mr-auto btn-error"
                onClick={() => {
                  logout();
                }}
              >
                Logout
              </button>
              <button
                type="button"
                className="btn"
                onClick={() => {
                  resetForm();
                  modalRef.current?.close();
                }}
              >
                Close
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  loading || !pass || !passConfirm || pass !== passConfirm
                }
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
