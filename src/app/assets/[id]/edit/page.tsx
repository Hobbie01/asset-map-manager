import AssetFormPage from '@/components/assets/AssetFormPage'

export default function Page({
  params,
}: {
  params: { id: string };
}) {
  return <AssetFormPage mode="edit" assetId={params.id} />
} 