const tutorials = [
  {
    title: "Phone",
    description: "+98939371901",
  },
  {
    title: "Email",
    description: "NoCodi@gmail.com",
  },
];
export default function ContactUs() {
  return (
    <section className="bg-gradient-to-b from-patina-100 to-white px-4 py-16 text-white">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-white bg-gradient-to-b from-patina-50 to-white p-6 shadow-lg">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-10 text-3xl font-bold text-patina-500">NoCodi</h2>
          <h1 className="mx-auto mb-16 max-w-2xl text-2xl text-patina-500">
            You can contact us via
          </h1>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-2">
            {tutorials.map((tutorial, index) => (
              <div
                key={index}
                className="rounded-xl bg-gradient-to-b from-patina-500 to-patina-300 p-6 shadow-lg transition-shadow hover:shadow-patina-700"
              >
                <h3 className="mb-3 text-xl font-semibold">{tutorial.title}</h3>
                <p className="text-white-300">{tutorial.description}</p>
              </div>
            ))}
          </div>
        </div>
      </form>
    </section>
  );
}
