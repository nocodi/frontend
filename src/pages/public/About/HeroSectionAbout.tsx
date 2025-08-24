import landing from "../../../assets/landing.png";

export default function HeroSectionAbout() {
  const heroData = {
    title: "About Nocodi",
    description: "Simplify your coding. Fast, flexible, and user-friendly.",
  };

  return (
    <section
      id="hero"
      className="relative flex h-[500px] items-center justify-center bg-base-300 px-4 py-10"
    >
      <div
        className="absolute inset-0 z-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${landing})`,
        }}
      >
        <div className="h-full w-full bg-white/30 backdrop-blur-md"></div>
      </div>
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-4xl font-bold text-primary">{heroData.title}</h1>
        <p className="text-lg text-primary">{heroData.description}</p>
        <button
          onClick={() => {
            document
              .getElementById("about-us")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn-patina btn rounded-xl bg-primary px-6 py-2 text-lg font-semibold text-white transition-all hover:bg-primary"
        >
          See More
        </button>
      </div>
    </section>
  );
}
