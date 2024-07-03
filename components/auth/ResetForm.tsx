"use client";
import Cardwrapper from "./Cardwrapper";
import { zodResolver } from "@hookform/resolvers/zod";

import { ResetSchema } from "@/schemas";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useForm } from "react-hook-form";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import { reset } from "@/actions/reset";
import { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
const ResetForm = () => {
  const [isPending,startTransition]=useTransition()
  const [error,setError] = useState<string |undefined>("")
  const [success,setSuccess] = useState<string |undefined>("")

  const form = useForm<z.infer<typeof ResetSchema>>({
    resolver: zodResolver(ResetSchema),
    defaultValues: {
      email: "",
     
    },
  });
  const onSubmit = (values: z.infer<typeof ResetSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
        reset(values).then((data) => {
        setSuccess(data?.success);
        setError(data?.error);
      });
    });
   
  };
  return (
    <Cardwrapper
      headerLabel="Forgot your Password?"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      
    >
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="space-y-4">
            <FormField
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                     disabled={isPending}
                      placeholder="Enter your email "
                      {...field}
                      type="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="email"
            />
           
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button disabled={isPending} type="submit" className="w-full ">
           Send reset email!
          </Button>
        </form>
      </Form>
    </Cardwrapper>
  );
};

export default ResetForm;
