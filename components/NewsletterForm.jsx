export default function NewsletterForm() {
  return (
    <div className="nl" aria-label="Newsletter signup preview">
      <input
        type="email"
        placeholder="Your email"
        aria-label="Email address"
        disabled
      />
      <button className="btn sm" type="button" disabled>
        Subscribe
      </button>
      <small className="nl-note">Newsletter sign-up coming soon.</small>
    </div>
  );
}
