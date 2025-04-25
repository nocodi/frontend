import landing from "../../assets/landing.png";
export default function HeroSection() {
  const heroData = {
    title: "Welcome to Nocodi",
    description: "Simplify your coding. Fast, flexible, and user-friendly.",
  };

  return (
    <section
      id="hero"
      className="flex h-[500px] items-center justify-center bg-gradient-to-b from-white to-patina-100 px-4 py-10"
    >
      <div className="flex w-full max-w-7xl flex-col-reverse items-center gap-8 md:flex-row">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <h1 className="text-4xl font-bold text-patina-500">
            {heroData.title}
          </h1>
          <p className="text-lg text-base-content text-patina-500">
            {heroData.description}
          </p>
        </div>

        <div className="flex flex-1 justify-center">
          <img
            src={landing}
            alt="Hero"
            className="max-w-md rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
}
