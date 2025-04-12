import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const testimonials = [
  {
    quote: `I've said it many times. But I'll say it again. Nocodi is the GOAT.
        Anything is possible with Nocodi. You just need some technical knowledge + imagination. I'm actually looking to start a side project. Just to have an excuse to use Nocodi more 😅`,
    name: "Maxim Poulsen",
    handle: "@maximpoulsen",
    avatar: "https://i.pravatar.cc/100?img=15",
  },
  {
    quote: `Nocodi helped me automate my workflow in ways I couldn't imagine.
      It's the best thing that happened to my productivity.`,
    name: "Lara Jenkins",
    handle: "@laraj",
    avatar: "https://i.pravatar.cc/100?img=47",
  },
  {
    quote: `I built and deployed my MVP in 2 days using Nocodi.
      This tool is next level.`,
    name: "Daniel Nguyen",
    handle: "@danieldev",
    avatar: "https://i.pravatar.cc/100?img=32",
  },
];

export default function About() {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  const scroll = (direction: string) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
    scrollRef.current.scrollTo({
      left: scrollLeft + scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <section
      className="bg-gradient-to-b from-patina-100 to-white px-4 py-20"
      id="about"
    >
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-patina-600">
            What our users say
          </h2>
          <p className="mt-4 text-lg text-patina-800">
            Real feedback from developers and makers.
          </p>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll("left")}
            className="btn absolute top-1/2 left-0 z-10 btn-circle -translate-y-1/2 btn-ghost hover:bg-patina-200"
          >
            <ChevronLeft className="h-6 w-6 text-patina-600" />
          </button>

          <div className="scrollbar-hide overflow-x-auto" ref={scrollRef}>
            <div className="flex w-max gap-6 px-10">
              {testimonials.map((t, index) => (
                <div
                  key={index}
                  className="card max-w-sm min-w-[300px] border border-patina-200 bg-gradient-to-br from-white via-patina-50 to-white shadow-lg backdrop-blur-md"
                >
                  <div className="card-body">
                    <p className="font-semibold text-patina-900">“{t.quote}”</p>
                    <div className="mt-6 flex items-center gap-3">
                      <img
                        src={t.avatar}
                        alt={t.name}
                        className="h-10 w-10 rounded-full ring-2 ring-patina-400"
                      />
                      <div>
                        <p className="font-semibold text-patina-800">
                          {t.name}
                        </p>
                        <p className="text-sm text-patina-600">{t.handle}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="card max-w-sm min-w-[300px] border border-patina-200 bg-gradient-to-br from-white via-patina-50 to-white shadow-lg backdrop-blur-md">
                <div className="card-body">
                  <p className="font-semibold text-patina-900">
                    “{testimonials[0].quote}”
                  </p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={testimonials[0].avatar}
                      alt={testimonials[0].name}
                      className="h-10 w-10 rounded-full ring-2 ring-patina-400"
                    />
                    <div>
                      <p className="font-semibold text-patina-800">
                        {testimonials[0].name}
                      </p>
                      <p className="text-sm text-patina-600">
                        {testimonials[0].handle}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => scroll("right")}
            className="btn absolute top-1/2 right-0 z-10 btn-circle -translate-y-1/2 btn-ghost hover:bg-patina-200"
          >
            <ChevronRight className="h-6 w-6 text-patina-600" />
          </button>
        </div>
      </div>
    </section>
  );
}
