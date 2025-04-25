import { useEffect, useRef, useState } from "react";

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
  {
    quote: `Nocodi let me turn my freelance workflow into a productized business. 
      It’s honestly like having a second developer on my team.`,
    name: "Amina Tahir",
    handle: "@aminatx",
    avatar: "https://i.pravatar.cc/100?img=21",
  },
  {
    quote: `The UI, the logic, the flexibility... everything about Nocodi is just slick.
      I’ve switched three of my projects over already.`,
    name: "Ravi Mehta",
    handle: "@ravicodes",
    avatar: "https://i.pravatar.cc/100?img=58",
  },
];

export default function About() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    const scrollSpeed = 0.5;
    let animationFrameId: number;

    const scroll = () => {
      if (!isHovered && scrollContainer) {
        scrollContainer.scrollLeft += scrollSpeed;
        if (
          scrollContainer.scrollLeft + scrollContainer.clientWidth >=
          scrollContainer.scrollWidth
        ) {
          scrollContainer.scrollLeft = 0;
        }
      }
      animationFrameId = requestAnimationFrame(scroll);
    };

    animationFrameId = requestAnimationFrame(scroll);
    return () => cancelAnimationFrame(animationFrameId);
  }, [isHovered]);

  return (
    <section className="bg-base-300 px-4 py-20" id="about">
      <div className="mx-auto max-w-7xl space-y-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-primary">
            What our users say
          </h2>
          <p className="mt-4 text-lg text-primary">
            Real feedback from developers and makers.
          </p>
        </div>

        <div
          className="scrollbar-hide overflow-x-auto"
          ref={scrollRef}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="flex w-max gap-6 px-10">
            {[...testimonials, ...testimonials.slice(0, 1)].map((t, index) => (
              <div
                key={index}
                className="card max-w-sm min-w-[300px] border border-patina-200 bg-base-200 shadow-lg backdrop-blur-md"
              >
                <div className="card-body">
                  <p className="font-semibold text-patina-900">“{t.quote}”</p>
                  <div className="mt-6 flex items-center gap-3">
                    <img
                      src={t.avatar}
                      alt={t.name}
                      className="h-10 w-10 rounded-full ring-2 ring-primary"
                    />
                    <div>
                      <p className="font-semibold text-patina-800">{t.name}</p>
                      <p className="text-sm text-primary">{t.handle}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
