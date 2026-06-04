import { privacyPolicy } from "@/content/privacy.es";

type Block =
  | {
      type: "question";
      q: string;
      a: string;
      list?: readonly string[];
      categories?: readonly { name: string; detail: string }[];
    }
  | { type: "contact" }
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
  const { responsible } = privacyPolicy;

  return (
    <div className="space-y-10 text-muted leading-relaxed">
      <div className="glass-soft space-y-3 p-6 text-sm md:p-8">
        <p className="text-foreground font-display text-lg font-semibold uppercase tracking-wide">
          Datos del responsable
        </p>
        <dl className="grid gap-2 sm:grid-cols-2">
          <div>
            <dt className="text-teal-light">Nombre comercial</dt>
            <dd>{responsible.tradeName}</dd>
          </div>
          <div>
            <dt className="text-teal-light">Responsable</dt>
            <dd>{responsible.name}</dd>
          </div>
          <div>
            <dt className="text-teal-light">RUC / Identificación</dt>
            <dd>{responsible.ruc}</dd>
          </div>
          <div>
            <dt className="text-teal-light">Correo</dt>
            <dd>
              <a
                href={`mailto:${responsible.email}`}
                className="text-teal-light hover:underline"
              >
                {responsible.email}
              </a>
            </dd>
          </div>
          <div>
            <dt className="text-teal-light">Sitio web</dt>
            <dd>{responsible.website}</dd>
          </div>
          <div>
            <dt className="text-teal-light">Domicilio</dt>
            <dd>{responsible.address}</dd>
          </div>
          <div>
            <dt className="text-teal-light">Versión</dt>
            <dd>{privacyPolicy.version}</dd>
          </div>
          <div>
            <dt className="text-teal-light">Fecha de emisión</dt>
            <dd>{privacyPolicy.issuedAt}</dd>
          </div>
        </dl>
      </div>

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
              if (block.type === "contact") {
                return (
                  <dl
                    key="contact"
                    className="grid gap-3 border border-border bg-background/50 p-4 text-sm sm:grid-cols-2"
                  >
                    <div>
                      <dt className="text-teal-light">Nombre comercial</dt>
                      <dd>{responsible.tradeName}</dd>
                    </div>
                    <div>
                      <dt className="text-teal-light">Responsable</dt>
                      <dd>{responsible.name}</dd>
                    </div>
                    <div>
                      <dt className="text-teal-light">RUC</dt>
                      <dd>{responsible.ruc}</dd>
                    </div>
                    <div>
                      <dt className="text-teal-light">Correo</dt>
                      <dd>
                        <a
                          href={`mailto:${responsible.email}`}
                          className="text-teal-light hover:underline"
                        >
                          {responsible.email}
                        </a>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-teal-light">Sitio web</dt>
                      <dd>{responsible.website}</dd>
                    </div>
                    <div className="sm:col-span-2">
                      <dt className="text-teal-light">Dirección</dt>
                      <dd>{responsible.address}</dd>
                    </div>
                  </dl>
                );
              }
              if (block.type === "paragraph") {
                return <p key={i}>{block.text}</p>;
              }
              return <QuestionBlock key={i} block={block} />;
            })}
          </div>
        </section>
      ))}

      <footer className="border-t border-border pt-8 text-foreground">
        <p className="font-display text-lg font-semibold uppercase">Negsai</p>
        <p className="mt-2">{responsible.name}</p>
        <p className="text-sm text-muted">RUC: {responsible.ruc}</p>
        <p className="mt-2">
          <a
            href={`mailto:${responsible.email}`}
            className="text-teal-light hover:underline"
          >
            {responsible.email}
          </a>
        </p>
      </footer>
    </div>
  );
}
