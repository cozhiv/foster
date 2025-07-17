import LoginForm from "@/components/credentials/LoginForm";
import Captcha from "@/components/credentials/Captcha";

export default function Login() {
  

  return (
    <Captcha>
      <LoginForm />
    </Captcha>
  );
}

// import { getCsrfToken } from "next-auth/react";

// export default function SignIn({ csrfToken }: any) {
//   return (
//     <form method="post" action="/api/auth/signin/email">
//       <input name="csrfToken" type="hidden" defaultValue={csrfToken} />
//       <label>Email:</label>
//       <input type="email" name="email" />
//       <button type="submit">Sign in with Email</button>
//     </form>
//   );
// }

// export async function getServerSideProps(context: any) {
//   return {
//     props: {
//       csrfToken: await getCsrfToken(context),
//     },
//   };
// }

