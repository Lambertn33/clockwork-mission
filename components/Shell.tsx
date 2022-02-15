import React from 'react'
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import {  ReactNode, useEffect } from "react";
import Navbar from "@components/Navbar/Navbar";

export default function Shell(props: { children: any }) {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) {
      router.replace({
        pathname: "/auth/login",
        query: {
          callbackUrl: `${location.pathname}${location.search}`,
        },
      });
    }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, session]);
  if(loading) return <h2>Please wait ....</h2>
  return (
    <div className="flex w-screen h-screen bg-gray-100">
        <div className="w-1/6 bg-white">
            <Navbar session={session} />
        </div>
        <div className="w-5/6">
              {React.cloneElement(props.children ,{session:session})}
        </div>
    </div>
  );
}

interface IState{
  user:{
    session:any
  }
}
