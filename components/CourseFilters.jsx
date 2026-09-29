"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon } from "./Icons";

export default function CourseFilters({ categories, total, shown }) {
  const router = useRouter();
  const params = useSearchParams();
  const [q, setQ] = useState(params.get("search") || "");
  const [language, setLanguage] = useState(params.get("language") || "");
  const [minPrice, setMinPrice] = useState(params.get("min_price") || "");
  const [maxPrice, setMaxPrice] = useState(params.get("max_price") || "");
  const cat = params.get("category") || "";
  const serializedParams = params.toString();

  const update = (key, val) => {
    const p = new URLSearchParams(params.toString());
    val ? p.set(key, val) : p.delete(key);
    p.delete("page");
    router.replace(`/courses?${p}`);
  };

  const applyPriceAndLanguage = (event) => {
    event.preventDefault();
    const p = new URLSearchParams(params.toString());
    [
      ["language", language.trim()],
      ["min_price", minPrice],
      ["max_price", maxPrice],
    ].forEach(([key, value]) => {
      value ? p.set(key, value) : p.delete(key);
    });
    p.delete("page");
    router.replace(`/courses?${p}`);
  };

  useEffect(() => {
    const currentSearch =
      new URLSearchParams(serializedParams).get("search") || "";
    if (q === currentSearch) return;

    const timeout = setTimeout(() => {
      const nextParams = new URLSearchParams(serializedParams);
      q ? nextParams.set("search", q) : nextParams.delete("search");
      nextParams.delete("page");
      router.replace(`/courses?${nextParams}`);
    }, 400);

    return () => clearTimeout(timeout);
  }, [q, router, serializedParams]);

  return (
    <aside className="filters-sidebar" aria-label="Course filters">
      <h2>Refine your search</h2>
      <label className="filter-search">
        <Icon name="search" size={16} />
        <input
          type="search"
          placeholder="Search courses"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          aria-label="Search courses"
        />
      </label>
      <form className="filter-form" onSubmit={applyPriceAndLanguage}>
        <div className="filter-group">
          <label className="filter-label" htmlFor="course-language">
            Language
          </label>
          <input
            id="course-language"
            className="filter-input"
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            placeholder="e.g. English"
          />
        </div>
        <div className="filter-group">
          <span className="filter-label">Price range</span>
          <div className="filter-price-row">
            <label>
              <span className="sr-only">Minimum price</span>
              <input
                className="filter-input"
                type="number"
                min="0"
                step="any"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
              />
            </label>
            <span aria-hidden="true">to</span>
            <label>
              <span className="sr-only">Maximum price</span>
              <input
                className="filter-input"
                type="number"
                min="0"
                step="any"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
              />
            </label>
          </div>
        </div>
        <button className="btn sm block" type="submit">
          Apply filters
        </button>
      </form>
      <div className="filter-group">
        <h3>Categories</h3>
        <div className="filter-options">
          <button
            className={`filter-option ${cat === "" ? "on" : ""}`}
            aria-pressed={cat === ""}
            onClick={() => update("category", "")}
          >
            <span className="filter-check" aria-hidden="true" />
            All subjects
          </button>
          {categories.map((c) => (
            <button
              key={c.id}
              className={`filter-option ${cat === c.slug ? "on" : ""}`}
              aria-pressed={cat === c.slug}
              onClick={() => update("category", c.slug)}
            >
              <span className="filter-check" aria-hidden="true" />
              {c.name}
            </button>
          ))}
        </div>
      </div>
      <p className="filter-count">
        Showing <strong>{shown}</strong> of {total} courses
      </p>
    </aside>
  );
}
