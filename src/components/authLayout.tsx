export default function AuthLayout({ children, title }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-cream-50">
      <div className="card w-96 bg-cream-100 shadow-lg p-6 rounded-xl" dir="rtl">
        <h2 className="text-2xl font-bold text-center mb-4 text-cream-600">{title}</h2>
        {children}
      </div>
    </div>
  );
}
