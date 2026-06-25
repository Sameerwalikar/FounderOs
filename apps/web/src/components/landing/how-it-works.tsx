const steps = [
  {
    number: "01",
    title: "Describe your idea",
    description:
      "Enter a single sentence about your startup concept. That's all we need to get started.",
  },
  {
    number: "02",
    title: "AI generates your blueprint",
    description:
      "Our specialized AI modules analyze your idea and generate comprehensive documentation across 11 categories.",
  },
  {
    number: "03",
    title: "Refine and iterate",
    description:
      "Edit any section, chat with AI for refinements, regenerate content, and export your complete plan.",
  },
];

export function HowItWorks() {
  return (
    <section className="border-t border-border/40 py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            From idea to execution-ready plan in minutes, not weeks.
          </p>
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.number} className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {step.number}
              </div>
              <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
