import { useSession } from "next-auth/react";
import Link from "next/link";
import { useEffect } from "react";
import Signup from './auth/signup'

export default function Index() {
  const { data: session, status } = useSession();
  const loading = status === "loading";

  useEffect(() => {
    if (session) window.location.replace("/events");
  }, [loading, session]);

  return (
    <div className="pt-8">
     <Signup />
    </div>
  );
}
