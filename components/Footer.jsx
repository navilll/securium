import Link from "next/link";
import { getCourses } from "@/lib/api";
import { Icon } from "./Icons";
import NewsletterForm from "./NewsletterForm";

export default async function Footer() {
  let cats = [];
  try {
    cats = (await getCourses()).categories || [];
  } catch {}
  return (
    <footer className="ftr">
      <div className="c ftr-grid">
        <div>
          <Link href="/" className="logo">
            <span>
              Securium <b>Solution</b>
            </span>
          </Link>
          <p>
            Practical learning for stronger digital skills, safer systems, and
            confident teams.
          </p>
        </div>
        <div>
          <h4>Explore</h4>
          <Link href="/courses">All courses</Link>
          <Link href="/#subjects">Subjects</Link>
          <Link href="/#how">How it works</Link>
        </div>
        <div>
          <h4>Subjects</h4>
          {cats.map((c) => (
            <Link key={c.id} href={`/courses?category=${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h4>Course updates</h4>
          <p>New courses and discounts, once a month.</p>
          <NewsletterForm />
        </div>
      </div>
      <div className="c ftr-b">
        <span>
          © {new Date().getFullYear()} Securium Solution. All rights reserved.
        </span>
        <span>Terms · Privacy</span>
      </div>
    </footer>
  );
}
