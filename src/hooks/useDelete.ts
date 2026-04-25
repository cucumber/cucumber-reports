import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'

export function useDelete(id: string) {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  return useMutation({
    mutationFn: async (): Promise<void> => {
      const response = await fetch(`/api/reports/${id}`, {
        method: 'DELETE',
      })
      if (!response.ok) {
        throw new Error('Failed to delete report', { cause: response })
      }
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ['envelopes', id], refetchType: 'none' })
      navigate('/?deleted=true')
    },
  })
}
