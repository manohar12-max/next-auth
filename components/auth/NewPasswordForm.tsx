"use client";
import Cardwrapper from "./Cardwrapper";
import { zodResolver } from "@hookform/resolvers/zod";

import { NewPasswordSchema } from "@/schemas";
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
import { newPassword } from "@/actions/new-password";
const NewPasswordForm = () => {
  const [isPending,startTransition]=useTransition()
  const [error,setError] = useState<string |undefined>("")
  const [success,setSuccess] = useState<string |undefined>("")
 const searchParams=useSearchParams()
  const token = searchParams.get("token");
 
  const form = useForm<z.infer<typeof NewPasswordSchema>>({
    resolver: zodResolver(NewPasswordSchema),
    defaultValues: {
      password: "",
     
    },
  });
  const onSubmit = (values: z.infer<typeof NewPasswordSchema>) => {
    setError("");
    setSuccess("");
    
    startTransition(async() => {

        const res=await newPassword(values,token)
        if (res.error) {
          setError(res.error);
        } else {
          setSuccess(res.success);
        }

      });
    
   
  };
  return (
    <Cardwrapper
      headerLabel="Enter new Password?"
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
                      placeholder="Enter your password "
                      {...field}
                      type="password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
              name="password"
            />
           
          </div>
          <FormError message={error}/>
          <FormSuccess message={success}/>
          <Button disabled={isPending} type="submit" className="w-full ">
           Reset Password!
          </Button>
        </form>
      </Form>
    </Cardwrapper>
  );
};

export default NewPasswordForm;
