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
  t,
}: {
  data?: z.infer<typeof formSchema>;
  carouselEnabled: boolean;
  t: IntlMessages["postForm"];
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
      toast.success(t.created);
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
      toast.success(t.updated);
      router.push(`/dashboard/${data.slug}`);
      router.refresh();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
  const deletePost = api.post.delete.useMutation({
    onSuccess: () => {
      toast.success(t.deleted);
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
              <FormLabel>{t.title}</FormLabel>
              <FormControl>
                <Input placeholder={t.titlePlaceholder} {...field} />
              </FormControl>
              <FormDescription>{t.titleDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.content}</FormLabel>
              <FormControl>
                <PlateEditor
                  onChange={field.onChange}
                  initialValue={fromJSONToPlate(field.value)}
                />
              </FormControl>
              <FormDescription>{t.contentDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="keywords"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.keywords}</FormLabel>
              <FormControl>
                <Input placeholder={t.keywordsPlaceholder} {...field} />
              </FormControl>
              <FormDescription>{t.keywordsDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.category}</FormLabel>
              <FormControl>
                <Input placeholder="Special or 2024-12" {...field} />
              </FormControl>
              <FormDescription>{t.categoryDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.public}</FormLabel>
              <FormControl>
                <Checkbox
                  className="ml-2 self-center"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <FormDescription>{t.publicDescription}</FormDescription>
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
                    <SelectValue placeholder={t.placementPlaceholder} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="DEFAULT">{t.placementDefault}</SelectItem>
                  <SelectItem value="FEATURED">
                    {t.placementFeatured}
                  </SelectItem>
                  <SelectItem value="ABOUT">{t.placementAbout}</SelectItem>
                  <SelectItem value="CONTACT">{t.placementContact}</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>{t.placementDescription}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        {carouselEnabled && (
          <>
            <AlertDialog open={isDeleteFileDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>{t.dialogSure}</AlertDialogTitle>
                  <AlertDialogDescription>
                    {t.dialogDescription}
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>{t.dialogCancel}</AlertDialogCancel>
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
                    {t.dialogDelete}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <FormField
              control={form.control}
              name="files"
              render={({}) => (
                <FormItem>
                  <FormLabel>{t.carousel}</FormLabel>
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
                        toast.success(t.carouselSuccess);
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
                            <TableHead>{t.carouselFilename}</TableHead>
                            <TableHead>{t.carouselType}</TableHead>
                            <TableHead>{t.carouselAction}</TableHead>
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
                  <TypographySmall>
                    {data.views} {t.views}
                  </TypographySmall>
                </div>
                <div className="flex items-center gap-2">
                  <SquareChartGantt />
                  <TypographySmall>
                    {data.reads} {t.reads}
                  </TypographySmall>
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
                    <AlertDialogTitle>{t.dialogSure}</AlertDialogTitle>
                    <AlertDialogDescription>
                      {t.dialogDescription}
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>{t.dialogCancel}</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => {
                        if (data.id) deletePost.mutate({ id: data.id });
                      }}
                    >
                      {deletePost.isPending ? (
                        <Spinner className="grayscale invert" />
                      ) : (
                        <>{t.dialogDelete}</>
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
                <>{t.submit}</>
              )}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
