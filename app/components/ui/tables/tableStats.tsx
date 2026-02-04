'use client'

import { useState } from 'react'
import { useUserStats } from '@/hooks/useUserStats'
import { Table, Placeholder } from 'react-bootstrap'
import { PlaceholderTable } from '@/components/'

export default function TableStats() {
  const { stats, loading, error } = useUserStats();

  if (error) return <div className="text-danger text-center py-3">{error}</div>

  console.log('stats in TableStats:', stats);

  const tableItems = [
    { title: 'Job Statistics' },
    { title: 'Euro Truck Simulator 2' },
    { title: 'American Truck Simulator' },
    { title: 'Combined' },
  ];

  return (
    <>
      <div className="table-card-scroll">
        <Table variant="dark" className="" borderless>
          <thead>
            <tr>
              {tableItems.map((item) => (
                <th key={item.title} className="bg-primary">
                  {item.title}
                </th>
              ))}
            </tr>
          </thead>

          {loading ? (
            <tbody>
              {Array.from({ length: 18 }).map((_, r) => (
                <tr key={r}>
                  {Array.from({ length: 4 }).map((__, c) => (
                    <td key={c} className="py-2">
                      <Placeholder as="span" animation="glow">
                        <Placeholder xs={12} />
                      </Placeholder>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody></tbody>
          )}
        </Table>
      </div>
    </>
  )
}
