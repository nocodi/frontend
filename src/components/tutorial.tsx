const tutorials = [
  {
    title: "Connect Telegram Bot",
    description:
      "Easily connect your bot to the Telegram API and start interacting with users instantly.",
  },
  {
    title: "Handle Commands",
    description:
      "Respond to /commands like /start or /help using Node.js or your preferred backend.",
  },
  {
    title: "Integrate with Backend",
    description:
      "Securely send data between your Telegram bot and your backend services or databases.",
  },
  {
    title: "Deploy with Docker",
    description:
      "Use Docker for quick and reproducible deployments to your cloud or server.",
  },
];

export default function TutorialSection() {
  return (
    <section className="bg-gradient-to-b from-white to-patina-100 px-4 py-16 text-white">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-white bg-gradient-to-b from-patina-50 to-white p-6 shadow-lg">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-10 text-3xl font-bold text-patina-500">
            Telegram Bot Tutorials
          </h2>
          <p className="mx-auto mb-16 max-w-2xl text-patina-500">
            Learn how to build, deploy, and scale your Telegram bot step by
            step.
          </p>
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
