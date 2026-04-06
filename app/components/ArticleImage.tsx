'use client'

import { useState } from 'react'
import Lightbox from './Lightbox'

type ArticleImageProps = {
  src: string
  alt: string
}

export default function ArticleImage({ src, alt }: ArticleImageProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false)

  return (
    <>
      <div className="article-page__image-wrap" onClick={() => setLightboxOpen(true)}>
        <img className="article-page__image" src={src} alt={alt} />
      </div>
      {lightboxOpen && (
        <Lightbox src={src} alt={alt} onClose={() => setLightboxOpen(false)} />
      )}
    </>
  )
}
