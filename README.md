# Showtime Collision Website

Static website export for Showtime Collision, with a small Vercel serverless
function that emails contact and estimate form submissions.

## Vercel deployment settings

- Framework Preset: Other
- Build Command: leave blank (no build step required)
- Output Directory: leave blank (serves the project root)
- Install Command: leave blank

The static HTML/CSS/JS is served as-is. The one dynamic piece is the file
`api/lead.js`, which Vercel automatically runs as a serverless function at the
URL `/api/lead`.

## How the contact / estimate forms work

1. A visitor fills out the **Contact** form (`contact.html`) or the multi-step
   **Estimate** form (`estimate.html`).
2. The browser sends the form data as JSON to `/api/lead` (see
   `assets/showtime.js`).
3. The `api/lead.js` function validates the data and emails it to the shop using
   the [Resend](https://resend.com) email API.
4. The visitor sees a success message, or a clear error message (with the shop
   phone number) if something goes wrong.

**Important:** Vercel does *not* email forms on its own. The email is sent by the
`api/lead.js` function calling Resend. Without the environment variables below,
the form will load fine but show a friendly "please call the shop" error when
someone tries to submit — the static pages are never broken.

## First-time setup (step by step for beginners)

### 1. Create a Resend account and API key

1. Go to <https://resend.com> and sign up (free tier is fine to start).
2. In the Resend dashboard, open **API Keys** and click **Create API Key**.
3. Copy the key (it starts with `re_`). You will paste it into Vercel in step 3.
   Keep it secret — never put it in the code or commit it to git.

### 2. Verify a sender domain (or use Resend's test sender)

Resend will only send email "from" an address you are allowed to use.

- **Recommended:** In Resend, open **Domains**, add your domain (for example
  `showtimeautobody.com`), and follow the instructions to add the DNS records it
  shows you. Once the domain shows **Verified**, you can send from any address at
  that domain, such as `no-reply@showtimeautobody.com`.
- **Just testing first?** Resend provides a built-in sender address
  `onboarding@resend.dev` that works without verifying a domain. Use that as your
  `LEAD_FROM_EMAIL` value temporarily, then switch to your real domain once it is
  verified.

> The default sender in the code is `no-reply@showtimeautobody.com`. That address
> will only work once `showtimeautobody.com` is verified in Resend. Until then,
> set `LEAD_FROM_EMAIL` to a verified address (such as `onboarding@resend.dev`).

### 3. Add Environment Variables in Vercel

In Vercel: open your project, go to **Settings → Environment Variables**, and add
the following. After adding them, set them for the **Production** (and optionally
**Preview**) environments.

| Variable          | Required | What it does |
|-------------------|----------|--------------|
| `RESEND_API_KEY`  | Yes      | Your Resend API key from step 1 (starts with `re_`). Authenticates the email request. |
| `LEAD_TO_EMAIL`   | Yes      | The inbox that should **receive** lead notifications (e.g. the shop's email). |
| `LEAD_FROM_EMAIL` | Optional | The verified "from" address. Defaults to `no-reply@showtimeautobody.com`. Use a Resend-verified address (or `onboarding@resend.dev` while testing). |
| `LEAD_REPLY_TO`   | Optional | A fixed Reply-To address. If left unset, replies go to the email the customer typed into the form (when provided), so you can reply to them directly. |

### 4. Redeploy

Environment variables only take effect on a new deployment. After saving them,
go to **Deployments**, open the latest one, and choose **Redeploy** (or push a
new commit to `main`).

### 5. Test the form

1. Open your live site's `/contact.html` or `/estimate.html`.
2. Fill it out with your own details and submit.
3. You should see the success message, and an email should arrive at
   `LEAD_TO_EMAIL` within a minute.

### 6. Check the function logs if email doesn't arrive

1. In Vercel, open your project and go to the **Logs** tab (or open a deployment
   and view **Functions**).
2. Submit the form again and watch for a log entry from `api/lead`.
3. Common issues:
   - **"Lead handling is not configured yet"** → `RESEND_API_KEY` or
     `LEAD_TO_EMAIL` is missing. Re-check step 3 and redeploy.
   - **A Resend error in the logs** → usually the `from` address isn't verified.
     Verify your domain or set `LEAD_FROM_EMAIL` to `onboarding@resend.dev`.
   - **No email but no error** → check your spam folder and confirm
     `LEAD_TO_EMAIL` is correct.

## Notes

- This is a static HTML/CSS/JS site plus a single serverless function — no build
  step and no heavy dependencies (the function uses the built-in `fetch`).
- No secrets or recipient email addresses are stored in the code; everything
  sensitive comes from environment variables.
- Photo uploads on the estimate form are **not** emailed (only the count is
  noted). Ask customers to send photos by text/email, or add storage later.
- Update canonical URLs, domain, and analytics before final launch.
