import React from "react";
import flowImage from "../assets/flow.png";
import hero from "../assets/HeroSection.png";

export default function Services() {
  return (
    <section className="bg-gradient-to-b from-patina-100 to-white px-4 py-12 text-white">
      <form className="to-patina-25 mx-auto max-w-6xl rounded-xl border border-patina-400 bg-gradient-to-b from-patina-50 p-6 shadow-lg">
        <div className="mb-10 inline-block w-full cursor-pointer rounded-xl border border-patina-500 bg-gradient-to-b from-patina-500 to-patina-300 px-6 py-4 text-center shadow-md hover:bg-patina-600">
          <h2 className="text-xl font-semibold text-white">Telegram Bot ⚡</h2>
          <p className="mt-2 text-sm text-white">
            Automate workflows and integrate tasks across departments using a
            Telegram bot.
          </p>
        </div>

        {/* Flow Image */}
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
