"use client";

import { api } from "@/trpc/react";
import { useEffect, useRef, useState } from "react";

export function CollectImpression({ postId }: { postId: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  const collectImpression = api.post.collectImpression.useMutation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setIsVisible(entry.isIntersecting);
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px", // no margin
        threshold: 0.5, // 50% of target visible
      },
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    // Clean up the observer
    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  useEffect(() => {
    if (isVisible) {
      const viewTimeout = setTimeout(() => {
        isVisible && collectImpression.mutate({ postId, type: "view" });
      }, 500);
      const readTimeout = setTimeout(() => {
        isVisible && collectImpression.mutate({ postId, type: "read" });
      }, 10000);

      return () => {
        clearTimeout(viewTimeout);
        clearTimeout(readTimeout);
      };
    }
  }, [isVisible]);

  return <div ref={ref} aria-hidden={true} />;
}
