import React, { useContext, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
  auth,
  facebookProvider,
  googleProvider,
} from '../../components/Auth/firebase'
import { signInWithPopup } from 'firebase/auth'

import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useRouter } from 'next/router'
//import fetch from 'isomorphic-unfetch'
import { GlobalContext } from '@/context/GlobalContext'
import { BsEye, BsEyeSlash } from 'react-icons/bs'
import { UrlObject } from 'url'

type StateObject = {
  username: string
  email: string
  password: string
  otp: any
}
type CustomUrlObject = UrlObject & {
  state?: StateObject
}
const SignUp = () => {
  const [userExist, setUserExist] = useState<boolean>(false)
  const history = useRouter()
  const [username, setUsername] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const { setLogged, setUser } = useContext(GlobalContext)
  const [otp, setOtp] = useState('')
  const [email, setEmail] = useState('')
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [valErrMsg, setValErrMsg] = useState<boolean>(false)
  const errMsgVal =
    'Password must contain one lowercase letter, one uppercase letter, one symbol, and be at least 5 characters long'
  const [errorMessage, setErrorMessage] = useState<boolean | string>(false)

  const validatePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.?}")+;:,<>/(_!@#$%^&*])\S{8,}$/

    if (!passwordRegex.test(value)) {
      setValErrMsg(true)
    } else {
      setValErrMsg(false)
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }
  const handleEmailOtp = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setEmail(value)
    setIsEmailValid(value !== '' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setUsername(value)
    if (/[^a-zA-Z0-9_]/.test(value)) {
      setErrorMessage('Username cannot contain symbols or spaces')
    } else if (/^\s+|\s+$|\s+(?=\s)/.test(value)) {
      setErrorMessage(
        'Username cannot contain leading, trailing, or consecutive spaces',
      )
    } else {
      setErrorMessage('')
    }
  }

  const handlePassChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target
    setPassword(value)
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[.?}")+;:,<>/(_!@#$%^&*])\S{8,}$/
    if (passwordRegex.test(value)) {
      setValErrMsg(false)
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (valErrMsg) {
      return
    }

    if (!isEmailValid) {
      toast.error('Invalid email address', {
        style: {
          background: 'white',
          color: 'red',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '12px 24px',
          fontSize: '16px',
          textAlign: 'center',
        },
      })
      return
    }

    //const data: StateObject = { username, email, password, otp };
    try {
      const response = await fetch(
        'https://api.helpmeout.tech/get-signup-otp/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            Vary: 'Origin',
          },
          body: JSON.stringify({ username, email }),
          mode: 'cors',
        },
      )

      const result = await response.json()

      if (!errorMessage && response.status === 200) {
        console.log('Confirm OTP!')
        toast.success('One more step to go', {
          style: {
            background: 'white', // Change the background color as needed
            color: 'green', // Change the text color as needed
            borderRadius: '8px', // Rounded corners for the toast
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
            padding: '12px 24px', // Adjust padding as needed
            fontSize: '16px', // Adjust font size as needed
            textAlign: 'center',
          },
        })

        setUsername(username)
        setEmail(email)
        setPassword(password)
        setOtp(otp)

        const userData = {
          username,
          email,
          password,
          otp: result.verification_code,
        }
        localStorage.setItem('userData', JSON.stringify(userData))

        // Redirect to the next page
        history.push({
          pathname: '/emailotp',
          state: userData as StateObject,
        } as CustomUrlObject)
        // You can handle success here, e.g., redirect to a success page
      } else {
        console.error('Sign-up failed with status code', result.message)
        toast.error(`Sign-up failed`, {
          style: {
            background: 'white',
            color: 'red',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '12px 24px',
            fontSize: '16px',
            textAlign: 'center',
          },
        })
      }
    } catch (error) {
      console.error('An error occurred:', error)
      toast.error(`Error: ${error}`, {
        style: {
          background: 'white',
          color: 'red',
          borderRadius: '8px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '12px 24px',
          fontSize: '16px',
          textAlign: 'center',
        },
      })
    }
  }

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then((userCredential) => {
        const newUser = userCredential.user
        const copy = newUser.displayName
        setLogged(true)
        if (typeof copy === 'string') {
          localStorage.setItem('user', copy)
          setUser(copy)
        }
        const num = Number(true)
        localStorage.setItem('logged', JSON.stringify(num))

        setUserExist(true) // Change to true
        toast.success('Successfully Logged In Facebook Account', {
          style: {
            background: 'white', // Change the background color as needed
            color: 'green', // Change the text color as needed
            borderRadius: '8px', // Rounded corners for the toast
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
            padding: '12px 24px', // Adjust padding as needed
            fontSize: '16px', // Adjust font size as needed
            textAlign: 'center',
          },
        })
        setLogged(true)
        history.push('/videos')
      })
      .catch((error) => {
        const errorCode = error.code
        toast.error(`Error: ${errorCode}`, {
          style: {
            background: 'red', // Change the background color as needed
            color: 'white', // Change the text color as needed
            borderRadius: '8px', // Rounded corners for the toast
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
            padding: '12px 24px', // Adjust padding as needed
            fontSize: '16px', // Adjust font size as needed
            textAlign: 'center',
          },
        })
      })
  }

  const signInWithFacebook = () => {
    signInWithPopup(auth, facebookProvider)
      .then((userCredential) => {
        const newUser = userCredential.user
        const copy = newUser.displayName
        setLogged(true)
        if (typeof copy === 'string') {
          localStorage.setItem('user', copy)
          setUser(copy)
        }
        const num = Number(true)
        localStorage.setItem('logged', JSON.stringify(num))
        setUserExist(true)
        toast.success('Successfully created an Account With Facebook', {
          style: {
            background: 'white', // Change the background color as needed
            color: 'green', // Change the text color as needed
            borderRadius: '8px', // Rounded corners for the toast
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
            padding: '12px 24px', // Adjust padding as needed
            fontSize: '16px', // Adjust font size as needed
            textAlign: 'center',
          },
        })
        history.push('/videos')
      })
      .catch((error) => {
        const errorCode = error.code

        toast.error(`Error: ${errorCode}`, {
          style: {
            background: 'white', // Change the background color as needed
            color: 'red', // Change the text color as needed
            borderRadius: '8px', // Rounded corners for the toast
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', // Add a subtle box shadow
            padding: '12px 24px', // Adjust padding as needed
            fontSize: '16px', // Adjust font size as needed
            textAlign: 'center',
          },
        })
      })
  }

  return (
    <section className="px-[1rem] xs:px-[10%] py-[3rem] md-px[2rem] md-py[2.5rem]">
      <Link
        href={'/'}
        className="flex items-center gap-[10px] cursor-pointer mb-[2rem]"
      >
        <Image
          src={'/assets/shared/logo.svg'}
          alt="logo"
          width={40}
          height={40}
        />
        <h3 className="font-Sora font-bold">HelpMeOut</h3>
      </Link>

      <div className="flex flex-col justify-center items-center">
        <section className="mt-[2rem] flex flex-col items-center">
          <h1 className="text-primary-400 font-semibold font-Sora text-[32px] mb-[8px] tracking-wide">
            Sign Up
          </h1>
          <p className="text-primary-300 text-center text-[15px] font-Work-Sans font-medium tracking-tight mb-[32px]">
            Join millions of others in sharing successful
            <br /> moves on{' '}
            <span className="text-primary-600 font-semibold">HelpMeOut</span>.
          </p>
          <div
            onClick={signInWithGoogle}
            className="rounded-lg border-2 border-black-600 w-[230px] xs:w-[300px] ss:w-[475px]  bg-white flex justify-center items-center gap-[0.5rem] xs:gap-[1rem] py-[0.8rem] px-[0] mb-[30px] cursor-pointer "
          >
            <Image
              src={'/assets/login/Google.svg'}
              alt="google__logo"
              width={20}
              height={20}
            />
            <p className="mb-[-0.2rem] font-Work-Sans text-[14px] xs:text-[16px] font-medium tracking-tight">
              Continue with Google
            </p>
          </div>

          <div
            onClick={signInWithFacebook}
            className="rounded-lg input__tag border-2 border-black-600 w-[230px] xs:w-[300px]  ss:w-[475px] bg-white flex justify-center items-center  gap-[0.5rem] xs:gap-[1rem] py-[0.8rem] px-[0] mb-[30px]"
          >
            <div className="flex gap-[1rem] ml-[1.5rem] cursor-pointer">
              <Image
                src={'/assets/login/Facebook.svg'}
                alt="facebook__logo"
                width={20}
                height={20}
              />
              <p className="mb-[-0.2rem] font-Work-Sans text-[14px] xs:text-[16px] font-medium tracking-tight">
                Continue with Facebook
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[1rem] mb-[1rem]">
            <div className="w-[100px] ss:w-[200px]  h-[1px] bg-black-100 "></div>
            <p className="font-medium text-primary-500 mt-[-10px]">or</p>
            <div className="w-[100px] ss:w-[200px] h-[1px] bg-black-100 "></div>
          </div>
        </section>
        <form
          className="flex flex-col w-full ss:w-[475px]"
          onSubmit={handleSubmit}
        >
          <div>
            <p className="text-[16px] font-Sora font-medium mb-[14px]">
              Username
            </p>
            <input
              type="username"
              placeholder="Enter your username"
              required
              value={username}
              onChange={handleNameChange}
              className="w-full input__tag h-[50px] rounded-lg border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium  text-[14px] xs:text-[16px]"
            />
          </div>
          {errorMessage && (
            <p className="text-[14px] text-red-400 font-Sora font-medium mb-[14px]">
              {errorMessage}
            </p>
          )}

          <div>
            <p className="text-[16px] font-Sora font-medium mb-[14px]">Email</p>
            <input
              type="Email"
              placeholder="Enter your Email"
              required
              value={email}
              onChange={handleEmailOtp}
              className="w-full input__tag h-[50px] rounded-lg border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium text-[14px] xs:text-[16px]"
            />
            {!isEmailValid && email.length > 0 && (
              <p className="text-[14px] text-red-400 font-Sora font-medium mb-[14px]">
                Invalid email address
              </p>
            )}
          </div>
          <div>
            <p className="text-[16px] font-Sora font-medium mb-[14px]">
              Password
            </p>
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'} // Toggle input type based on showPassword state
                placeholder="Enter your Password"
                required
                value={password}
                onChange={handlePassChange}
                onBlur={validatePassword}
                minLength={5}
                className="w-full input__tag h-[50px] rounded-lg border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium  text-[14px] xs:text-[16px]"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="password-toggle-button text-xl absolute top-[50%] right-[1rem] transform translate-y-[-90%]"
              >
                {showPassword ? <BsEye /> : <BsEyeSlash />}
              </button>
            </div>
          </div>
          {valErrMsg && (
            <p className="text-[14px] text-red-400 font-Sora font-medium mb-[14px]">
              {errMsgVal}
            </p>
          )}

          <button
            // onClick={signUp}
            className="mt-[1rem] input__tag border-2 border-primary-600 rounded-md h-[50px] hover:btn-hover font-Sora text-[16px]  text-[14px] xs:text-[16px] bg-primary-600 text-white "
          >
            Sign Up
          </button>

          <h2 className="mt-[1rem] text-center text-[16px] text-primary-400 tracker-medium font-semibold font-Work-Sans">
            Already Have Account?{' '}
            <Link href={'/logIn'}>
              <span className="font-bold hover:underline cursor-pointer font-Sora">
                Log In
              </span>
            </Link>
          </h2>
        </form>
      </div>
      <ToastContainer
        position="top-center" // Position the toast container at the bottom-center
        autoClose={1500} // Close after 3 seconds (adjust as needed)
        style={{
          width: 'fit-content', // Adjust the width as needed
          textAlign: 'center', // Center-align the container's content
        }}
      />
    </section>
  )
}

export default SignUp
