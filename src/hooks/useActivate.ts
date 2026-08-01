import { useQuery, useMutation } from '@tanstack/react-query'
import api from '@/lib/api'

interface DeviceActivationRaw {
  user_code: string
  expires_at: string
}

export interface DeviceActivation {
  userCode: string
  expiresAt: string
}

export function useDeviceActivation(userCode: string | null) {
  return useQuery<DeviceActivation, Error>({
    queryKey: ['device', 'activation', userCode],
    queryFn: () =>
      api
        .get<DeviceActivationRaw>('/auth/device/pending', { params: { user_code: userCode } })
        .then((r) => ({ userCode: r.data.user_code, expiresAt: r.data.expires_at })),
    enabled: !!userCode,
    retry: 1,
  })
}

export function useConfirmDevice() {
  return useMutation<{ success: boolean }, Error, { userCode: string; action: 'approve' | 'deny' }>({
    mutationFn: ({ userCode, action }) =>
      action === 'deny'
        ? Promise.resolve({ success: false })
        : api
            .post('/auth/device/confirm', { user_code: userCode })
            .then(() => ({ success: true })),
  })
}
