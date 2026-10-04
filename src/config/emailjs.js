/**
 * ============================================================
 * EmailJS CONFIGURATION
 * ============================================================
 * Single source of truth for the contact-form mail service.
 * Every value is read from Vite environment variables at build
 * time — no ID, key or URL is hardcoded in any React component.
 *
 * Required variables (see .env.example):
 *   VITE_EMAILJS_SERVICE_ID   the EmailJS *service*  (e.g. service_xxx)
 *   VITE_EMAILJS_TEMPLATE_ID  the EmailJS *template* (e.g. template_xxx)
 *   VITE_EMAILJS_PUBLIC_KEY   the EmailJS *public* key only
 *
 * SAFETY RULES
 *   * Only `VITE_*` variables reach the browser bundle, so they are
 *     public by design. The EmailJS public key is designed to be
 *     public and is safe here.
 *   * NEVER put a Gmail password, an SMTP credential or an EmailJS
 *     *private* key in a `VITE_*` variable — those would be shipped
 *     to every visitor. Keep them in your EmailJS dashboard instead.
 *   * The message recipient is configured on the EmailJS *template*
 *     ("To Email"), not here, so it stays private and can never
 *     leak into the bundle.
 * ============================================================
 */

import emailjs from '@emailjs/browser'

const PLACEHOLDER = 'PASTE_MY_EMAILJS_PUBLIC_KEY_HERE'

const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID ?? ''
const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID ?? ''
const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY ?? ''

/**
 * Template variables understood by the EmailJS template.
 * These names MUST match the `{{...}}` placeholders inside the
 * template body in the EmailJS dashboard.
 */
export const templateParams = {
  name: 'name',
  email: 'email',
  subject: 'subject',
  message: 'message',
}

/**
 * True when all three values are present and the placeholder has
 * been replaced. Used to show an honest error instead of letting
 * `send()` fail opaquely — the form still calls `send()` whenever
 * the values are real.
 */
export const isEmailReady = Boolean(
  serviceId &&
    templateId &&
    publicKey &&
    publicKey !== PLACEHOLDER,
)

/**
 * Send a contact-form message through EmailJS.
 *
 * @param {{name: string, email: string, subject: string, message: string}} data
 * @returns {Promise<{ok: true}>} resolves when EmailJS reports success.
 * @throws  {Error} with a short, safe message when sending fails.
 *          Never includes the public key or any credential.
 */
export async function sendContactEmail(data) {
  // Missing config is a hard failure — never a silent success.
  if (!isEmailReady) {
    throw new Error(
      'The contact form is not configured yet. Please email me directly instead.',
    )
  }

  try {
    await emailjs.send(
      serviceId,
      templateId,
      {
        name: data.name.trim(),
        email: data.email.trim(),
        subject: data.subject.trim(),
        message: data.message.trim(),
      },
      { publicKey },
    )
    return { ok: true }
  } catch (error) {
    throw new Error(describeError(error))
  }
}

/** Turn an EmailJS rejection into a short, human-readable sentence. */
function describeError(error) {
  const text =
    typeof error?.text === 'string'
      ? error.text
      : typeof error?.message === 'string'
        ? error.message
        : ''

  if (/not found|template/i.test(text)) {
    return 'The message service is misconfigured. Please email me directly instead.'
  }
  if (/public key|invalid|unauthorized|forbidden/i.test(text)) {
    return 'The message service rejected the request. Please email me directly instead.'
  }
  if (/limit|quota|too many/i.test(text)) {
    return 'The message service is busy right now. Please try again later.'
  }
  if (/network|failed to fetch|timeout/i.test(text)) {
    return 'Network problem — please check your connection and try again.'
  }
  return 'Something went wrong while sending. Please try again.'
}