import hero from "../../../assets/HeroSection.png";

export default function Services() {
  return (
    <section className="bg-base-300 px-4 py-12 text-white">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-base-200 p-6 shadow-lg">
        <div className="mb-10 inline-block w-full cursor-pointer rounded-xl border border-primary bg-base-300 px-6 py-4 text-center shadow-md hover:bg-base-200">
          <h2 className="text-xl font-semibold text-primary">
            Telegram Bot ⚡
          </h2>
          <p className="mt-2 text-sm text-primary">
            Automate workflows and integrate tasks across departments using a
            Telegram bot.
          </p>
        </div>
        <div className="flex justify-center">
          <img
            src={hero}
            alt="Automation Flow"
            className="w-full max-w-5xl rounded-lg border border-[#2f2738] shadow-xl"
          />
        </div>
      </form>
    </section>
  );
}
