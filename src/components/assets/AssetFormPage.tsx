"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Asset, AssetOwner } from '@/types/database'
import { Button } from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

interface Props {
  mode: 'create' | 'edit'
  assetId?: string
}

export default function AssetFormPage({ mode, assetId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [owners, setOwners] = useState<AssetOwner[]>([])
  const [form, setForm] = useState<Partial<Asset>>({})
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const fetchOwners = async () => {
      const { data } = await supabase.from('owners').select('*').order('name')
      setOwners(data || [])
    }
    fetchOwners()
    if (mode === 'edit' && assetId) {
      supabase.from('assets').select('*').eq('id', assetId).single().then(({ data }) => {
        setForm(data || {})
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [mode, assetId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'create') {
        const { data, error } = await supabase.from('assets').insert([{ ...form }]).select()
        if (error) throw error
        if (data && data[0] && file) {
          // upload file to Supabase Storage
          await supabase.storage.from('asset-files').upload(`${data[0].id}/${file.name}`, file)
        }
      } else if (mode === 'edit' && assetId) {
        const { error } = await supabase.from('assets').update({ ...form }).eq('id', assetId)
        if (error) throw error
        if (file) {
          await supabase.storage.from('asset-files').upload(`${assetId}/${file.name}`, file)
        }
      }
      router.push('/assets')
    } catch (error) {
      console.error('Error saving asset:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <Loading />

  return (
    <form className="max-w-xl mx-auto space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ชื่อทรัพย์สิน</label>
        <input name="name" value={form.name || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">รายละเอียด</label>
        <textarea name="description" value={form.description || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ที่อยู่</label>
        <input name="address" value={form.address || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ลิงก์แผนที่ (Google Maps URL)</label>
        <input name="map_url" value={form.map_url || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">เจ้าของทรัพย์สิน</label>
        <select name="owner_id" value={form.owner_id || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
          <option value="">-- เลือกเจ้าของ --</option>
          {owners.map((owner) => (
            <option key={owner.id} value={owner.id}>{owner.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">แนบไฟล์ (ภาพถ่าย/เอกสาร)</label>
        <input type="file" onChange={e => setFile(e.target.files?.[0] || null)} className="mt-1 block w-full text-gray-900 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={loading}>{mode === 'create' ? 'บันทึก' : 'อัปเดต'}</Button>
      </div>
    </form>
  )
} 