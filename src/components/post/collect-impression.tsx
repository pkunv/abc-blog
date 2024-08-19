"use client";

import { api } from "@/trpc/react";
import { useEffect, useRef, useState } from "react";

export function CollectImpression({ postId }: { postId: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [impression, setImpression] = useState({
    visible: false,
    checkpoint: "view",
    finished: false,
  });

  const collectImpression = api.post.collectImpression.useMutation({
    onSuccess: () => {
      setImpression((prev) => {
        if (prev.checkpoint === "view") {
          return { ...prev, checkpoint: "read" };
        } else {
          return { ...prev, finished: true };
        }
      });
    },
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) {
          setImpression((prev) => {
            return {
              visible: entry.isIntersecting,
              checkpoint: prev.checkpoint,
              finished: prev.finished,
            };
          });
        }
      },
      {
        root: null, // viewport
        rootMargin: "0px", // no margin
        threshold: 0.8, // 50% of target visible
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
    if (impression.visible && !impression.finished) {
      const viewTimeout = setTimeout(() => {
        impression.visible &&
          impression.checkpoint === "view" &&
          collectImpression.mutate({ postId, type: "view" });
      }, 500);
      const readTimeout = setTimeout(() => {
        impression.visible &&
          impression.checkpoint === "read" &&
          collectImpression.mutate({ postId, type: "read" });
      }, 10000);

      return () => {
        clearTimeout(viewTimeout);
        clearTimeout(readTimeout);
      };
    }
  }, [impression]);

  return <div ref={ref} aria-hidden={true} />;
}
