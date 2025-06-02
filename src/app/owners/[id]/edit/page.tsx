import OwnerFormPage from '@/components/owners/OwnerFormPage'
export default function Page({ params }: { params: { id: string } }) {
  return <OwnerFormPage mode="edit" ownerId={params.id} />
} 