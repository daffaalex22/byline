'use client'

import { useEffect, useCallback } from 'react'

type LightboxProps = {
  src: string
  alt: string
  onClose: () => void
}

export default function Lightbox({ src, alt, onClose }: LightboxProps) {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose],
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  return (
    <div className="lightbox" onClick={onClose} role="dialog" aria-modal="true" aria-label="Image lightbox">
      <button className="lightbox__close" onClick={onClose} aria-label="Close lightbox">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 6L18 18M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className="lightbox__content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} className="lightbox__image" />
      </div>
    </div>
  )
}
