"use client";

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { AssetOwner } from '@/types/database'
import { Button } from '@/components/ui/Button'
import { User } from '@supabase/supabase-js'
import Loading from '@/components/ui/Loading'

export default function OwnerListPage() {
  const [owners, setOwners] = useState<AssetOwner[]>([])
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

    // Get owners
    const fetchOwners = async () => {
      try {
        const { data, error } = await supabase
          .from('owners')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        setOwners(data || [])
      } catch (error) {
        console.error('Error fetching owners:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchOwners()
  }, [])

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">เจ้าของทรัพย์สิน</h1>
        {user && (
          <Link href="/owners/new">
            <Button>เพิ่มเจ้าของ</Button>
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
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ชื่อ</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">อีเมล</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">เบอร์โทร</th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">ที่อยู่</th>
                {user && <th className="px-4 py-2" />}
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td className="px-4 py-2 whitespace-nowrap">{owner.name}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{owner.email}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{owner.phone}</td>
                  <td className="px-4 py-2 whitespace-nowrap">{owner.address}</td>
                  {user && (
                    <td className="px-4 py-2 whitespace-nowrap flex gap-2">
                      <Link href={`/owners/${owner.id}/edit`}><Button size="sm">แก้ไข</Button></Link>
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