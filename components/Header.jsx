"use client";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Icon } from "./Icons";

const links = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/#subjects", label: "Subjects" },
  { href: "/#how", label: "How it works" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const path = usePathname();
  const isOn = (h) =>
    h === "/" ? path === "/" : !h.includes("#") && path.startsWith(h);

  return (
    <header className="hdr">
      <div className="c">
        <Link href="/" className="logo" onClick={() => setOpen(false)}>
          <span>
            Securium <b>Solution</b>
          </span>
        </Link>
        <nav className={`nav ${open ? "open" : ""}`} aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.label}
              href={l.href}
              className={isOn(l.href) ? "on" : ""}
              onClick={() => setOpen(false)}
            >
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="hdr-r">
          <Link href="/courses" className="iconbtn" aria-label="Search courses">
            <Icon name="search" size={18} />
          </Link>
          <Link href="/courses" className="btn sm hide-sm">
            Browse courses
          </Link>
          <button
            className="iconbtn burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            <Icon name={open ? "close" : "menu"} size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
