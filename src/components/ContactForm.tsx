export function ContactForm() {
  return (
    <form
      name="contact"
      method="POST"
      data-netlify="true"
      netlify-honeypot="bot-field"
    >
      {/* Hidden input tells Netlify the form name */}
      <input type="hidden" name="form-name" value="contact" />

      {/* Optional hidden honeypot field to stop bots */}
      <p hidden>
        <label>
          Don’t fill this out: <input name="bot-field" />
        </label>
      </p>

      <p>
        <label>
          First name:<br />
          <input type="text" name="firstName" required />
        </label>
      </p>

      <p>
        <label>
          Last name:<br />
          <input type="text" name="lastName" required />
        </label>
      </p>

      <p>
        <label>
          Email:<br />
          <input type="email" name="email" required />
        </label>
      </p>

      <p>
        <label>
          Message:<br />
          <textarea name="message" required></textarea>
        </label>
      </p>

      <button type="submit">Send</button>
    </form>
  );
}
