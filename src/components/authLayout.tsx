export default function AuthLayout({ children, title }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-patina-50">
      <div className="card w-96 bg-patina-100 shadow-lg p-6 rounded-xl" dir="rtl">
        <h2 className="text-2xl font-bold text-center mb-4 text-patina-600">{title}</h2>
        {children}
      </div>
    </div>
  );
}
