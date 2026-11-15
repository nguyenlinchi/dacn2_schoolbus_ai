import { useEffect, useState } from 'react'
import {
  useAssignRoute,
  useCurrentAssignment,
  useRouteOptions,
  useUnassignRoute,
} from '../hooks/useStudents'
import type { StudentRow } from '../types'
import { Modal } from './Modal'

const inputCls =
  'mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500'
const labelCls = 'block text-sm text-slate-600'

const todayLocal = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function AssignRouteDialog({
  student,
  onClose,
}: {
  student: StudentRow
  onClose: () => void
}) {
  const { data: routes = [], isLoading } = useRouteOptions(true)
  const { data: current, isLoading: loadingCurrent } = useCurrentAssignment(student.id)
  const assign = useAssignRoute()
  const unassign = useUnassignRoute()

  const [routeId, setRouteId] = useState('')
  const [pickup, setPickup] = useState('')
  const [dropoff, setDropoff] = useState('')
  const [from, setFrom] = useState(todayLocal())

  // Điền sẵn phân tuyến hiện tại của em
  useEffect(() => {
    if (current) {
      setRouteId(current.routeId)
      setPickup(current.pickupStopId)
      setDropoff(current.dropoffStopId)
    }
  }, [current])

  const route = routes.find((r) => r.routeId === routeId)
  const stops = route?.stops ?? []
  const currentRoute = routes.find((r) => r.routeId === current?.routeId)

  const canSubmit =
    !!routeId && !!pickup && !!dropoff && pickup !== dropoff && !!from && !assign.isPending

  const changeRoute = (id: string) => {
    setRouteId(id)
    setPickup('')
    setDropoff('')
  }

  const error = (assign.error ?? unassign.error) as Error | null

  return (
    <Modal title="Gán tuyến xe và điểm đón" onClose={onClose}>
      <p className="text-sm text-slate-500">
        Học sinh: <b className="text-[#0F172A]">{student.fullName}</b> · Lớp {student.className || '—'}
      </p>

      {!loadingCurrent && (
        <p className="mt-2 rounded-lg bg-slate-50 p-2 text-xs text-slate-500">
          {current
            ? `Hiện đang thuộc tuyến ${currentRoute ? `${currentRoute.code} · ${currentRoute.name}` : '(không rõ)'}. Lưu để đổi sang tuyến hoặc điểm khác.`
            : 'Em chưa được gán tuyến nào.'}
        </p>
      )}

      <div className="mt-3 space-y-3">
        <label className={labelCls}>
          Tuyến *
          <select className={inputCls} value={routeId} onChange={(e) => changeRoute(e.target.value)} disabled={isLoading}>
            <option value="">{isLoading ? 'Đang tải...' : '-- Chọn tuyến --'}</option>
            {routes.map((r) => (
              <option key={r.routeId} value={r.routeId}>
                {r.code} · {r.name} ({r.studentCount} học sinh)
              </option>
            ))}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            Điểm đón *
            <select className={inputCls} value={pickup} onChange={(e) => setPickup(e.target.value)} disabled={!route}>
              <option value="">-- Chọn --</option>
              {stops.map((s) => (
                <option key={s.stopId} value={s.stopId}>
                  {s.order}. {s.name}
                </option>
              ))}
            </select>
          </label>
          <label className={labelCls}>
            Điểm trả *
            <select className={inputCls} value={dropoff} onChange={(e) => setDropoff(e.target.value)} disabled={!route}>
              <option value="">-- Chọn --</option>
              {stops.map((s) => (
                <option key={s.stopId} value={s.stopId}>
                  {s.order}. {s.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        {route && stops.length === 0 && (
          <p className="text-xs text-rose-500">Tuyến này chưa có điểm dừng nào đang hoạt động.</p>
        )}
        {pickup && pickup === dropoff && (
          <p className="text-xs text-rose-500">Điểm đón và điểm trả phải khác nhau.</p>
        )}

        <label className={labelCls}>
          Áp dụng từ ngày
          <input
            type="date"
            className={inputCls}
            value={from}
            min={todayLocal()}
            onChange={(e) => setFrom(e.target.value)}
          />
        </label>
      </div>

      {error && <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-600">{error.message}</p>}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
        {current ? (
          <button
            type="button"
            disabled={unassign.isPending}
            onClick={() => {
              if (confirm(`Gỡ ${student.fullName} khỏi tuyến hiện tại?`)) {
                unassign.mutate(student.id, { onSuccess: onClose })
              }
            }}
            className="h-10 rounded-xl border border-rose-200 px-4 text-sm font-semibold text-rose-600 hover:bg-rose-50 disabled:opacity-50"
          >
            Gỡ khỏi tuyến
          </button>
        ) : (
          <span />
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl border border-slate-200 px-4 text-sm font-semibold text-slate-700 hover:bg-slate-50"
          >
            Hủy
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            onClick={() =>
              assign.mutate(
                { studentId: student.id, routeId, pickupStopId: pickup, dropoffStopId: dropoff, effectiveFrom: from },
                { onSuccess: onClose },
              )
            }
            className="h-10 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {assign.isPending ? 'Đang lưu...' : 'Lưu phân tuyến'}
          </button>
        </div>
      </div>
    </Modal>
  )
}