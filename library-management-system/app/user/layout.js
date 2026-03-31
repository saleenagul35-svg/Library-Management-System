import UserNavbar from "../user/navbar/page"; // apna sahi path

export default function UserLayout({ children }) {
  return (
    <>
      <UserNavbar />
      {children}
    </>
  );
}