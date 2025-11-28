export function ContactForm() {
  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
      className="contact-form"
    >
      <input type="hidden" name="form-name" value="contact" />

      {/* Honeypot field for bots */}
      <p hidden>
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <div className="form-group">
        <input type="text" name="firstName" id="firstName" placeholder=" " required />
        <label htmlFor="firstName">First name</label>
      </div>

      <div className="form-group">
        <input type="text" name="lastName" id="lastName" placeholder=" " required />
        <label htmlFor="lastName">Last name</label>
      </div>

      <div className="form-group">
        <input type="email" name="email" id="email" placeholder=" " required />
        <label htmlFor="email">Email</label>
      </div>

    
      <div className="form-group">
        <textarea
            name="message"
            id="messaege"
            placeholder=" "
            required
            onInput={(e) => {
              const el = e.target as HTMLTextAreaElement;
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }}
            style={{
              overflow: "hidden",
              resize: "none",
            }}
          />
        <label htmlFor="message">Message</label>
      </div>

      <button type="submit" className="submit-button">
        Send
      </button>
    </form>
  );
}
