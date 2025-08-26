import Captcha from "@/components/credentials/Captcha";

import ResetPassForm from '@/components/credentials/ResetPassForm';

export default function ResetPasswordPage() {

  return (
    <Captcha>
      <ResetPassForm />
    </Captcha>
  );
  
}
