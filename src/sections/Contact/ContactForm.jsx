import { memo, useState } from 'react'

import { submitContact } from '../../data/portfolio.js'
import styles from './Contact.module.css'

const initialValues = { name: '', email: '', subject: '', message: '' }

function validate(values) {
  const errors = {}
  if (!values.name.trim()) errors.name = 'Please enter your name'
  else if (values.name.trim().length < 2) errors.name = 'Name looks too short'

  if (!values.email.trim()) errors.email = 'Please enter your email'
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim()))
    errors.email = 'Please enter a valid email address'

  if (!values.subject.trim()) errors.subject = 'Please add a subject'

  if (!values.message.trim()) errors.message = 'Please write a message'
  else if (values.message.trim().length < 10)
    errors.message = 'Message should be at least 10 characters'

  return errors
}

function ContactForm() {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | success | error

  const sending = status === 'sending'

  const update = (field) => (event) => {
    const value = event.target.value
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => {
      if (!current[field]) return current
      const next = { ...current }
      delete next[field]
      return next
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault() // no page reload
    if (sending) return

    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setStatus('sending')
    try {
      await submitContact(values)
      setValues(initialValues)
      setErrors({})
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className={styles.success} role="status">
        <svg
          className={styles.successIcon}
          viewBox="0 0 72 72"
          aria-hidden="true"
        >
          <circle
            className={styles.successCircle}
            cx="36"
            cy="36"
            r="32"
          />
          <path
            className={styles.successCheck}
            d="M22 37 l10 10 l19 -21"
          />
        </svg>
        <h3 className={styles.successTitle}>Message Sent</h3>
        <p className={styles.successText}>
          Thanks for reaching out — I&rsquo;ll get back to you soon.
        </p>
        <button type="button" className="btn" onClick={() => setStatus('idle')}>
          Send another message
        </button>
      </div>
    )
  }

  const field = (id, label, type, autoComplete, delay) => (
    <div className={styles.field} data-reveal style={{ '--reveal-delay': `${delay}ms` }}>
      <input
        id={id}
        name={id}
        type={type}
        className={styles.input}
        placeholder=" "
        value={values[id]}
        onChange={update(id)}
        autoComplete={autoComplete}
        aria-invalid={errors[id] ? 'true' : undefined}
        aria-describedby={errors[id] ? `${id}-error` : undefined}
      />
      <label htmlFor={id} className={styles.label}>
        {label}
      </label>
      {errors[id] && (
        <p id={`${id}-error`} className={styles.error}>
          {errors[id]}
        </p>
      )}
    </div>
  )

  return (
    <form
      className={styles.form}
      onSubmit={handleSubmit}
      noValidate
      aria-busy={sending}
    >
      {field('name', 'Name', 'text', 'name', 340)}
      {field('email', 'Email', 'email', 'email', 410)}
      {field('subject', 'Subject', 'text', 'off', 480)}

      <div
        className={styles.field}
        data-reveal
        style={{ '--reveal-delay': '550ms' }}
      >
        <textarea
          id="message"
          name="message"
          rows={5}
          className={`${styles.input} ${styles.textarea}`}
          placeholder=" "
          value={values.message}
          onChange={update('message')}
          aria-invalid={errors.message ? 'true' : undefined}
          aria-describedby={errors.message ? 'message-error' : undefined}
        />
        <label htmlFor="message" className={styles.label}>
          Message
        </label>
        {errors.message && (
          <p id="message-error" className={styles.error}>
            {errors.message}
          </p>
        )}
      </div>

      {status === 'error' && (
        <p className={styles.formError} role="alert">
          Something went wrong — please try again.
        </p>
      )}

      <button
        type="submit"
        className={`btn btn--primary ${styles.submit}`}
        disabled={sending}
      >
        {sending ? (
          <>
            <span className={styles.spinner} aria-hidden="true" />
            Sending…
          </>
        ) : (
          <>
            Send Message
            <span className="btn-arrow" aria-hidden="true">
              →
            </span>
          </>
        )}
      </button>
    </form>
  )
}

export default memo(ContactForm)
