"use client";

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { AssetOwner } from '@/types/database'
import { Button } from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'

interface Props {
  mode: 'create' | 'edit'
  ownerId?: string
}

export default function OwnerFormPage({ mode, ownerId }: Props) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<Partial<AssetOwner>>({})

  useEffect(() => {
    if (mode === 'edit' && ownerId) {
      supabase.from('asset_owners').select('*').eq('id', ownerId).single().then(({ data }) => {
        setForm(data || {})
        setLoading(false)
      })
    } else {
      setLoading(false)
    }
  }, [mode, ownerId])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    if (mode === 'create') {
      await supabase.from('asset_owners').insert([{ ...form }])
    } else if (mode === 'edit' && ownerId) {
      await supabase.from('asset_owners').update({ ...form }).eq('id', ownerId)
    }
    setLoading(false)
    router.push('/owners')
  }

  if (loading) return <Loading />

  return (
    <form className="max-w-xl mx-auto space-y-6" onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ชื่อ</label>
        <input name="name" value={form.name || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">อีเมล</label>
        <input name="email" value={form.email || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">เบอร์โทร</label>
        <input name="phone" value={form.phone || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">ที่อยู่</label>
        <textarea name="address" value={form.address || ''} onChange={handleChange} required className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="submit" isLoading={loading}>{mode === 'create' ? 'บันทึก' : 'อัปเดต'}</Button>
      </div>
    </form>
  )
} 