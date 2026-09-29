"use client";
import { useState } from "react";

const API_URL = "https://beige-quetzal-213252.hostingersite.com/api/contact-form";

export default function EnquiryForm({ slug, title }) {
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  async function onSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    setFieldErrors({});
    const form = e.currentTarget;
    const body = Object.fromEntries(new FormData(form));
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ ...body, slug, title }),
      });
      const result = await res.json().catch(() => ({}));
      if (!res.ok) {
        // Normalize errors: supports { email: "msg" } and Laravel-style { email: ["msg"] }
        const errs = Object.fromEntries(
          Object.entries(result.errors || {}).map(([k, v]) => [
            k,
            Array.isArray(v) ? v[0] : v,
          ])
        );
        setFieldErrors(errs);
        throw new Error(result.message || "Could not send your enquiry.");
      }
      setStatus("done");
      form.reset();
    } catch (err) {
      setError(err.message || "Could not send your enquiry.");
      setStatus("error");
    }
  }

  if (status === "done")
    return (
      <div className="form-card success-card" id="enquiry" role="status">
        <span className="form-kicker">Message received</span>
        <h3>
          Thanks, {title ? `we've received your enquiry` : "we've received your message"}
        </h3>
        <p className="muted">Our team will be in touch shortly.</p>
      </div>
    );

  return (
    <form className="form-card" id="enquiry" onSubmit={onSubmit}>
      <span className="form-kicker">Talk to our team</span>
      <h3>How can we help?</h3>
      <p className="muted">Share your details and question. We’ll get back to you soon.</p>
      <div className="row">
        <label>
          Name
          <input
            name="name"
            autoComplete="name"
            maxLength={120}
            aria-invalid={!!fieldErrors.name}
            aria-describedby={fieldErrors.name ? "enquiry-name-error" : undefined}
          />
          {fieldErrors.name && (
            <span className="field-error" id="enquiry-name-error">{fieldErrors.name}</span>
          )}
        </label>
        <label>
          Email
          <input
            name="email"
            type="email"
            autoComplete="email"
            maxLength={254}
            aria-invalid={!!fieldErrors.email}
            aria-describedby={fieldErrors.email ? "enquiry-email-error" : undefined}
          />
          {fieldErrors.email && (
            <span className="field-error" id="enquiry-email-error">{fieldErrors.email}</span>
          )}
        </label>
      </div>
      <label>
        Phone
        <input
          name="phone"
          type="tel"
          autoComplete="tel"
          maxLength={24}
          aria-invalid={!!fieldErrors.phone}
          aria-describedby={fieldErrors.phone ? "enquiry-phone-error" : undefined}
        />
        {fieldErrors.phone && (
          <span className="field-error" id="enquiry-phone-error">{fieldErrors.phone}</span>
        )}
      </label>
      <label>
        Your query
        <textarea
          name="query"
          rows={4}
          maxLength={2000}
          aria-invalid={!!fieldErrors.query}
          aria-describedby={fieldErrors.query ? "enquiry-query-error" : undefined}
        />
        {fieldErrors.query && (
          <span className="field-error" id="enquiry-query-error">{fieldErrors.query}</span>
        )}
      </label>
      {status === "error" && <p className="err" role="alert">{error}</p>}
      <button className="btn" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Send enquiry"}
      </button>
    </form>
  );
}