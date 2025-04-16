import { ReactNode } from "react";

type AuthLayoutProps = {
  children: ReactNode;
  title: string;
};

export default function AuthLayout({ children, title }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-patina-200 to-white px-4 py-10 sm:px-6 lg:px-8">
      <div className="relative flex w-full max-w-4xl overflow-hidden rounded-xl bg-patina-100 shadow-lg">
        <div className="w-full p-6 sm:p-10 md:p-12 lg:w-1/2">
          <h2 className="mb-6 text-left text-2xl font-bold text-patina-600">
            {title}
          </h2>
          {children}
        </div>
        <div className="hidden w-1/2 bg-patina-500 lg:block"></div>
      </div>
    </div>
  );
}
