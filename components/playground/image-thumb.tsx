"use client";

import * as React from "react";

import type { PlaygroundImage } from "@/components/playground/types";

export function ImageThumb({ image }: { image: PlaygroundImage }) {
  const url = React.useMemo(() => {
    // Copy into a fresh ArrayBuffer-backed view so it's a valid BlobPart.
    const copy = new Uint8Array(image.data);
    return URL.createObjectURL(new Blob([copy.buffer as ArrayBuffer]));
  }, [image]);

  React.useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <div className="overflow-hidden rounded-md border border-border">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={url}
        alt={image.name}
        title={image.name}
        className="h-20 w-20 object-cover"
      />
    </div>
  );
}
