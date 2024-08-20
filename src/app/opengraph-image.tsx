import { env } from "@/env";
import { blogProps } from "@/lib/getBlogProps";
import { ImageResponse } from "next/og";

// Image metadata
export const alt = blogProps.description;
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Image generation
export default async function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 128,
          background: "white",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          letterSpacing: "-0.025em",
          fontWeight: 800,
        }}
      >
        {env.BLOG_NAME}
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [],
    },
  );
}
