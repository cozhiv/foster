import { InputEventHandler, useState, useCallback, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { InputType } from "zlib";
import {  useGoogleReCaptcha } from "react-google-recaptcha-v3";


interface ZhiForm {
  email: string,
  password: string,
  repassword: string
}


export default function SignupForm() {
  

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [password, setPassword] = useState("")
  const [repassword, setRepassword] = useState("")
  const [email, setEmail] =  useState("");
  const [commonErr, setCommonErr] = useState("");
  const [emailErr, setEmailErr] = useState("")
  const [passMatchErr, setPassMatchErr] = useState("");
  const [passWeakErr, setPassWeakErr] = useState("");
  const [strongPass, setStrongPass] = useState(0)
  const [passVal, setPassVal] = useState("");


  const router = useRouter();
  const { executeRecaptcha } = useGoogleReCaptcha();
  // const handleSignup = async () => {
  //   const res = await fetch("/api/signup", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify({ email, password }),
  //   });

  //   if (res.ok) router.push("/login");
  //   else alert("Signup failed");
  // };
  

  const setPassComplexity = (pass: string) => {
    setPassword(pass);
    if (pass.length < 5) {
      setStrongPass(1);
      
    } else if (pass.length < 10) {
      setStrongPass(2);
    } else if (/[A-Z]/.test(pass) && /[0-9]/.test(pass)) {
      if (/[!@#$%^&*\(\)\-\+\=\,\.\'\;\]\[\{\}\<\>\/\"\:\?\`\~]/.test(pass)) {
        setStrongPass(4)
      } else {
        setStrongPass(3);
      }
      
    }
  }

  const setNoErr = async () => {
    if (!emailErr || !passMatchErr || !passWeakErr || !commonErr) {
      setCommonErr("");
      setEmailErr("");
      setPassMatchErr("");
      setPassWeakErr("");
    }
  }


  const setPass = (e) => {
    
    setPassComplexity(e.target.value)
    setNoErr();
  }

  const handleInput = (setInput) => {
    return function (e) {
      console.log(e.target.value)
      setInput(e.target.value);
      setNoErr();
    }
  }

  const handleFormSubmition = async (e) => {
    e.preventDefault()
    
    if (!executeRecaptcha) {
      setCommonErr('Execute recaptcha not yet available');
      return;
    }

    const captchaToken = await executeRecaptcha('signup');
    if (email === "" || email.length < 4) {
      setCommonErr("Please try something more sane.");
    } else {
      if (password === repassword && password !== "") {
        if (strongPass === 4) {
          const res: Response = await fetch("/api/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password, captchaToken }),
          });

          if (res.ok) {
            router.push("/login");
          } else {
            const resp = await res.json()
            setCommonErr(resp.error);
          }
        } else {
          setPassWeakErr("Password is too weak!")
        }
      } else {
        setPassMatchErr("Password mismatch!")
      }
    }
    
  };


  // Create an event handler so you can call the verification on button click event or form submit
  // const handleReCaptchaVerify = useCallback(async () => {
  //   if (!executeRecaptcha) {
  //     console.log('Execute recaptcha not yet available');
  //     return;
  //   }

  //   const token = await executeRecaptcha('yourAction');
  //   // Do whatever you want with the token
  // }, [executeRecaptcha]);

  // // You can use useEffect to trigger the verification as soon as the component being loaded
  // useEffect(() => {
  //   handleReCaptchaVerify();
  // }, [handleReCaptchaVerify]);


  return (
    
    <div className="signup">
      <div className="linkbar">
        <Link key={'LinkToSignIn'} href={'login'}>Sign In</Link>
      </div>
      <div className="page-title">Sign Up</div>
      <form id="sign-up-form" onSubmit={handleFormSubmition}>
        <div className="container">
          <div className="signup-inputs">
            <label htmlFor="email" className="signup-line">email: </label>   
          </div>
          <div className="signup-inputs">
            <input className={`signup-line ${emailErr ? "input-error" : ""}`} name="email" placeholder="my@mail.com" id="email" onChange={handleInput(setEmail)} />
          </div>
          <div className="signup-inputs">
            {commonErr ? <div className="sign-up-err signup-line">{commonErr}</div> : ""}
          </div>
          <div className="signup-inputs">
            {emailErr ? <div className="sign-up-err signup-line">{emailErr}</div> : ""}
          </div>
          <div className="signup-inputs">
            <label htmlFor="password" className="signup-line" >password: </label>
          </div>
          <div className="signup-inputs">
            <div className={`pass-strength signup-line strength${strongPass}`}>
              {strongPass === 0 ? null : <div 
                className = {`signup-line signup-line-content`}
                >{strongPass < 3 ? "weak" : strongPass === 3 ? "medium" : "strong"}
                </div>
              }
            </div>
          </div>
          <div className="signup-inputs">
            <input name="password" type="password" id="password" className={`signup-line ${passMatchErr || passWeakErr ? "input-error" : ""}`} placeholder="secret" onChange={setPass} />
          </div>
          <div className="signup-inputs">
            <label htmlFor="re-password" className="signup-line" >re-password: </label>
          </div>
          <div className="signup-inputs">
            {passWeakErr ? <div className="sign-up-err signup-line">{passWeakErr}</div> : ""}
          </div>
          <div className="signup-inputs">
            <input name="repassword" type="password" id="repassword" className={`signup-line ${passMatchErr ? "input-error" : ""}`} placeholder="match secret" onChange={handleInput(setRepassword)} />
          </div>
          <div className="signup-inputs">
            {passMatchErr ? <div className="sign-up-err signup-line">{passMatchErr}</div> : ""}
          </div>

          <div className="signup-inputs">
            <input  id = "submit-signup" type="submit" value="Submit" className="signup-line" />
          </div>

          <div className="signup-inputs">
            <div className="privacy-documents">
              By signing up you agree to the Terms of Service and Privacy Policy
            </div>
          </div>
        </div>
        </form>
      <div className="recaptcha">
        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}
