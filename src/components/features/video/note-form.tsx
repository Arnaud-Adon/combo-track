"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { noteSchema, NoteSchemaType } from "./note-schema";

export function NoteForm() {
  const form = useForm<NoteSchemaType>({
    resolver: zodResolver(noteSchema),
    defaultValues: {
      note: "",
    },
  });

  const onSubmit = (data: NoteSchemaType) => {
    console.log(data);
    form.reset();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="note"
          render={({ field, fieldState: { error } }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormDescription>Add a note to the replay</FormDescription>
              <FormMessage />
              <pre>{JSON.stringify(error, null, 2)}</pre>
            </FormItem>
          )}
        />
        <Button type="submit">Add note</Button>
      </form>
    </Form>
  );
}
