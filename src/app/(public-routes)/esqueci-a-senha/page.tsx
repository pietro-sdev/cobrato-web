import  ForgotPasswordForm  from "@/components/layout/MudarSenhaForm"

export default function LoginPage() {
  return (
    <div className="flex w-full h-screen">
      
      <div className="grid h-full w-full max-w-[1500px] mx-auto lg:grid-cols-2 px-6">
        
        <div className="flex flex-col gap-6 py-20 md:py-24 items-center justify-center w-full">
          <div className="w-full max-w-md">
            <ForgotPasswordForm />
          </div>
        </div>

        <div className="hidden lg:flex w-full  items-center justify-center bg-[#F9F9F9] rounded-3xl">
          <img
            src="/login-illustrator.svg"
            alt="Ilustração"
            className="max-w-[500px] max-h-[90%] object-contain"
          />
        </div>
      </div>
    </div>
  )
}
