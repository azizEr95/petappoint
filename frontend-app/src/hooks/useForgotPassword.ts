import { useMutation } from '@tanstack/react-query'
import { forgotPasswordApi } from '@src/api/auth'

export function useForgotPassword() {
  return useMutation({ mutationFn: forgotPasswordApi })
}
