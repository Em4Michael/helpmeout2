import React from 'react'
import Image from 'next/image'
const LogIn = () => {
  return (
    <section className="px-[10%] py-[3rem] md-px[2rem] md-py[2.5rem]">
      <div className="flex items-center gap-[10px]">
        <Image
          src={'/assets/shared/logo.svg'}
          alt="logo"
          width={40}
          height={40}
        />
        <h3 className="font-Sora font-bold">HelpMeOut</h3>
      </div>

      <div className="flex flex-col justify-center items-center">
        <section className="mt-[2rem] flex flex-col items-center">
          <h1 className="text-primary-400 font-semibold font-Sora text-[32px] mb-[8px] tracking-wide">
            Log in or Sign Up
          </h1>
          <p className="text-primary-300 text-center text-[15px] font-Work-Sans font-medium tracking-tight mb-[32px]">
            Join millions of others in sharing successful
            <br /> moves on{' '}
            <span className="text-primary-600 font-semibold">HelpMeOut</span>.
          </p>
          <div className="rounded-lg border-2 border-black-600 w-[475px] bg-white flex justify-center items-center gap-[1rem] py-[0.8rem] px-[0] mb-[30px] cursor-pointer">
            <Image
              src={'/assets/login/Google.svg'}
              alt="google__logo"
              width={20}
              height={20}
            />
            <p className="mb-[-0.2rem] font-Work-Sans text-[16px] font-medium tracking-tight">
              Continue with Google
            </p>
          </div>

          <div className="rounded-lg border-2 border-black-600 w-[475px] bg-white flex justify-center items-center gap-[1rem] py-[0.8rem] px-[0] mb-[30px]">
            <div className="flex gap-[1rem] ml-[1.5rem] cursor-pointer">
              <Image
                src={'/assets/login/Facebook.svg'}
                alt="facebook__logo"
                width={20}
                height={20}
              />
              <p className="mb-[-0.2rem] font-Work-Sans text-[16px] font-medium tracking-tight">
                Continue with Facebook
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-[1rem] mb-[1rem]">
            <div className="w-[200px] h-[1px] bg-black-100 "></div>
            <p className="font-medium text-primary-500 mt-[-10px]">or</p>
            <div className="w-[200px] h-[1px] bg-black-100 "></div>
          </div>
        </section>
        <form className="flex flex-col w-[475px]">
          <div>
            <p className="text-16px] font-Sora font-medium mb-[14px]">Email</p>
            <input
              type="email"
              placeholder="Enter your email address"
              required
              className="w-full h-[50px] rounded-lg border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium text-[17px]"
            />
          </div>
          <div>
            <p className="text-16px] font-Sora font-medium mb-[14px]">
              Password
            </p>
            <input
              type="password"
              placeholder="Enter your Password"
              required
              min={5}
              className="w-full h-[50px] rounded-lg border-2 border-solid border-black-400 outline-none pl-[1rem] mb-[1rem] font-Sora font-medium text-[17px]"
            />
          </div>
          <button className="mt-[1rem] border-2 border-primary-600 rounded-md h-[50px] hover:btn-hover font-Sora text-[17px] bg-primary-600 text-white ">
            Sign Up
          </button>
        </form>
      </div>
    </section>
  )
}

export default LogIn
