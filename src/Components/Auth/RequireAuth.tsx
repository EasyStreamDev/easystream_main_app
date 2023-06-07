import { useLocation, Navigate, Outlet } from "react-router-dom";
import React from "react";
import useAuth from "../../hooks/useAuth";
import { RoleEnum, SubscriptionTypeEnum } from "../../Types";

// Define a React component named RequireAuth
const RequireAuth = ({
  allowedSubscriptions,
}: {
  allowedSubscriptions: string[];
}) => {
  // Custom hook to get authentication information
  const { auth }: any = useAuth();

  // Get the current location
  const location = useLocation();

  // Log the allowed subscriptions and the current user's subscription
  console.log("allowedSubscriptions", allowedSubscriptions);
  console.log("auth?.subscription", auth?.subscription);

  // Check if the current user's subscription is included in the allowedSubscriptions array
  // If true, render the child components wrapped by the Outlet component
  // If false, check if the user is authenticated (has an email)
  // If authenticated, navigate to the "/unauthorized" route with the current location information
  // If not authenticated, navigate to the "/login" route with the current location information
  return allowedSubscriptions.includes(auth?.subscription) ? (
    <Outlet />
  ) : auth?.email ? (
    <Navigate to="/unauthorized" state={{ from: location }} replace />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

// Export the RequireAuth component as the default export
export default RequireAuth;
