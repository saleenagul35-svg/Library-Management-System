'use client';
import UserNavbar from "../user/navbar/page"; // apna sahi path
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const queryClient = new QueryClient() 

export default function UserLayout({ children }) {
  return (
    <>
      <UserNavbar />
      <QueryClientProvider client={queryClient}>
      {children}
      </QueryClientProvider>
    </>
  );
}