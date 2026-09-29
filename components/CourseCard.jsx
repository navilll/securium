import Link from "next/link";
import { money } from "@/lib/api";
import { Icon } from "./Icons";

export default function CourseCard({ course: c }) {
  const orig = Number(c.original_price),
    price = Number(c.price);
  const off = orig > price ? Math.round((1 - price / orig) * 100) : 0;
  return (
    <Link href={`/courses/${c.slug}`} className="flip" aria-label={c.title}>
      <div className="flip-inner">
        <article className="face front">
          <div className="imgbox">
            <img src={c.image} alt="" className="thumb" loading="lazy" />
            {c.category?.name && <span className="tag">{c.category.name}</span>}
            {off > 0 && <span className="off">-{off}%</span>}
          </div>
          <div className="body">
            <div className="uni">{c.university}</div>
            <h3 className="ctitle">{c.title}</h3>
          </div>
          <div className="meta">
            <span>
              <Icon name="book" size={14} />
              {c.lessons_count}
            </span>
            <span>
              <Icon name="users" size={14} />
              {c.students_count}
            </span>
            <span className="price">
              {off > 0 && <del>{money(orig)}</del>}
              <b>{money(price)}</b>
            </span>
          </div>
        </article>

        <article className="face back">
          <div className="uni">{c.university}</div>
          <h3 className="ctitle">{c.title}</h3>
          <p className="desc">{c.short_description}</p>
          <ul className="facts">
            <li>
              <Icon name="user" size={14} />
              {c.instructor}
            </li>
            <li>
              <Icon name="level" size={14} />
              {c.skill_level}
            </li>
            <li>
              <Icon name="clock" size={14} />
              {c.duration}
            </li>
            <li>
              <Icon name="globe" size={14} />
              {c.language}
            </li>
          </ul>
          <span className="btn light block">
            View course <Icon name="arrow" />
          </span>
        </article>
      </div>
    </Link>
  );
}
