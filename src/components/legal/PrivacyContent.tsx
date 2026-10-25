import { privacyPolicy } from "@/content/privacy.es";

type Block =
  | {
      type: "question";
      q: string;
      a: string;
      list?: readonly string[];
      categories?: readonly { name: string; detail: string }[];
    }
  | { type: "paragraph"; text: string };

function QuestionBlock({ block }: { block: Extract<Block, { type: "question" }> }) {
  return (
    <div className="space-y-3">
      <h3 className="text-base font-semibold text-foreground">{block.q}</h3>
      <p>{block.a}</p>
      {block.list && (
        <ul className="list-disc space-y-2 pl-5">
          {block.list.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      )}
      {block.categories && (
        <dl className="space-y-4 border border-border bg-background/50 p-4">
          {block.categories.map((cat) => (
            <div key={cat.name}>
              <dt className="font-medium text-teal-light">{cat.name}</dt>
              <dd className="mt-1">{cat.detail}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

export function PrivacyContent() {
  return (
    <div className="space-y-10 text-muted leading-relaxed">
      <div className="glass space-y-4 rounded-[var(--radius-lg)] p-6">
        {privacyPolicy.intro.map((p) => (
          <p key={p.slice(0, 40)}>{p}</p>
        ))}
      </div>

      {privacyPolicy.sections.map((section) => (
        <section key={section.id} id={`seccion-${section.id}`} className="scroll-mt-28">
          <h2 className="font-display mb-6 text-xl font-bold uppercase tracking-wide text-foreground md:text-2xl">
            {section.title}
          </h2>
          <div className="space-y-8">
            {section.blocks.map((block, i) => {
              if (block.type === "paragraph") {
                return <p key={i}>{block.text}</p>;
              }
              return <QuestionBlock key={i} block={block} />;
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
