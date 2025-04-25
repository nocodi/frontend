export default function AboutUs() {
  return (
    <section
      id="about-us"
      className="bg-gradient-to-b from-white to-patina-100 px-4 py-16 text-patina-500"
    >
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-gradient-to-b from-patina-50 to-white p-6 shadow-lg">
        <div className="mx-auto max-w-6xl text-center">
          <h2 className="mb-6 text-4xl font-bold">About Us</h2>
          <p className="mb-4 text-lg">
            At <span className="font-semibold text-patina-600">NoCodi</span>, we
            believe everyone should be able to automate and innovate—no coding
            required.
          </p>
          <p className="mb-4 text-lg">
            Our platform empowers creators, marketers, and entrepreneurs to
            build powerful <span className="font-semibold">Telegram bots</span>{" "}
            and workflows using a drag-and-drop interface. Whether you're
            sending daily updates, automating responses, or integrating with
            other services, it's all possible—without writing a single line of
            code.
          </p>
          <p className="mb-4 text-lg">
            We’re passionate about removing technical barriers so you can focus
            on what matters: growing your ideas.
          </p>
          <p className="mt-6 text-lg font-medium text-patina-700">
            Build smarter. Launch faster. No code, just creativity.
          </p>
        </div>
      </form>
    </section>
  );
}
