interface Props {
  supportedLanguages: string[];
  restSupport: boolean;
  graphqlSupport: boolean;
  webhookSupport: boolean;
  websocketSupport: boolean;
}

function Check({ ok }: { ok: boolean }) {
  return <span className={ok ? "text-success" : "text-fg-subtle"}>{ok ? "✓" : "✕"}</span>;
}

export function DeveloperSupport({
  supportedLanguages,
  restSupport,
  graphqlSupport,
  webhookSupport,
  websocketSupport,
}: Props) {
  const hasLanguageData = supportedLanguages.length > 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <div className="rounded-lg border border-border bg-bg-elevated p-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">Languages</h3>
        {hasLanguageData ? (
          <ul className="flex flex-col gap-1.5">
            {supportedLanguages.map((lang) => (
              <li key={lang} className="flex items-center justify-between text-sm text-fg">
                {lang}
                <Check ok />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-fg-subtle">Not documented yet.</p>
        )}
      </div>

      <div className="rounded-lg border border-border bg-bg-elevated p-4">
        <h3 className="mb-2 text-xs font-medium uppercase tracking-wide text-fg-subtle">Protocol & features</h3>
        <ul className="flex flex-col gap-1.5">
          <li className="flex items-center justify-between text-sm text-fg">
            REST
            <Check ok={restSupport} />
          </li>
          <li className="flex items-center justify-between text-sm text-fg">
            GraphQL
            <Check ok={graphqlSupport} />
          </li>
          <li className="flex items-center justify-between text-sm text-fg">
            Webhooks
            <Check ok={webhookSupport} />
          </li>
          <li className="flex items-center justify-between text-sm text-fg">
            WebSocket
            <Check ok={websocketSupport} />
          </li>
        </ul>
      </div>
    </div>
  );
}
