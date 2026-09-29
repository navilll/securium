import Link from "next/link";
import { Suspense } from "react";
import { getCourses } from "@/lib/api";
import CourseCard from "@/components/CourseCard";
import CourseFilters from "@/components/CourseFilters";
import { Icon } from "@/components/Icons";

export const metadata = { title: "Courses" };

export default async function CoursesPage({ searchParams }) {
  const sp = await searchParams;
  const data = await getCourses({
    page: Number(sp.page) || 1,
    search: sp.search || "",
    category: sp.category || "",
    level: sp.level || "",
    language: sp.language || "",
    minPrice: sp.min_price || "",
    maxPrice: sp.max_price || "",
  });
  const { data: courses, current_page, last_page, total } = data.courses;
  const pageHref = (n) => {
    const p = new URLSearchParams(sp);
    p.set("page", n);
    return `/courses?${p}`;
  };

  return (
    <main>
      <section className="banner">
        <div className="c">
          <div className="crumbs">
            <Link href="/">Home</Link> / <span>Courses</span>
          </div>
          <h1>All courses</h1>
          <p>
            Find the right course by subject, then compare level, lessons and
            price.
          </p>
        </div>
      </section>
      <div className="c wrap course-layout">
        <Suspense>
          <CourseFilters
            categories={data.categories}
            total={total}
            shown={courses.length}
          />
        </Suspense>
        <section className="course-results" aria-label="Course results">
          <div className="results-heading">
            <span>Course catalogue</span>
            <strong>{total} courses</strong>
          </div>
          {courses.length === 0 ? (
            <p className="empty">
              No courses match your search. Try a different subject or keyword.
            </p>
          ) : (
            <div className="grid">
              {courses.map((c) => (
                <CourseCard key={c.id} course={c} />
              ))}
            </div>
          )}
          {last_page > 1 && (
            <nav className="pager" aria-label="Pagination">
              {Array.from({ length: last_page }, (_, i) => i + 1).map((n) => (
                <Link
                  key={n}
                  href={pageHref(n)}
                  className={n === current_page ? "active" : ""}
                >
                  {String(n).padStart(2, "0")}
                </Link>
              ))}
              {current_page < last_page && (
                <Link href={pageHref(current_page + 1)} aria-label="Next page">
                  <Icon name="arrow" />
                </Link>
              )}
            </nav>
          )}
        </section>
      </div>
    </main>
  );
}
