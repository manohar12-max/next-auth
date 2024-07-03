"use client";

import useCurrentUser from "@/hooks/useCurrentUser";
import { UserRole } from "@prisma/client";
import React from "react";
import FormError from "../FormError";

interface RoleGateProps {
  children: React.ReactNode;
  allowedRole: UserRole;
}
const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
  const session = useCurrentUser();
  const role = session?.role;
  if (role !== allowedRole) {
    return (
      <FormError message="You don't have permission to view this content" />
    );
  }
  return <>{children}</>;
};

export default RoleGate;
