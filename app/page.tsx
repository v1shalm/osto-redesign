"use client";

import { useEffect, useState } from "react";
import { OstoHeroV1 } from "./OstoHeroV1";
import { OstoHeroV2 } from "./OstoHeroV2";

type Version = "v1" | "v2";
const STORAGE_KEY = "osto-draft-version";

export default function Page() {
  const [version, setVersion] = useState<Version>("v1");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "v1" || stored === "v2") setVersion(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, version);
  }, [version]);

  return (
    <>
      {version === "v1" ? <OstoHeroV1 /> : <OstoHeroV2 />}
      <VersionToggle version={version} setVersion={setVersion} />
    </>
  );
}

function VersionToggle({
  version,
  setVersion,
}: {
  version: Version;
  setVersion: (v: Version) => void;
}) {
  return (
    <div
      className="fixed bottom-4 right-4 z-[100] flex items-center gap-1 rounded-full p-1 md:bottom-6 md:right-6"
      style={{
        background: "rgba(13,21,57,0.92)",
        backdropFilter: "blur(8px)",
        boxShadow:
          "0 0 0 1px rgba(255,255,255,0.08), 0 8px 24px -8px rgba(13,21,57,0.45)",
      }}
    >
      <span
        className="px-2 text-[10px] font-semibold uppercase tracking-[0.16em]"
        style={{ color: "rgba(255,255,255,0.55)" }}
      >
        Draft
      </span>
      {(["v1", "v2"] as Version[]).map((v) => {
        const active = version === v;
        return (
          <button
            key={v}
            onClick={() => setVersion(v)}
            className="rounded-full px-3 py-1 text-[11.5px] font-bold uppercase tracking-[0.08em] transition-colors"
            style={{
              background: active ? "#ffffff" : "transparent",
              color: active ? "#0d1539" : "rgba(255,255,255,0.7)",
            }}
          >
            {v}
          </button>
        );
      })}
    </div>
  );
}
