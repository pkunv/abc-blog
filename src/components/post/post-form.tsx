"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TypographySmall } from "@/components/ui/typography";
import { fromJSONToPlate } from "@/lib/plate";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { postSchema } from "@/trpc/schemas";
import { Eye, SquareChartGantt, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { toast } from "sonner";

const formSchema = postSchema;

export default function PostForm({
  data,
  carouselEnabled,
}: {
  data?: z.infer<typeof formSchema>;
  carouselEnabled: boolean;
}) {
  const [isDeleteFileDialogOpen, setIsDeleteFileDialogOpen] = useState(false);
  const [deleteFileUrl, setDeleteFileUrl] = useState<string | null>(null);
  const ref = useRef<HTMLFormElement>(null);

  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: data?.id ?? undefined,
      title: data?.title ?? "",
      content: data?.content ?? "",
      keywords: data?.keywords ?? "",
      category: data?.category ?? new Date().toISOString().slice(0, 7),
      active: data?.active ?? true,
      placement: data?.placement ?? "DEFAULT",
      files: data?.files ?? [],
    },
  });
  const carouselFilesArray = useFieldArray({
    control: form.control,
    name: "files",
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
      router.refresh();
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
      <form
        ref={ref}
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-4"
      >
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
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Public</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2 self-center"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>
                You can set your post to non-public to save it as a draft.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placement"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placement</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a display place" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEFAULT">Default</SelectItem>
                  <SelectItem value="FEATURED">Featured posts</SelectItem>
                  <SelectItem value="ABOUT">About page</SelectItem>
                  <SelectItem value="CONTACT">Contact page</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                You can set your post to be displayed in a static area, like
                Contact or About page. Featured posts are going to be appended
                to the top of the Home page.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {carouselEnabled && (
          <>
            <AlertDialog open={isDeleteFileDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This will permanently delete your post carousel image. You
                    can undo this action by refreshing the page.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    type="button"
                    onClick={() => {
                      if (deleteFileUrl) {
                        const file = carouselFilesArray.fields.find(
                          (file) => file.url === deleteFileUrl,
                        );
                        if (!file) return;
                        carouselFilesArray.update(
                          carouselFilesArray.fields.findIndex(
                            (file) => file.url === deleteFileUrl,
                          ),
                          {
                            url: file?.url,
                            type: file?.type,
                            name: file?.name,
                            deleted: true,
                          },
                        );
                        setIsDeleteFileDialogOpen(false);
                        if (ref.current) ref.current.requestSubmit();
                      }
                    }}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <FormField
              control={form.control}
              name="files"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carousel images</FormLabel>
                  <FormControl>
                    <UploadButton
                      endpoint="imageUploader"
                      input={{ postId: data?.id }}
                      onClientUploadComplete={(res) => {
                        res.map((file) => {
                          carouselFilesArray.append({
                            url: file.url,
                            type: file.type,
                            name: file.name,
                          });
                        });
                        toast.success("Files uploaded!");
                        form.clearErrors("files");
                      }}
                      onUploadError={(error: Error) => {
                        console.log(error);
                        form.setError("files", {
                          type: "manual",
                          message: error.message,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                  {form.getValues("files") &&
                    form.getValues("files")!.length > 0 && (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Filename</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {form
                            .getValues("files")!
                            .filter((file) => !file.deleted)
                            .map((file, index) => (
                              <TableRow key={index}>
                                <TableCell>{file.name}</TableCell>
                                <TableCell>{file.type}</TableCell>
                                <TableCell>
                                  <Button
                                    type="button"
                                    onClick={() => {
                                      setDeleteFileUrl(file.url);
                                      setIsDeleteFileDialogOpen(true);
                                    }}
                                  >
                                    <Trash2 />
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    )}
                </FormItem>
              )}
            />
          </>
        )}
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
          <div className="flex gap-2">
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
