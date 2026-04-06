'use client'

import { useEffect, useState } from 'react'

const sections = [
  { id: 'top-story', label: 'Top story' },
  { id: 'latest', label: 'Approach' },
  { id: 'archive', label: 'Latest' },
  { id: 'method', label: 'Method' },
  { id: 'launch', label: 'Publishing' },
]

export default function ScrollSpy() {
  const [activeId, setActiveId] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const observers = new Map()

    const handleIntersect = (id: string) => {
      setActiveId(id)
    }

    sections.forEach(({ id }) => {
      const element = document.getElementById(id)
      if (!element) return

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              handleIntersect(id)
            }
          })
        },
        {
          rootMargin: '-20% 0px -60% 0px',
          threshold: 0,
        },
      )

      observer.observe(element)
      observers.set(id, observer)
    })

    return () => {
      observers.forEach((observer) => observer.disconnect())
    }
  }, [])

  return (
    <div className="nav-container">
      <button 
        className={`hamburger ${menuOpen ? 'open' : ''}`} 
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle navigation"
        aria-expanded={menuOpen}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      <nav className={`top-nav ${menuOpen ? 'open' : ''}`} aria-label="Primary">
        {sections.map(({ id, label }) => (
          <a
            key={id}
            href={`#${id}`}
            className={activeId === id ? 'active' : ''}
            aria-current={activeId === id ? 'true' : undefined}
            onClick={() => setMenuOpen(false)}
          >
            {label}
          </a>
        ))}
      </nav>
    </div>
  )
}
