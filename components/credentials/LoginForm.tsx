import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Link from "next/link";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("")
  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();


  const handleInput = (setter) => {
    return function(e) {
      setter(e.target.value);
      console.log(e.key)
      if (errMsg && e.key !==" enter") {
        setErrMsg("")
      }
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setErrMsg('Execute recaptcha not yet available');
      return;
    }

    const captchaToken = await executeRecaptcha('signin');
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
      captchaToken
    });

    if (res?.ok) {
      router.push("/dashboard");
    } else {
      if (res) {
        if (res.error === "CredentialsSignin") {
          setErrMsg("Credentials are not correct")
        } else {
          setErrMsg(res.error)
        }
      } else {
        setErrMsg("Please enter your name")
      }
      
    }
  };

  return (
    <div className="signup">
      <div className="linkbar">
        <Link key={'LinkToSignUpWithEmail'} href={'signup'}>Signup</Link>        
      </div>
      <form onSubmit={handleLogin}>
        <div className="page-title">Login</div>
        <div className="container" >
          <div className="signup-inputs">
            {errMsg !== ""? <div className="error-message sign-up-err">{errMsg}</div>: null}
          </div>
          <div className="signup-inputs">
            <label htmlFor="email-login"> email</label>
          </div>
          <div className="signup-inputs">
            <input placeholder="my@mail.com" id="email-login" onChange={handleInput(setEmail)} className="signup-line" />
          </div>
          <div className="signup-inputs">
            <label htmlFor="password">Password</label>
          </div>
          <div className="signup-inputs">
            <input type="password" id="password" placeholder="secret" onChange={handleInput(setPassword)} className="signup-line" />
          </div>
          <div className="signup-inputs">
            <input id="submit-signup" className="signup-line" type="submit" value="Sign In" />
          </div>
        </div>
        <div className="linkbar">
          <button onClick={() => signIn("google")}>Sign in with Google</button>
          <button onClick={() => signIn("facebook")}>Sign in with Facebook</button>
        </div>
      </form>
 
      <div className="recaptcha">
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

