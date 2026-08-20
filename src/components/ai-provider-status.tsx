"use client";

import { useEffect, useState } from "react";

type ProviderStatus = {
  configured: boolean;
  provider: string;
  model: string | null;
  ready?: boolean;
  selection?: "explicit" | "strongest-available";
  message: string;
};

export function AIProviderStatus() {
  const [status, setStatus] = useState<ProviderStatus>();

  useEffect(() => {
    let active = true;
    fetch("/api/ai-provider/status", { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Provider status unavailable");
        return await response.json() as ProviderStatus;
      })
      .then((next) => {
        if (active) setStatus(next);
      })
      .catch(() => {
        if (active) {
          setStatus({
            configured: false,
            provider: "kmitl-openai-compatible",
            model: null,
            message: "KMITL AI status unavailable. Local/browser learning features still work."
          });
        }
      });

    return () => {
      active = false;
    };
  }, []);

  if (!status) return <div className="pill">KMITL AI · checking…</div>;
  if (!status.configured) return <div className="pill">KMITL AI · local fallback</div>;
  if (!status.model || status.ready === false) return <div className="pill">KMITL AI · model unresolved</div>;

  const shortModel = status.model.replace(/^openrouter\//, "");
  return (
    <div title={status.message} className="pill success">
      KMITL AI · {shortModel} {status.selection === "strongest-available" ? "· strongest" : ""}
    </div>
  );
}
