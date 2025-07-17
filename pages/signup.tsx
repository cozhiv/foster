
import Captcha from "@/components/credentials/Captcha";
import SignupForm from "@/components/credentials/SignupForm";
import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

export default function SignUp() {
  console.log("thamn!")
  console.log(process.env.NEXT_PUBLIC_CAPTCHA_KEY)

  return (
    <Captcha>
      <SignupForm />
    </Captcha>
    
  )
}
