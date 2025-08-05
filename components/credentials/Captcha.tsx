import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";


const Captcha = function({ children }) {
  return (
    <GoogleReCaptchaProvider

      reCaptchaKey={process.env.NEXT_PUBLIC_CAPTCHA_KEY}

      scriptProps={{
        async: true,
        defer: false,
        appendTo: 'head',
        nonce: undefined 
      }}
      container={{
        element: "recaptcha-container",
      }}
    >
      {children}
    </GoogleReCaptchaProvider>
  ) 
}

export default Captcha