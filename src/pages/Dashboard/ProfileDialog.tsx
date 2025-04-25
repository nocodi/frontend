import { useRef, useState } from "react";
import { UserRoundCog } from "lucide-react";

export default function ProfileDialog() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const modalRef = useRef<HTMLDialogElement>(null);

  const handleSubmit = (e: unknown) => {
    // e.preventDefault();
    // Add password change logic here
    console.log("Password change submitted");
  };

  return (
    <>
      {/* Open button */}
      <button className="btn" onClick={() => modalRef.current?.showModal()}>
        <UserRoundCog className="size-6" />
      </button>

      <dialog ref={modalRef} className="modal">
        <div className="modal-box">
          <h3 className="mb-6 text-2xl font-bold">Profile Settings</h3>

          {/* Profile Section */}
          <div className="mb-8 flex items-center gap-4">
            <div className="avatar">
              <div className="w-24 rounded-full">
                <img src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
              </div>
            </div>
            <div>
              <h4 className="text-xl font-semibold">John Doe</h4>
              <p className="text-sm text-neutral-500">johndoe@example.com</p>
            </div>
          </div>

          {/* Password Change Form */}
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Current Password</span>
                </label>
                <input
                  type="password"
                  className="input-bordered input"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">New Password</span>
                </label>
                <input
                  type="password"
                  className="input-bordered input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Confirm New Password</span>
                </label>
                <input
                  type="password"
                  className="input-bordered input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="modal-action">
              <button type="submit" className="btn btn-primary">
                Change Password
              </button>
              <form method="dialog">
                <button className="btn">Close</button>
              </form>
            </div>
          </form>
        </div>

        {/* Backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
}
