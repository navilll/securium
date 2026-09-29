"use client";
import { useState } from "react";
import BlockRenderer from "./BlockRenderer";

export default function CourseTabs({ overview, curriculum, instructor }) {
  const tabs = [
    { key: "overview", label: "Overview", blocks: overview },
    { key: "curriculum", label: "Curriculum", blocks: curriculum },
    { key: "instructor", label: "Instructor", blocks: instructor },
  ];
  const [active, setActive] = useState("overview");
  const current = tabs.find((t) => t.key === active);

  return (
    <section>
      <div className="tabs" role="tablist">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            aria-selected={active === t.key}
            className={active === t.key ? "on" : ""}
            onClick={() => setActive(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-panel" role="tabpanel">
        <BlockRenderer
          blocks={current.blocks}
          empty={`No ${current.label.toLowerCase()} details yet.`}
        />
      </div>
    </section>
  );
}
