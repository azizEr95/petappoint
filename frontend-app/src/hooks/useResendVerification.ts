import { useMutation } from '@tanstack/react-query'
import { resendVerificationApi } from '@src/api/auth'

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerificationApi,
  })
}
