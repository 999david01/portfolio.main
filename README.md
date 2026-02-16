# Portfolio

Static portfolio site with a Node.js backend for the contact form.

## Run the backend

1. Install dependencies:
   ```bash
   npm install
   ```

2. (Optional) Copy env example and set your email / SMTP:
   ```bash
   copy .env.example .env
   ```
   Edit `.env` and set `CONTACT_EMAIL`. For email notifications, set the SMTP variables (e.g. Gmail app password).

3. Start the server:
   ```bash
   npm start
   ```

4. Open [http://localhost:3000](http://localhost:3000). The contact form will POST to `/api/contact`; messages are stored in `data/messages.json` and, if SMTP is configured, emailed to you.

## Contact form without backend

If you open `index.html` as a file or host only static files, the form will show a network error when submitted. Use the backend above or deploy to a host that provides an API for the contact endpoint.
