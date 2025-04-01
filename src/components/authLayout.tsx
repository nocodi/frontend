export default function AuthLayout({ children, title }) {
  return (
    <div className="flex justify-center items-center min-h-screen bg-patina-50">
      <div className="card w-200 bg-patina-100 shadow-lg p-6 rounded-xl">
        <h2 className="text-2xl font-bold text-left mb-4 text-patina-600" dir="ltr">{title}</h2>
        {children}
      </div>
    </div>
    
  );
}
