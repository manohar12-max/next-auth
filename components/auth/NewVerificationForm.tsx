"use client";

import Cardwrapper from "./Cardwrapper";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { newVerifications } from "@/actions/new-verification";
import FormError from "@/components/FormError";
import FormSuccess from "../FormSuccess";
const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    if(success || error) return  
    if (!token) {
      setError("Token not found");
      return;
    }

    const res = await newVerifications(token);
    if (res.error) {
      setError(res.error);
    } else {
      setSuccess(res.success);
    }
  }, [token,success,error]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);
  return (
    <Cardwrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
      showSocial={false}
    >
      <div className="w-full flex items-center justify-center ">
        {!success && !error && <BeatLoader />}
       { !success && <FormError message={error} />}
        <FormSuccess message={success} />
      </div>
    </Cardwrapper>
  );
};

export default NewVerificationForm;
