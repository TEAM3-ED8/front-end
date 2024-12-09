import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchLetters, updateLetterStatus } from '@/services/navcards/navcards'
import { LetterList } from '@/components/letters/letterList'
import { LetterModal } from '@/components/letters/letterModal'
import { UnderlineTitle } from '@/components/global/underlineTitle'
import { LoadingScreen, ErrorScreen } from '@/components/global/santaDataLoader'

export const Letters = () => {
  const [selectedLetter, setSelectedLetter] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery({
    queryKey: ['letters'],
    queryFn: fetchLetters,
  })

  const updateLetterMutation = useMutation({
    mutationFn: updateLetterStatus,
    onSuccess: () => {
      queryClient.invalidateQueries(['letters'])
    },
  })

  const openLetter = async (letter) => {
    setSelectedLetter(letter);
    setIsModalOpen(true);
    if (!letter.isRead) {
      try {
        await updateLetterMutation.mutateAsync({ id: letter.id, isRead: true });
      } catch (error) {
        console.error("Error updating letter status:", error);
      }
    }
  };

  const toggleReadStatus = async (letter) => {
    try {
      await updateLetterMutation.mutateAsync({ id: letter.id, isRead: !letter.isRead });
    } catch (error) {
      console.error("Error toggling read status:", error);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (isLoading) return <LoadingScreen />;
  if (isError) return <ErrorScreen />;

  const letters = Array.isArray(data?.data) ? data.data : []

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl text-center font-bold text-red-600 mb-8">
        <UnderlineTitle text="Santa's Letters" />
      </h1>
      <LetterList 
        letters={letters}
        onOpenLetter={openLetter}
        onToggleReadStatus={toggleReadStatus}
      />
      <LetterModal
        isOpen={isModalOpen}
        onClose={closeModal}
        letter={selectedLetter}
      />
    </div>
  )
}

