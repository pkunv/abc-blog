"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { PlateEditor } from "@/components/plate-ui/plate-editor";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { TypographySmall } from "@/components/ui/typography";
import { fromJSONToPlate } from "@/lib/plate";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { postSchema } from "@/trpc/schemas";
import { Eye, SquareChartGantt, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const formSchema = postSchema;

export function PostForm({ data }: { data?: z.infer<typeof formSchema> }) {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id ?? undefined,
      title: data?.title ?? "",
      content: data?.content ?? "",
      keywords: data?.keywords ?? "",
      category: data?.category ?? new Date().toISOString().slice(0, 7),
    },
  });

  const createPost = api.post.create.useMutation({
    onSuccess: () => {
      toast.success("Post created!");
      router.push("/dashboard");
      router.refresh();

      form.reset();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const updatePost = api.post.update.useMutation({
    onSuccess: (data) => {
      toast.success("Post updated!");
      router.push(`/dashboard/${data.slug}`);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      toast.success("Post deleted!");
      router.push("/dashboard");
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    if (values.id !== undefined) {
      updatePost.mutate(values);
      return;
    }

    createPost.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="New post title" {...field} />
              </FormControl>
              <FormDescription>
                This is will be the title of your new post, and will be used in
                the URL.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <PlateEditor
                  onChange={field.onChange}
                  initialValue={fromJSONToPlate(field.value)}
                />
              </FormControl>
              <FormDescription>
                You can append images by copy-pasting them.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Keywords</FormLabel>
              <FormControl>
                <Input
                  placeholder="technology,blog posting,wholesome"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Insert keywords of your post separated by commas.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <FormControl>
                <Input placeholder="Special or 2024-12" {...field} />
              </FormControl>
              <FormDescription>
                Previously unused category will attach to your blog navigation.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-8 flex-col items-center gap-2">
            {data && (
              <>
                <div className="flex items-center gap-2">
                  <Eye />
                  <TypographySmall>{data.views} views</TypographySmall>
                </div>
                <div className="flex items-center gap-2">
                  <SquareChartGantt />
                  <TypographySmall>{data.reads} reads</TypographySmall>
                </div>
              </>
            )}
          </div>
          <div className="flex">
            {data?.id && (
              <AlertDialog>
                <AlertDialogTrigger
                  type="button"
                  className={cn(buttonVariants({ variant: "ghost" }))}
                >
                  <Trash2 />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will permanently delete
                      your post.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (data.id) deletePost.mutate({ id: data.id });
                      }}
                    >
                      {deletePost.isPending ? (
                        <Spinner className="grayscale invert" />
                      ) : (
                        "Delete"
                      )}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
            <Button type="submit">
              {createPost.isPending || updatePost.isPending ? (
                <Spinner className="grayscale invert" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
