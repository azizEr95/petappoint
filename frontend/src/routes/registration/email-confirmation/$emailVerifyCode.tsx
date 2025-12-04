import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { verifyEmail } from '../../../api/LoginAPI'
import { useLoginContext } from '../../../LoginContext'
import type { LoginType } from '../../../../../shared/schemas/ZodSchemas'

export const Route = createFileRoute(
  '/registration/email-confirmation/$emailVerifyCode',
)({
  component: RouteComponent,
})

function RouteComponent() {
  const {setLogin} = useLoginContext();
  const navigate = useNavigate();
  const {emailVerifyCode} = Route.useParams();


  // get all Animaltypes
  const { isError: isErrorVerifyEmail, isSuccess: isSuccessVerifyEmail, isPending: isPendingVerifyEmail, data: dataVerifyEmail } = useQuery<
    LoginType | false
  >({
    queryKey: ['loginVerifyEmail', emailVerifyCode],
    queryFn: () => verifyEmail(emailVerifyCode),
    retry: false,
  })

  if(isPendingVerifyEmail){
    return <div>Verifiziere deine Email...</div>;
  }

  if(isSuccessVerifyEmail){
    setLogin(dataVerifyEmail);
    navigate({to: '/dashboard'});
  }

  if(isErrorVerifyEmail){
    return <div>Fehler beim verifizeiren</div>;
  }


}
