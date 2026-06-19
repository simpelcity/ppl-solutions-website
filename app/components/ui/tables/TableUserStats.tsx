'use client'

import { useUserStats } from '@/hooks/useUserStats'
import { Table, Placeholder } from 'react-bootstrap'
import { RateLimitError } from '@/components'
import type { Dictionary } from "@/app/i18n"
import { useTheme } from 'next-themes'

type Props = {
  dict: Dictionary;
  isLoading: boolean;
}

type Unit = "km" | "mi" | "thp" | "lb" | "ton" | "euro" | "dollar" | "thorn";

export default function TableUserStats({ dict, isLoading }: Props) {
  const { stats, loading, error, isRateLimited, rateLimitSecondsRemaining, retryStats } = useUserStats(dict);

  const { resolvedTheme } = useTheme();

  const currencySymbols: Partial<Record<Unit, string>> = {
    euro: "€",
    dollar: "$",
    thorn: "Ŧ",
  };

  const typeLabels: Partial<Record<Unit, string>> = {
    km: "km",
    mi: "mi",
    thp: "THP",
    lb: "lbs",
    ton: "t",
  };

  function formatValue(value: number, unit: Unit): string {
    const icon = currencySymbols[unit] ?? "";
    const type = typeLabels[unit] ?? "";

    const rounded = Math.round(value * 10) / 10;

    let formatted: string;

    if (rounded >= 1_000_000) {
      formatted = `${(rounded / 1_000_000).toLocaleString(undefined, {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      })}M`;
    } else {
      formatted = rounded.toLocaleString(undefined, {
        minimumFractionDigits: Number.isInteger(rounded) ? 0 : 1,
        maximumFractionDigits: 1,
      });
    }

    return `${icon}${formatted}${type ? ` ${type}` : ""}`;
  }

  if (error) {
    if (isRateLimited) {
      return <RateLimitError dict={dict} secondsRemaining={rateLimitSecondsRemaining ?? 0} onRetry={retryStats} retryLoading={isLoading} />;
    }

    return <div className="text-danger text-center fw-bold fs-4">{dict.errors.GENERAL_ERROR}: {error}</div>
  }

  const numberWithCommas = (x: number) => {
    return x.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
  }

  const rounded = (value: any) => {
    return value.toFixed(0);
  }

  const tableItems = [
    { title: dict.drivershub.userStats.table.thead.stats },
    { title: dict.drivershub.userStats.table.thead.ets2 },
    { title: dict.drivershub.userStats.table.thead.ats },
    { title: dict.drivershub.userStats.table.thead.combined },
  ];

  return (
    <>
      <div className="table-card-scroll">
        <Table variant={resolvedTheme} className="table-stats" borderless>
          <thead>
            {isLoading ? (
              <tr id="table-stats-placeholder">
                {[5, 10, 10, 5].map((width, c) => (
                  <Placeholder key={c} as="th" animation="glow" className="bg-primary text-start px-4">
                    <Placeholder xs={width} className="rounded-1 bg-light" />
                  </Placeholder>
                ))}
              </tr>
            ) : (
              <tr>
                {tableItems.map((item) => (
                  <th key={item.title} className="bg-primary text-start text-light px-4">
                    {item.title}
                  </th>
                ))}
              </tr>
            )}
          </thead>

          {isLoading ? (
            <tbody>
              {Array.from({ length: 18 }).map((_, r) => (
                <tr key={r}>
                  {Array.from({ length: 1 }).map((__, c) => (
                    <td key={c} className="text-start px-4">
                      <Placeholder as="div" animation="glow" className="py-2">
                        <Placeholder xs={10} className="rounded-1" />
                      </Placeholder>
                    </td>
                  ))}
                  {[10, 2, 8].map((w, c) => (
                    <td key={c}>
                      <Placeholder as="div" animation="glow" className="border rounded-1 py-2">
                        <Placeholder xs={w} className="rounded-1" />
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
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.jobsDelivered}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{numberWithCommas(Number(stats?.ets2.jobs ?? 0))}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{numberWithCommas(Number(stats?.ats.jobs ?? 0))}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{numberWithCommas(Number(stats?.total.jobs ?? 0))}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.weightTransported}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(Math.floor((stats?.ets2.mass ?? 0) / 1000)), "ton")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(Math.floor((stats?.ats.mass ?? 0) / 1000)), "lb")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(Math.floor((stats?.total.mass ?? 0) / 1000)), "ton")}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.avgDistance}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(rounded(stats?.ets2.distance.avg ?? 0)), "km")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(rounded(stats?.ats.distance.avg ?? 0)), "mi")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(rounded(stats?.total.distance.avg ?? 0)), "km")}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.longestJob}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.ets2.distance.max), "km") ?? 0}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.ats.distance.max), "mi") ?? 0}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.total.distance.max), "km") ?? 0}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.totalDistance}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.ets2.distance.distance ?? 0), "km")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.ats.distance.distance ?? 0), "mi")}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{formatValue(Number(stats?.total.distance.distance ?? 0), "km")}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favTrucks}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.truck ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.truck ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.truck ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favCargo}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.cargo ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.cargo ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.cargo ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favStartCity}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.source?.city ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.source?.city ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.source?.city ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favStartCompany}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.source?.company ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.source?.company ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.source?.company ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favEndCity}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.destination?.city ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.destination?.city ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.destination?.city ?? "- (0)"}</div>
                </td>
              </tr>
              <tr>
                <td className="text-start px-4">
                  <div className="py-2">{dict.drivershub.userStats.table.tbody.favEndCompany}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ets2.destination?.company ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.ats.destination?.company ?? "- (0)"}</div>
                </td>
                <td>
                  <div className="border rounded-1 py-2">{stats?.total.destination?.company ?? "- (0)"}</div>
                </td>
              </tr>
            </tbody>
          )}
        </Table>
      </div>
    </>
  )
}
