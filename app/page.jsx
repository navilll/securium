import Link from "next/link";
import { getCourses, money } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import { Icon } from "@/components/Icons";

export default async function Home() {
  let data = null;
  try {
    data = await getCourses();
  } catch {}
  const courses = data?.courses?.data ?? [];
  const cats = data?.categories ?? [];
  const total = data?.courses?.total ?? 0;

  return (
    <main>
      <section className="hero">
        <div className="c">
          <div>
            <p className="hero-eyebrow">
              <span /> Securium SOLUTION <i>·</i> LEARNING PLATFORM
            </p>
            <h1>Build the skills to protect what matters.</h1>
            <p className="lead">
              Practical courses for a safer digital world. Learn from
              experienced instructors and put every new skill to work.
            </p>
            <form className="search" action="/courses">
              <input
                name="search"
                placeholder="What do you want to learn?"
                aria-label="Search courses"
              />
              <button className="btn">Search</button>
            </form>
            {cats.length > 0 && (
              <div className="chips">
                {cats.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses?category=${c.slug}`}
                    className="chip"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
          <div className="stack" aria-hidden={courses.length === 0}>
            {courses.slice(0, 3).map((c) => (
              <Link key={c.id} href={`/courses/${c.slug}`} tabIndex={-1}>
                <img src={c.image} alt="" />
                <span>
                  {c.title}
                  <small>{money(c.price)}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="sec">
        <div className="c">
          <div className="sec-h">
            <h2>Popular courses</h2>
            <Link href="/courses" className="link">
              View all courses <Icon name="arrow" />
            </Link>
          </div>
          {courses.length ? (
            <div className="grid">
              {courses.slice(0, 4).map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          ) : (
            <p className="empty">
              Courses will show up here once they're published.
            </p>
          )}
        </div>
      </section>

      {cats.length > 0 && (
        <section className="sec alt" id="subjects">
          <div className="c">
            <div className="sec-h">
              <h2>Browse by subject</h2>
            </div>
            <div className="cats">
              {cats.map((c) => (
                <Link
                  key={c.id}
                  href={`/courses?category=${c.slug}`}
                  className="cat"
                >
                  {c.name}
                  <Icon name="arrow" size={20} />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="sec" id="how">
        <div className="c">
          <div className="sec-h">
            <h2>How it works</h2>
          </div>
          <div className="steps">
            <div className="step">
              <b>1</b>
              <h3>Pick a course</h3>
              <p>
                Filter by subject, check the level, lesson count and duration
                before you commit.
              </p>
            </div>
            <div className="step">
              <b>2</b>
              <h3>Learn at your pace</h3>
              <p>
                Work through the lessons on your schedule and follow the
                curriculum step by step.
              </p>
            </div>
            <div className="step">
              <b>3</b>
              <h3>Reach the pass mark</h3>
              <p>
                Every course lists its pass percentage and deadline, so you
                always know the target.
              </p>
            </div>
          </div>
          <div className="cta">
            <div>
              <h2>Ready to start your first course?</h2>
              <p>Browse the full catalogue and find your level.</p>
            </div>
            <Link href="/courses" className="btn light">
              Browse courses
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
