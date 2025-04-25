import landing from "../../assets/landing.png";

export default function HeroSectionTutorial() {
  const heroData = {
    title: "Nocodi Tutorial",
    description: "You can see tutorial...",
  };

  return (
    <section
      id="hero"
      className="relative flex h-[500px] items-center justify-center bg-base-300 px-4 py-10"
    >
      <div
        className="absolute inset-0 z-0 bg-base-200 bg-cover bg-center"
        style={{
          backgroundImage: `url(${landing})`,
        }}
      >
        <div className="h-full w-full bg-white/30 backdrop-blur-md"></div>
      </div>
      <div className="relative z-10 flex w-full max-w-3xl flex-col items-center justify-center space-y-6 text-center">
        <h1 className="text-4xl font-bold text-patina-500">{heroData.title}</h1>
        <p className="text-lg text-patina-500">{heroData.description}</p>
        <button
          onClick={() => {
            document
              .getElementById("tutorial")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
          className="btn-patina btn rounded-xl bg-patina-500 px-6 py-2 text-lg font-semibold text-white transition-all hover:bg-patina-700"
        >
          See More
        </button>
      </div>
    </section>
  );
}
