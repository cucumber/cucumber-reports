import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useDelete(id: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (): Promise<void> => {
      await fetch(import.meta.env.VITE_MESSAGES_URL_TEMPLATE.replace('{id}', id), {
        method: 'DELETE',
      })
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['envelopes', id], refetchType: 'none' })
      navigate('/?deleted=true')
    },
  })
}
