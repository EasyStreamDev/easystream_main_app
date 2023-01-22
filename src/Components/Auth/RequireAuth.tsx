import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { RoleEnum, SubscriptionTypeEnum } from "../../Types";


const RequireAuth = ({ allowedSubscriptions } : { allowedSubscriptions: string[]}) => {
  const { auth } : any = useAuth();
  const location = useLocation();

  console.log('allowedSubscriptions', allowedSubscriptions)
  console.log('auth?.subscription', auth?.subscription)

  return allowedSubscriptions.includes(auth?.subscription) ? (
    <Outlet />
  ) : auth?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default RequireAuth;
