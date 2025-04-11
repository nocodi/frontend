import React from "react";
import flowImage from "../assets/flow.png";

export default function AutomationFlowSection() {
  return (
    <section className="bg-white px-4 py-12 text-white">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-white p-6 shadow-lg">
        {/* Centered Card */}
        <div className="mb-10 inline-block w-full rounded-xl border border-patina-500 bg-patina-500 px-6 py-4 text-center shadow-md">
          <h2 className="text-xl font-semibold text-white">Telegram Bot ⚡</h2>
          <p className="mt-2 text-sm text-white">
            Automate workflows and integrate tasks across departments using a
            Telegram bot.
          </p>
        </div>

        {/* Flow Image */}
        <div className="flex justify-center">
          <img
            src={flowImage}
            alt="Automation Flow"
            className="w-full max-w-5xl rounded-lg border border-[#2f2738] shadow-xl"
          />
        </div>
      </form>
    </section>
  );
}
