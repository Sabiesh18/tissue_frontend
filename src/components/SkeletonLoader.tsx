import React from 'react';

/**
 * Modern pulsing skeleton loader component matching the soft pink theme
 */
export const Skeleton: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`animate-pulse bg-[#FFF0F5] border border-[#F8B4D0]/40 rounded-xl ${className}`} />
);

/**
 * Reusable Skeleton Loader for Tables (Assets, Vendors, Customers, Orders, Inventory)
 */
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 6,
}) => (
  <div className="bg-white rounded-2xl shadow-md border border-[#F8B4D0] overflow-hidden">
    {/* Table Header Skeleton */}
    <div className="bg-[#FFF5F8] border-b border-[#F8B4D0] p-4 flex items-center justify-between gap-4">
      <Skeleton className="h-5 w-48" />
      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-lg" />
        <Skeleton className="h-8 w-24 rounded-lg" />
      </div>
    </div>

    {/* Table Body Rows Skeleton */}
    <div className="divide-y divide-gray-100">
      {Array.from({ length: rows }).map((_, rIdx) => (
        <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4 max-w-xs" />
            <Skeleton className="h-3 w-1/3 max-w-[120px]" />
          </div>
          {Array.from({ length: columns - 2 }).map((_, cIdx) => (
            <div key={cIdx} className="hidden sm:block flex-1 max-w-[140px]">
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
          <div className="w-16 flex justify-end">
            <Skeleton className="h-6 w-12 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

/**
 * Reusable Skeleton Loader for Dashboard (Circular Gauges, Cards & Charts)
 */
export const DashboardSkeleton: React.FC = () => (
  <div className="space-y-6">
    {/* Top Header Banner Skeleton */}
    <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#F8B4D0] flex flex-col md:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Skeleton className="w-14 h-14 rounded-2xl flex-shrink-0" />
        <div className="space-y-2 w-full md:w-80">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="flex gap-3">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-28 rounded-2xl" />
      </div>
    </div>

    {/* 4 Circular KPI Pods Skeleton */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-3xl p-6 shadow-xl border border-[#F8B4D0] flex items-center justify-between"
        >
          <div className="space-y-2 flex-1">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-8 w-28" />
            <Skeleton className="h-3 w-32" />
          </div>
          <Skeleton className="w-16 h-16 rounded-full flex-shrink-0" />
        </div>
      ))}
    </div>

    {/* Graphical Chart & Donut Skeletons */}
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white rounded-3xl p-6 shadow-xl border border-[#F8B4D0] space-y-4">
        <div className="flex justify-between items-center">
          <div className="space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-3 w-28" />
          </div>
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2">
          {Array.from({ length: 7 }).map((_, bIdx) => (
            <div key={bIdx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <Skeleton className={`w-full max-w-[44px] rounded-2xl ${bIdx % 2 === 0 ? 'h-3/4' : 'h-1/2'}`} />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-3xl p-6 shadow-xl border border-[#F8B4D0] flex flex-col items-center justify-center p-6 space-y-4">
        <Skeleton className="h-5 w-36 self-start" />
        <Skeleton className="w-40 h-40 rounded-full my-3" />
        <div className="w-full space-y-2">
          <Skeleton className="h-10 w-full rounded-2xl" />
          <Skeleton className="h-10 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  </div>
);
