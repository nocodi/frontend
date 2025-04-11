import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-patina-50">
      <div className="card w-200 rounded-xl bg-patina-100 p-6 shadow-lg">
        <h2 className="mb-4 text-left text-2xl font-bold text-patina-600">
          {title}
        </h2>
        {children}
      </div>
    </div>
  );
}
