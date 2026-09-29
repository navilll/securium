const API = process.env.API_URL || "http://sd7:8080/course-secure/api";
export { API };

export async function getCourses({
  page = 1,
  search = "",
  category = "",
  level = "",
  language = "",
  minPrice = "",
  maxPrice = "",
} = {}) {
  const filters = new URLSearchParams();
  if (search) filters.set("search", search);
  if (category) filters.set("category", category);
  if (level) filters.set("level", level);

  const getPage = async (pageNumber) => {
    const qs = new URLSearchParams(filters);
    qs.set("page", pageNumber);
    const res = await fetch(`${API}/courses?${qs}`, { cache: "no-store" });
    if (!res.ok) throw new Error("Failed to load courses");
    return res.json();
  };

  if (!language && minPrice === "" && maxPrice === "") return getPage(page);

  const firstPage = await getPage(1);
  const lastPage = Number(firstPage.courses.last_page) || 1;
  const remainingPages = await Promise.all(
    Array.from({ length: lastPage - 1 }, (_, index) => getPage(index + 2)),
  );
  const allCourses = [firstPage, ...remainingPages].flatMap(
    (result) => result.courses.data || [],
  );
  const languageFilter = language.trim().toLocaleLowerCase();
  const min = minPrice === "" ? null : Number(minPrice);
  const max = maxPrice === "" ? null : Number(maxPrice);
  const filtered = allCourses.filter((course) => {
    const courseLanguage = String(course.language || "")
      .trim()
      .toLocaleLowerCase();
    const price = Number(course.price);
    return (
      (!languageFilter || courseLanguage === languageFilter) &&
      (min === null || price >= min) &&
      (max === null || price <= max)
    );
  });
  const perPage = Number(firstPage.courses.per_page) || 12;
  const filteredLastPage = Math.max(1, Math.ceil(filtered.length / perPage));
  const currentPage = Math.min(
    Math.max(Number(page) || 1, 1),
    filteredLastPage,
  );
  const start = (currentPage - 1) * perPage;

  return {
    ...firstPage,
    courses: {
      ...firstPage.courses,
      data: filtered.slice(start, start + perPage),
      current_page: currentPage,
      last_page: filteredLastPage,
      total: filtered.length,
      from: filtered.length ? start + 1 : null,
      to: filtered.length ? Math.min(start + perPage, filtered.length) : null,
    },
  };
}

export async function getCourse(slug) {
  const res = await fetch(`${API}/courses/${slug}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to load course");
  return (await res.json()).course;
}

export const money = (n) => `$${Number(n || 0).toFixed(2)}`;
