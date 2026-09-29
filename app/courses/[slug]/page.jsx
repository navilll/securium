import Link from "next/link";
import { notFound } from "next/navigation";
import { getCourse, money } from "@/lib/api";
import CourseTabs from "@/components/CourseTabs";
import EnquiryForm from "@/components/EnquiryForm";
import { Icon } from "@/components/Icons";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  return { title: c ? c.title : "Course not found" };
}

export default async function CourseDetail({ params }) {
  const { slug } = await params;
  const c = await getCourse(slug);
  if (!c) notFound();

  const overview = c.overview_blocks?.length
    ? c.overview_blocks
    : c.overview
      ? [{ type: "paragraph", content: c.overview }]
      : [];
  const off = Number(c.original_price) > Number(c.price);

  const facts = [
    ["clock", "Duration", c.duration],
    ["users", "Students", c.students_count],
    ["book", "Lessons", c.lessons_count],
    ["level", "Skill level", c.skill_level],
    ["globe", "Language", c.language],
    ["user", "Instructor", c.instructor],
    ["badge", "Pass percentage", `${c.pass_percentage}%`],
    ["cal", "Deadline", c.deadline],
  ];

  return (
    <main>
      <section className="banner tall">
        <div className="c">
          <div className="crumbs">
            <Link href="/">Home</Link> / <Link href="/courses">Courses</Link> /{" "}
            <span>{c.category?.name}</span>
          </div>
          <h1>{c.title}</h1>
          <div className="byline">
            <span>
              <Icon name="user" size={16} />
              {c.instructor}
            </span>
            <span>
              <Icon name="cap" size={16} />
              {c.university}
            </span>
            {c.category?.name && (
              <span className="tag inline">{c.category.name}</span>
            )}
          </div>
        </div>
      </section>

      <div className="c detail">
        <div className="detail-main">
          <img src={c.image} alt={c.title} className="hero-img" />
          <CourseTabs
            overview={overview}
            curriculum={c.curriculum}
            instructor={c.instructor_details}
          />
          <EnquiryForm slug={c.slug} title={c.title} />
        </div>
        <aside className="sidebar">
          <div className="sp">
            <div className="big-price">{money(c.price)}</div>
            {off && <del>{money(c.original_price)}</del>}
          </div>
          <dl>
            {facts.map(([ic, k, v]) => (
              <div key={k}>
                <dt>
                  <Icon name={ic} size={15} />
                  {k}
                </dt>
                <dd>{v}</dd>
              </div>
            ))}
          </dl>
          <a href="#enquiry" className="btn block">
            Purchase Now
          </a>
        </aside>
      </div>
    </main>
  );
}
