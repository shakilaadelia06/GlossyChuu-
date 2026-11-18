import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

interface ResilientImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackTitle?: string;
}

export const ResilientImage: React.FC<ResilientImageProps> = ({
  src,
  alt,
  className = '',
  fallbackTitle = 'GlossyChuu!',
}) => {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex flex-col items-center justify-center bg-gradient-to-br from-[#FDECF2] via-[#FBD8E5] to-[#F7C2D5] p-6 text-center text-[#5C3648] ${className}`}
        role="img"
        aria-label={alt}
      >
        <Sparkles className="mb-2 h-6 w-6 text-[#C83E72]" aria-hidden="true" />
        <span className="font-bubble text-lg font-bold text-[#3D2230]">
          {fallbackTitle}
        </span>
        <span className="mt-1 text-xs text-[#75485D]">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      referrerPolicy="no-referrer"
      onError={() => setHasError(true)}
      className={className}
    />
  );
};
