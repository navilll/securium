import { NextResponse } from "next/server";
import { API } from "@/lib/api";

export async function POST(req) {
  let data;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json(
      { message: "Please submit a valid form." },
      { status: 400 },
    );
  }
  if (!data || typeof data !== "object" || Array.isArray(data)) {
    return NextResponse.json(
      { message: "Please submit a valid form." },
      { status: 400 },
    );
  }

  const values = {
    name: typeof data.name === "string" ? data.name.trim() : "",
    email: typeof data.email === "string" ? data.email.trim() : "",
    phone: typeof data.phone === "string" ? data.phone.trim() : "",
    query: typeof data.query === "string" ? data.query.trim() : "",
  };
  const errors = {};

  if (!values.name) errors.name = "Please enter your name.";
  else if (values.name.length > 120)
    errors.name = "Name must be 120 characters or fewer.";
  if (!values.email) errors.email = "Please enter your email address.";
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
    errors.email = "Enter a valid email address.";
  if (!values.phone) errors.phone = "Please enter your phone number.";
  else if (
    !/^[+()\d.\s-]{7,24}$/.test(values.phone) ||
    (values.phone.match(/\d/g) || []).length < 7
  )
    errors.phone = "Enter a valid phone number.";
  if (!values.query)
    errors.query = "Please tell us what you would like to know.";
  else if (values.query.length > 2000)
    errors.query = "Your message must be 2,000 characters or fewer.";

  if (Object.keys(errors).length) {
    return NextResponse.json(
      { message: "Please check the highlighted fields.", errors },
      { status: 422 },
    );
  }

  try {
    const res = await fetch(`${API}/contact-form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(values),
      cache: "no-store",
    });
    const result = await res.json().catch(() => ({}));
    const upstreamErrors = Object.fromEntries(
      Object.entries(result.errors || {}).map(([field, messages]) => [
        field,
        Array.isArray(messages) ? messages.join(" ") : String(messages),
      ]),
    );
    if (!res.ok || result.success === false) {
      const status =
        res.status >= 400 && res.status < 500
          ? res.status
          : upstreamErrors && Object.keys(upstreamErrors).length
            ? 422
            : 502;
      return NextResponse.json(
        {
          message:
            result.message ||
            "We couldn't send your enquiry. Please try again.",
          errors: upstreamErrors,
        },
        { status },
      );
    }
    return NextResponse.json({
      ok: true,
      message: result.message || "Enquiry sent successfully.",
    });
  } catch {
    return NextResponse.json(
      {
        message:
          "The contact service is unavailable. Please try again shortly.",
      },
      { status: 502 },
    );
  }
}
