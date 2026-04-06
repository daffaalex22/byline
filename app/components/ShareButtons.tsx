'use client'

import { useState, useEffect } from 'react'
import type { Article } from '@/lib/types'

type ShareButtonsProps = {
  article: Article
}

export default function ShareButtons({ article }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)
  const [url, setUrl] = useState('')

  useEffect(() => {
    setUrl(window.location.href)
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  if (!url) return null

  const encodedUrl = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(article.title)

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
  }

  return (
    <div className="share-buttons">
      <button
        className="share-button share-button--copy"
        onClick={handleCopyLink}
        aria-label="Copy link"
      >
        {copied ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 7L5.5 10.5L12 3.5" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8.5 5.5L8.5 3M8.5 3L6 3M8.5 3L8.5 5.5M8.5 3L3 8.5M5.5 6L5.5 11L10.5 11L10.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
        <span>{copied ? 'Copied!' : 'Copy link'}</span>
      </button>

      <a
        href={shareLinks.twitter}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--twitter"
        aria-label="Share on X"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.54 2.5H13.44L9.14 7.36L14 12.5H9.68L6.86 8.9L3.3 12.5H1.4L6 7.18L1.44 2.5H5.88L8.5 5.82L11.54 2.5ZM10.32 11.23H11.24L4.94 3.38H3.96L10.32 11.23Z"/>
        </svg>
        <span>Share</span>
      </a>

      <a
        href={shareLinks.facebook}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--facebook"
        aria-label="Share on Facebook"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.5 7.5C13.5 4.46 11.04 2 8 2C4.96 2 2.5 4.46 2.5 7.5C2.5 9.99 4.29 12.09 6.64 12.46V8.86H5.22V7.5H6.64V6.24C6.64 4.79 7.43 4.04 8.74 4.04C9.57 4.04 10.25 4.1 10.5 4.16V5.61H9.58C8.88 5.61 8.64 5.96 8.64 6.44V7.5H10.4L10.08 8.86H8.64V12.46C10.99 12.09 12.78 9.99 12.78 7.5H13.5Z"/>
        </svg>
        <span>Share</span>
      </a>

      <a
        href={shareLinks.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="share-button share-button--linkedin"
        aria-label="Share on LinkedIn"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
          <path d="M2.5 4.5C2.5 5.05 2.05 5.5 1.5 5.5C0.95 5.5 0.5 5.05 0.5 4.5C0.5 3.95 0.95 3.5 1.5 3.5C2.05 3.5 2.5 3.95 2.5 4.5Z"/>
          <path d="M0.5 6.5H2.5V13H0.5V6.5Z"/>
          <path d="M4 6.5H5.5V7.25C5.5 7.25 5.98 6.5 7.25 6.5C8.52 6.5 10 7.25 10 9V13H8.5V9.5C8.5 9.18 8.5 8.75 7.75 8.75C7 8.75 6.5 9.18 6.5 9.5V13H5V6.5H4Z"/>
        </svg>
        <span>Share</span>
      </a>

      <a
        href={shareLinks.email}
        className="share-button share-button--email"
        aria-label="Share via email"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M1 3.5L6.5 8L12 3.5M1 3.5H13M1 3.5V11H13V3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Email</span>
      </a>
    </div>
  )
}
