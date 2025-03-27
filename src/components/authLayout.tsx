import { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
}

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-patina-50">
      <div
        className="card w-96 rounded-xl bg-patina-100 p-6 shadow-lg"
        dir="rtl"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-patina-600">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
