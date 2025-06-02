"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Asset } from '@/types/database'
import { Button } from '@/components/ui/Button'
import Loading from '@/components/ui/Loading'
import { User } from '@supabase/supabase-js'

export default function AssetListPage() {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Get current user
    fetch('/api/auth')
      .then(res => res.json())
      .then(data => {
        setUser(data.user)
      })
      .catch(console.error)

    // Get assets
    const fetchAssets = async () => {
      try {
        const { data, error } = await supabase
          .from('assets')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setAssets(data || [])
      } catch (error) {
        console.error('Error fetching assets:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAssets()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">ทรัพย์สิน</h1>
        {user && (
          <Link href="/assets/new">
            <Button>เพิ่มทรัพย์สิน</Button>
          </Link>
        )}
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ชื่อทรัพย์สิน</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">เจ้าของ</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ที่อยู่</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">แผนที่</th>
                {user && <th className="px-4 py-2" />}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {assets.map((asset) => (
                <tr key={asset.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{asset.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{asset.owner_id}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{asset.address}</td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    <a href={asset.map_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">ดูแผนที่</a>
                  </td>
                  {user && (
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <Link href={`/assets/${asset.id}/edit`}><Button size="sm">แก้ไข</Button></Link>
                      <Button size="sm" variant="destructive">ลบ</Button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
} 