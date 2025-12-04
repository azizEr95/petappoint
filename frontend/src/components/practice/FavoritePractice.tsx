import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import '../../styles/components/practice/FavoritePractice.scss'
import {
  addFavoritesVeterinaryPractices,
  deleteFavoritesVeterinaryPractices,
  getFavoritesVeterinaryPractices,
} from '../../api/VeterinaryPracticeAPI'
import { useLoginContext } from '../../LoginContext'
import type { VeterinaryPracticesType } from '../../../../shared/schemas/ZodSchemas'

type FavoritePracticeProps = {
  practice: VeterinaryPracticesType
}

export function FavoritePractice({ practice }: FavoritePracticeProps) {
  const { login } = useLoginContext()
  const queryClient = useQueryClient()
  const [isFavorit, setIsFavorit] = useState(false)

  if (!login) {
    return
  }

  const userId = login.id // to be changed if token is available
  const { isSuccess: isSuccessFavoritPractice, data: dataFavoritPractice } =
    useQuery<Array<number>>({
      queryKey: ['favoritVeterinaryPractices', userId],
      queryFn: () => getFavoritesVeterinaryPractices(userId.toString()),
    })

  const { mutate: mutateAddFavorit } = useMutation({
    mutationFn: () =>
      addFavoritesVeterinaryPractices(
        userId.toString(),
        practice.id.toString(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favoritVeterinaryPractices'],
      })
    },
  })

  const { mutate: mutateDeleteFavorit } = useMutation({
    mutationFn: () =>
      deleteFavoritesVeterinaryPractices(
        userId.toString(),
        practice.id.toString(),
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['favoritVeterinaryPractices'],
      })
    },
  })

  useEffect(() => {
    if (isSuccessFavoritPractice) {
      const favorit = dataFavoritPractice.find((id) => {
        return id === practice.id
      })

      if (favorit !== undefined) {
        setIsFavorit(true)
      } else {
        setIsFavorit(false)
      }
    }
  }, [dataFavoritPractice])

  const handleDeleteFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    mutateDeleteFavorit()
  }

  const handleAddFavorit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    mutateAddFavorit()
  }

  if (isFavorit) {
    return (
      <i
        id="isFavorit"
        className="bi bi-heart-fill favorit red"
        onClick={handleDeleteFavorit}
      ></i>
    )
  } else {
    return (
      <i
        id="isNotFavorit"
        className="bi bi-heart favorit"
        onClick={handleAddFavorit}
      ></i>
    )
  }
}
