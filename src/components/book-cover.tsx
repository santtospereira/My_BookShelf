'use client';

import { useState } from 'react';

interface Props {
  src: string | null;
  alt: string;
}

export default function BookCover({ src, alt }: Props) {
  const [imgSrc, setImgSrc] = useState(src || '/file.svg');

  return (
    <img 
      src={imgSrc}
      alt={alt}
      className="w-full h-auto rounded-md object-cover"
      onError={() => setImgSrc('/file.svg')}
    />
  );
}