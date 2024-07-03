import BackButton from "@/components/auth/BackButton";
import Header from "@/components/auth/header";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";

import React from 'react'

const ErrorCard = () => {
  return (
    <Card className="w-[400px] shadow-md">
     <CardHeader>
        <Header label="OOPS! Something went wrong" />
     </CardHeader>
     <CardFooter>
        <BackButton label="Back to login" href="/auth/login"/>
     </CardFooter>
    </Card>
  )
}

export default ErrorCard
