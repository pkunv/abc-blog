import { getServerAuthSession } from "@/server/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError, UTFiles } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

export const ourFileRouter = {
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 10 } })
    .input(z.object({ postId: z.number().optional() }))
    .middleware(async (data) => {
      const session = await getServerAuthSession();

      if (!session) throw new UploadThingError("Unauthorized");

      const fileOverrides = data.files.map((file) => {
        const postId = data.input.postId;
        return { ...file, customId: postId?.toString() };
      });

      return {
        userId: session.user.id,
        customId: data.input.postId,
        [UTFiles]: fileOverrides,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      return { uploadedBy: metadata.userId, file, customId: file.customId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
