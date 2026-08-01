import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { APIKey, NewAPIKey } from '@/types'

interface KeyItemRaw {
  id: string
  name: string
  last_used?: string | null
  created_at: string
}

function mapKey(k: KeyItemRaw): APIKey {
  return {
    id:          k.id,
    name:        k.name,
    maskedKey:   'vl_live_••••••••••••••••',
    environment: 'live',
    lastUsed:    k.last_used ?? null,
    createdAt:   k.created_at,
  }
}

export function useAPIKeys() {
  return useQuery<APIKey[], Error>({
    queryKey: ['api-keys'],
    queryFn: () =>
      api
        .get<{ keys: KeyItemRaw[] }>('/api/keys')
        .then((r) => (r.data.keys ?? []).map(mapKey)),
    staleTime: 60_000,
    retry: 2,
  })
}

export function useCreateAPIKey() {
  const queryClient = useQueryClient()
  return useMutation<NewAPIKey, Error, { name: string }>({
    mutationFn: (data) =>
      api.post<{ key: string; id: string; name: string; created_at: string }>('/api/keys', data).then((r) => ({
        id:          r.data.id,
        name:        r.data.name,
        maskedKey:   'vl_live_••••••••••••••••',
        environment: 'live' as const,
        lastUsed:    null,
        createdAt:   r.data.created_at,
        fullKey:     r.data.key,
      })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}

export function useRevokeAPIKey() {
  const queryClient = useQueryClient()
  return useMutation<void, Error, string>({
    mutationFn: (id) => api.delete(`/api/keys/${id}`).then(() => undefined),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-keys'] })
    },
  })
}
