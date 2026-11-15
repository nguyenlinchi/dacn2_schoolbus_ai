import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { AlertCircle, Save, X } from 'lucide-react'

import {
  getTripFormOptions,
  updateTripStaff,
  type TripFormOptions,
} from '../services/tripService'
import type { Trip } from '../types'

import './AddTripModal.css'

interface Props {
  trip: Trip
  onClose: () => void
  onSuccess: () => void | Promise<void>
}

export function EditTripStaffModal({ trip, onClose, onSuccess }: Props) {
  const [options, setOptions] = useState<TripFormOptions>({
    buses: [],
    routes: [],
    drivers: [],
    teachers: [],
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const [busId, setBusId] = useState(trip.bus_id)
  const [driverId, setDriverId] = useState(trip.driver_id)
  const [teacherId, setTeacherId] = useState(trip.teacher_id)

  useEffect(() => {
    let cancelled = false
    getTripFormOptions()
      .then((r) => {
        if (!cancelled) setOptions(r)
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : 'Không thể tải dữ liệu.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (saving) return
    setError('')
    try {
      setSaving(true)
      await updateTripStaff({ tripId: trip.trip_id, busId, driverId, teacherId })
      await onSuccess()
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Có lỗi xảy ra khi lưu.')
    } finally {
      setSaving(false)
    }
  }

  const sessionLabel = trip.trip_type === 'MORNING' ? 'Buổi sáng' : 'Buổi chiều'
  const dateLabel = trip.trip_date.split('-').reverse().join('/')

  return (
    <div
      className="add-trip-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !saving) onClose()
      }}
    >
      <section className="add-trip-modal" role="dialog" aria-modal="true">
        <header className="add-trip-header">
          <div>
            <h2>Phân công chuyến xe</h2>
            <p>
              {trip.routes?.route_name ?? 'Tuyến'} · {sessionLabel} · {dateLabel}
            </p>
          </div>
          <button type="button" className="add-trip-close" onClick={onClose} disabled={saving} aria-label="Đóng">
            <X size={19} />
          </button>
        </header>

        {loading ? (
          <div className="add-trip-loading">
            <span className="add-trip-spinner" />
            <p>Đang tải dữ liệu...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="add-trip-grid">
              <div className="add-trip-field">
                <label htmlFor="edit-bus">Phương tiện *</label>
                <select id="edit-bus" value={busId} onChange={(e) => setBusId(e.target.value)} required>
                  {!options.buses.some((b) => b.bus_id === busId) && (
                    <option value={busId}>{trip.buses?.license_plate ?? 'Xe hiện tại'}</option>
                  )}
                  {options.buses.map((b) => (
                    <option key={b.bus_id} value={b.bus_id}>
                      {b.license_plate} ({b.bus_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-trip-field">
                <label htmlFor="edit-driver">Tài xế *</label>
                <select id="edit-driver" value={driverId} onChange={(e) => setDriverId(e.target.value)} required>
                  {options.drivers.map((d) => (
                    <option key={d.driver_id} value={d.driver_id}>
                      {d.full_name} ({d.driver_code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="add-trip-field">
                <label htmlFor="edit-teacher">Giáo viên *</label>
                <select id="edit-teacher" value={teacherId} onChange={(e) => setTeacherId(e.target.value)} required>
                  {options.teachers.map((t) => (
                    <option key={t.teacher_id} value={t.teacher_id}>
                      {t.full_name} ({t.teacher_code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <div className="add-trip-error">
                <AlertCircle size={17} />
                <span>{error}</span>
              </div>
            )}

            <footer className="add-trip-actions">
              <button type="button" className="add-trip-cancel" onClick={onClose} disabled={saving}>
                Hủy
              </button>
              <button type="submit" className="add-trip-submit" disabled={saving}>
                <Save size={17} />
                {saving ? 'Đang lưu...' : 'Lưu phân công'}
              </button>
            </footer>
          </form>
        )}
      </section>
    </div>
  )
}

export default EditTripStaffModal