import axios from "axios";
import { getSession } from "next-auth/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import FormInput from "@components/Form/FormInput";
import FormButton from '@components/Form/FormButton'
import FormErrorMessage from "@components/Form/FormErrorMessage";

interface IState {
  form: {
    label: string,
    type: string,
    prefix?: string,
    forgotPassword?: string,
    onChange: Function,
    value: string
  },
  button: {
    label: string,
    isLoading: boolean
  }
}

export default function Signup() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, seterrorMessage] = useState('')
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    async function redirectOnLogin() {
      const session = await getSession();
      if (session) window.location.replace("/");
    }
    redirectOnLogin();
  }, []);

  async function handleSubmit(e: React.SyntheticEvent) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    return axios
      .post("/api/auth/signup", {
        email,
        username,
        password,
      })
      .then(() => {
        alert("success");
        window.location.replace("/");
      })
      .catch((e) => {
        setIsSubmitting(false);
        const errorMessage = e.response?.data?.message;
        seterrorMessage(errorMessage)
        setHasError(true)
      });
  }
  function hideErrorMessage():void{
      setHasError(false)
  }

  return (
    <div className="w-screen h-screen px-48">
      <div className="flex flex-col items-center justify-center w-full h-full">
        <div className="p-8 border border-gray-400">
          <div>
            <h2 className="text-2xl font-extrabold">Start your 14-day Free Trial</h2>
            <h6 className="text-sm text-gray-500">No credit card required.try all pro features for 14 days</h6>
            <span className="text-sm text-gray-500">upgrade any time to pro for $12/month</span>
          </div>
          <hr className='m-4' />
          <form onSubmit={handleSubmit}>
             {hasError && <FormErrorMessage
                   errorMessage={errorMessage}
                   onHide={hideErrorMessage}
                />}
            <FormInput
              value={username}
              label="Username"
              type="text"
              onChange={(e: any) => setUsername(e.target.value)}
            />
            <FormInput
              value={email}
              label="email address"
              type={email}
              onChange={(e: any) => setEmail(e.target.value)}
            />
            <FormInput
              value={password}
              label="Password"
              type="password"
              onChange={(e: any) => setPassword(e.target.value)}
            />
            <FormButton
              label="sign up for free"
              isLoading={isSubmitting}
            />
          </form>
        </div>
        <p className='mt-3'>
          Already Have an account?
          <Link href='/auth/login'>
            <a className='font-bold'>Login</a>
          </Link>
        </p>
      </div>
    </div>
  );
}
