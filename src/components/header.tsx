import { useMutation } from "@tanstack/react-query";
import { FileIcon, FileText, Plus, SquarePen, Type, User } from "lucide-react";
import { api } from "../lib/api";
import { queryClient } from "../app/query-client";
import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "@tanstack/react-form";
import { z } from "zod/v4";

export default function Header() {
  return (
    <div className="bg-white w-full border-b border-[#C0C0C0]">
      <div className="justify-between max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex gap-3 items-center">
            <SquarePen className="w-8 h-8 text-[#155DFC]" />
            <p>DevBlog</p>
          </div>
          <CreatePost />
        </div>
      </div>
    </div>
  );
}

function CreatePost() {
  const formSchema = z.object({
    image: z.file().nullish(),
    name: z.string().min(2, "Введите имя от двух символов"),
    title: z.string().min(4, "Введите заголовок от четырех сивмолов"),
    description: z.string().min(10, "Введите описание от десяти символов"),
  });

  const createMutation = useMutation({
    mutationFn: async (value: z.infer<typeof formSchema>) => {
      console.log(value);
      await api.posts.post(value);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
    onError: (error) => {
      console.error("Create error:", error);
      alert("Не удалось создать пост");
    },
  });

  const form = useForm({
    defaultValues: {} as z.infer<typeof formSchema>,
    onSubmit: ({ value }) => {
      createMutation.mutate(value);
    },
    validators: {
      onSubmit: formSchema,
    },
  });

  const Field = form.Field;

  return (
    <div>
      <Dialog>
        <DialogTrigger className="flex items-center px-3.5 py-1.75 gap-2 bg-[#155DFC] rounded-lg text-white cursor-pointer">
          <Plus className="w-4 h-4" />
          <p>Create Post</p>
        </DialogTrigger>
        <DialogContent className="flex flex-col gap-10">
          <DialogHeader>
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              form.handleSubmit();
            }}
            className="flex flex-col gap-5"
          >
            <Field name="image">
              {(field) => (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <FileIcon size={16} color="#155DFC" />
                    <p>1. Add Image</p>
                  </div>
                  <input
                    type="file"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      field.handleChange(file);
                    }}
                    className="outline-1 rounded-md py-2 px-3 focus:outline-[#155DFC]"
                    accept="image/*"
                  />
                  {field.state.meta.errors.map((error) => (
                    <p className="text-[#FF0000]" key={error?.message}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </Field>
            <Field name="name">
              {(f) => (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <User size={16} color="#155DFC" />
                    <p>2. Add Name</p>
                  </div>
                  <input
                    type="text"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    placeholder="Enter author name"
                    className="outline-1 rounded-md py-2 px-3 focus:outline-[#155DFC]"
                  ></input>
                  {f.state.meta.errors.map((error) => (
                    <p className="text-[#FF0000]" key={error?.message}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </Field>
            <Field name="title">
              {(f) => (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <Type size={16} color="#155DFC" />
                    <p className="leading-none">3. Add Title</p>
                  </div>
                  <input
                    className="outline-1 rounded-md py-2 px-3 focus:outline-[#155DFC]"
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    type="text"
                    placeholder="Enter post title"
                  ></input>
                  {f.state.meta.errors.map((error) => (
                    <p className="text-[#FF0000]" key={error?.message}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </Field>
            <Field name="description">
              {(f) => (
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2 items-center">
                    <FileText size={16} color="#155DFC" />
                    <p>4. Add Description</p>
                  </div>
                  <textarea
                    value={f.state.value}
                    onChange={(e) => f.handleChange(e.target.value)}
                    placeholder="Write your post content here..."
                    className="resize-none min-h-20 outline-1 rounded-md py-2 px-3 focus:outline-[#155DFC]"
                  ></textarea>
                  {f.state.meta.errors.map((error) => (
                    <p className="text-[#FF0000]" key={error?.message}>
                      {error?.message}
                    </p>
                  ))}
                </div>
              )}
            </Field>
            <div className="flex gap-2">
              <DialogClose className="border-2 py-2 rounded-lg w-full cursor-pointer">
                <p>Cancel</p>
              </DialogClose>
              <button
                type="submit"
                className="bg-[#155DFC] py-2 rounded-lg w-full cursor-pointer"
              >
                <p className="text-[#FFFFFF]">Publish Post</p>
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
