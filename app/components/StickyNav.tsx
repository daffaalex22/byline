'use client'

import { useEffect, useState } from 'react'

type StickyNavProps = {
  title: string
}

export default function StickyNav({ title }: StickyNavProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const toggleVisibility = () => {
      const heroSection = document.querySelector('.article-page__hero')
      if (heroSection) {
        const rect = heroSection.getBoundingClientRect()
        setVisible(rect.bottom < 0)
      }
    }

    window.addEventListener('scroll', toggleVisibility, { passive: true })
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  if (!visible) return null

  return (
    <nav className="sticky-nav" aria-label="Article navigation">
      <a href="/" className="sticky-nav__back">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back
      </a>
      <span className="sticky-nav__title">{title}</span>
    </nav>
  )
}
