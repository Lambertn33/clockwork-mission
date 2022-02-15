import { GetServerSidePropsContext } from "next";
import { getCsrfToken, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import FormInput from "@components/Form/FormInput";
import FormButton from '@components/Form/FormButton'
import FormErrorMessage from '@components/Form/FormErrorMessage'

import { getSession } from "@helpers/auth";

interface ServerSideProps {
  csrfToken: string;
}

export default function Login({ csrfToken }: ServerSideProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, seterrorMessage] = useState('')
  const [hasError, setHasError] = useState(false)

  const callbackUrl = typeof router.query?.callbackUrl === "string" ? router.query.callbackUrl : "/events";

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    const response = await signIn<"credentials">("credentials", {
      redirect: false,
      email,
      password,
      callbackUrl,
    });
    if (!response) {
      throw new Error("Received empty response from next auth");
    }

    if (!response.error) {
      // we're logged in! let's do a hard refresh to the desired url
      window.location.replace(callbackUrl);
      return;
    }else{
      setIsSubmitting(false);
      seterrorMessage('Invalid credentials')
      setHasError(true)
    }
  }
  function hideErrorMessage():void{
      setHasError(false)
  }

  return (
   <div className="w-screen h-screen bg-gray-100">
     <div className="flex flex-col items-center justify-center w-full h-full">
       <div className="py-8">
         <h2 className="text-2xl font-bold text-center">Cal.Com</h2>
         <h2 className="text-2xl font-bold">Sign in To your account</h2>
       </div>
      <div className="p-8 bg-white border border-gray-400">
      <form onSubmit={handleSubmit}>
              {hasError && <FormErrorMessage
                   errorMessage={errorMessage}
                   onHide={hideErrorMessage}
                />}
              <FormInput
                value={email}
                label="email address"
                type={email} 
                onChange={(e:any) =>setEmail(e.target.value)}       
              />
              <FormInput
                value={password}
                label="Password"
                type="password"  
                onChange={(e:any) =>setPassword(e.target.value)}      
              />
              <FormButton
              label={isSubmitting ? "please wait...":"sign in"}
              isLoading={isSubmitting}
              />
      </form>
      </div>
      <p className='mt-3'>
          No Account Yet?
          <Link href='/'>
            <a className='font-bold'>Sign up</a>
          </Link>
        </p>
     </div>
   </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { req } = context;
  const session = await getSession({ req });

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      csrfToken: await getCsrfToken(context),
    },
  };
}
