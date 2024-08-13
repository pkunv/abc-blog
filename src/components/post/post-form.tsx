"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";

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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { postSchema } from "@/trpc/schemas";
import { Trash2 } from "lucide-react";
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
                <Textarea
                  placeholder="Powerful words & thoughtful insights go here..."
                  className="h-28 resize-y"
                  {...field}
                />
              </FormControl>
              <FormDescription>You can use markdown.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2">
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
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
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
      </form>
    </Form>
  );
}
