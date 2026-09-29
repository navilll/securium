import Link from "next/link";
export default function NotFound() {
  return (
    <main className="wrap">
      <p className="empty">
        This course doesn't exist. <Link href="/courses">Back to courses</Link>
      </p>
    </main>
  );
}
