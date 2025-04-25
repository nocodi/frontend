export default function TutorialMain() {
  return (
    <section id="tutorial" className="bg-base-200 px-4 py-16 text-white">
      <form className="mx-auto max-w-6xl rounded-xl border border-patina-400 bg-base-200 p-6 shadow-lg">
        <div className="flex items-center justify-center py-10">
          <div className="aspect-video w-full max-w-4xl">
            <iframe
              className="h-full w-full rounded-xl shadow-lg"
              src="https://www.youtube.com/embed/dQw4w9WgXcQ"
              title="Tutorial Video"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </form>
    </section>
  );
}
