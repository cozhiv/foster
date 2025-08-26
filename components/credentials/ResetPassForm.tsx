import { useRouter } from 'next/router';
import { useState } from 'react';
import Link from 'next/link';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';


export default function ForgetPassForm () {
  const router = useRouter();
  const { token } = router.query;
  const [password, setPassword] = useState('');
  const [done, setDone] = useState(false);


  const [repassword, setRepassword] = useState("")
  const [commonErr, setCommonErr] = useState("");
  const [emailErr, setEmailErr] = useState("")
  const [passMatchErr, setPassMatchErr] = useState("");
  const [passWeakErr, setPassWeakErr] = useState("");
  const [strongPass, setStrongPass] = useState(0)

  const { executeRecaptcha } = useGoogleReCaptcha();


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

    if (password === repassword && password !== "") {
      if (strongPass === 4) {

        // await fetch('/api/auth/resetpass', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ token, password }),
        // });
        setDone(true);
        const res: Response = await fetch("/api/auth/resetpass", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password, captchaToken }),
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
  };








  const handleSubmition = async (e: any) => {
    e.preventDefault();

    if (!executeRecaptcha) {
      setCommonErr('Execute recaptcha not yet available');
      return;
    }
    await fetch('/api/auth/resetpass', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, password }),
    });
    setDone(true);
  };

  if (!token) return <p>Missing token</p>;
  return done ? (
    <p>Password updated. You can now log in.</p>
  ) : (
    <div className="signup">
      <div className="linkbar">
        <Link key={'LinkToSignIn'} href={'login'}>Sign In</Link>
      </div>
      <form onSubmit={handleFormSubmition}>

        <div className="page-title">Forgot Pass</div>
        {/* <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button type="submit">Reset Password</button> */}



        <div className="container">
          <div className="signup-inputs">
            {commonErr ? <div className="sign-up-err signup-line">{commonErr}</div> : ""}
          </div>
          <div className="signup-inputs">
            <label htmlFor="password" className="signup-line" >password: </label>
          </div>
          <div className="signup-inputs">
            <div className={`pass-strength signup-line strength${strongPass}`}>
              {strongPass === 0 ? null : <div
                className={`signup-line signup-line-content`}
              >{strongPass < 3 ? "weak" : strongPass === 3 ? "medium" : "strong"}
              </div>
              }
            </div>
          </div>
          <div className="signup-inputs">
            <input
              name="password"
              type="password"
              id="password"
              className={`signup-line ${passMatchErr || passWeakErr ? "input-error" : ""}`}
              placeholder="new password"
              onChange={setPass} />
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
            <input id="submit-signup" type="submit" value="Submit" className="signup-line" />
          </div>
        </div>
      </form>
    </div>



  );
}