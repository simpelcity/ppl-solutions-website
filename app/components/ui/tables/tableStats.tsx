'use client'

import { useState } from 'react'
import { useUserStats } from '@/hooks/useUserStats'
import { Table, Placeholder } from 'react-bootstrap'
import { PlaceholderTable } from '@/components/'

export default function TableStats() {
  const { stats, loading, error } = useUserStats();

  if (error) return <div className="text-danger text-center py-3">{error}</div>

  console.log('stats in TableStats:', stats);

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const tableItems = [
    { title: 'Job Statistics' },
    { title: 'Euro Truck Simulator 2' },
    { title: 'American Truck Simulator' },
    { title: 'Combined' },
  ];

  return (
    <>
      <div className="table-card-scroll">
        <Table variant="dark" className="table-stats" borderless>
          <thead>
            <tr>
              {tableItems.map((item) => (
                <th key={item.title} className="bg-primary text-start px-4">
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
            <tbody>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Jobs Delivered</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ets2.jobs ?? 0}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ats.jobs ?? 0}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.total.jobs ?? 0}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Mass Transported</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Average Delivery Distance</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Longest Job</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Total Distance</div>
                </td>
                <td>
                  <div className="border rounded py-2">{numberWithCommas(stats?.ets2.distance.distance ?? 0)} km</div>
                </td>
                <td>
                  <div className="border rounded py-2">{numberWithCommas(stats?.ats.distance.distance ?? 0)} mi</div>
                </td>
                <td>
                  <div className="border rounded py-2">{numberWithCommas(stats?.total.distance.distance ?? 0)} km</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Most Used Trucks</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ets2.truck ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ats.truck ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.total.truck ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Most Delivered Cargo</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ets2.cargo ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.ats.cargo ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded py-2">{stats?.total.cargo ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Favorite Start City</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Favorite Start Company</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Favorite Destination City</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">Favorite Destination Company</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
                <td>
                  <div className="border rounded py-2">{ }</div>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </>
  )
}
