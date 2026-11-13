import { useState } from 'react'
import {
  Bus,
  Route as RouteIcon,
  MapPin,
  Search,
  RefreshCw,
  Clock3,
  Users,
  Navigation,
  AlertCircle,
  MapPinned,
  Plus,
  MoreVertical,
  Zap,
} from 'lucide-react'

import { useRoutes } from './hooks/useRoutes'
import type { BusWithTrip } from './types'
import { AddTripModal } from './components/AddTripModal'

import './RoutesPage.css'

function statusLabel(status: string) {
  const labels: Record<string, string> = {
    ACTIVE: 'Đang chạy',
    MAINTENANCE: 'Bảo dưỡng',
    INACTIVE: 'Ngừng hoạt động',
    SCHEDULED: 'Chờ khởi hành',
    IN_PROGRESS: 'Đang chạy',
    COMPLETED: 'Hoàn thành',
    CANCELLED: 'Đã hủy',
    WARNING: 'Cảnh báo',
    DELAYED: 'Trễ giờ',
  }
  return labels[status] ?? status
}

function StatusBadge({ status }: { status: string }) {
  const statusKey = status.toLowerCase()
  return (
    <span className={`routes-status routes-status-${statusKey}`}>
      <span />
      {statusLabel(status)}
    </span>
  )
}

function VehicleRow({ bus }: { bus: BusWithTrip }) {
  return (
    <tr>
      <td>
        <div className="routes-vehicle-cell">
          <div>
            <strong>{bus.license_plate}</strong>
          </div>
        </div>
      </td>
      <td>{bus.capacity} chỗ</td>
      <td>{bus.driverName || 'Chưa phân công'}</td>
      <td>{bus.teacherName || 'Chưa phân công'}</td>
      <td>
        <span className="routes-route-name">
          {bus.routeName || '—'}
        </span>
      </td>
      <td>
        <StatusBadge status={bus.currentTrip?.status ?? bus.status} />
      </td>
      <td style={{ textAlign: 'right' }}>
        <button type="button" className="routes-action-btn" aria-label="Thêm tùy chọn">
          <MoreVertical size={16} />
        </button>
      </td>
    </tr>
  )
}

export function RoutesPage() {
  const {
    buses,
    routes,
    trips,
    filteredBuses,
    search,
    setSearch,
    selectedRoute,
    setSelectedRoute,
    loading,
    refreshing,
    error,
    reload,
  } = useRoutes()

  const [showAddTrip, setShowAddTrip] = useState(false)

  // Lấy tuyến đang được chọn để hiển thị ở phần chi tiết dưới
  const currentRouteDetails = routes.find(r => r.route_id === selectedRoute) || routes[0]

  if (loading) {
    return (
      <div className="routes-loading">
        <div className="routes-spinner" />
        <p>Đang tải dữ liệu từ Supabase...</p>
      </div>
    )
  }

  return (
    <div className="routes-page">
      {/* HEADER */}
      <header className="routes-header">
        <div>
          <h1>Xe &amp; tuyến đường</h1>
          <p>15 xe · 6 tuyến · Tự bố trí điểm dừng của học sinh</p>
        </div>

        <div className="routes-header-actions">
          <button
            type="button"
            className="routes-add-trip"
            onClick={() => setShowAddTrip(true)}
          >
            <Plus size={17} />
            Thêm xe
          </button>

          <button
            type="button"
            className="routes-refresh"
            onClick={() => void reload()}
            disabled={refreshing}
          >
            <RefreshCw size={16} className={refreshing ? 'routes-spin-icon' : ''} />
            Làm mới
          </button>
        </div>
      </header>

      {error && (
        <div className="routes-error">
          <AlertCircle size={18} />
          <span>{error}</span>
          <button type="button" onClick={() => void reload()}>Thử lại</button>
        </div>
      )}

      {/* DANH SÁCH ĐỘI XE (BẢNG CHÍNH) */}
      <section className="routes-panel">
        <div className="routes-panel-heading">
          <div>
            <h2>Đội xe · {buses.length} xe</h2>
          </div>

          <label className="routes-search">
            <Search size={16} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Tìm học sinh, xe, tuyến..."
            />
          </label>
        </div>

        <div className="routes-table-wrap">
          <table className="routes-table">
            <thead>
              <tr>
                <th>Biển số</th>
                <th>Số chỗ</th>
                <th>Tài xế</th>
                <th>Cô giáo</th>
                <th>Tuyến hôm nay</th>
                <th>Trạng thái</th>
                <th style={{ textAlign: 'right' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredBuses.map((bus) => (
                <VehicleRow key={bus.bus_id} bus={bus} />
              ))}
              {filteredBuses.length === 0 && (
                <tr>
                  <td colSpan={7} className="routes-empty">
                    Không có phương tiện phù hợp.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* PHẦN DƯỚI: CHIA 2 CỘT (CHI TIẾT TUYẾN & BẢN ĐỒ LỘ TRÌNH) */}
      <div className="routes-content-grid-split">
        {/* CỘT TRÁI: CHI TIẾT TUYẾN & ĐIỂM DỪNG */}
        <section className="routes-panel">
          <div className="routes-panel-heading" style={{ alignItems: 'flex-start' }}>
            <div>
              <h2>{currentRouteDetails ? `${currentRouteDetails.route_name} · Đón sáng` : 'Chi tiết tuyến'}</h2>
            </div>
            <button type="button" className="routes-optimize-btn">
              <Zap size={14} /> Tối ưu lộ trình
            </button>
          </div>

          {/* THANH CHỌN NHANH CÁC TUYẾN */}
          <div className="routes-filter" style={{ marginBottom: '16px' }}>
            {routes.map((route) => (
              <button
                type="button"
                key={route.route_id}
                className={selectedRoute === route.route_id || (!selectedRoute && route === routes[0]) ? 'active' : ''}
                onClick={() => setSelectedRoute(route.route_id)}
              >
                {route.route_name}
              </button>
            ))}
          </div>

          {/* DANH SÁCH CÁC ĐIỂM DỪNG (STOPS) */}
          <div className="routes-stop-list">
            {currentRouteDetails?.stops?.map((stop, index) => (
              <div className="routes-stop-item-styled" key={stop.stop_id || index}>
                <div className="routes-stop-number-badge">{index + 1}</div>
                <div className="routes-stop-content">
                  <strong>{stop.stop_name}</strong>
                  <small>{stop.estimated_time ? stop.estimated_time.slice(0, 5) : '07:12'}</small>
                </div>
                <div className="routes-stop-tag info">
                  {index === 0 ? '6 học sinh' : index === 1 ? 'Nghị - bỏ qua' : index === 2 ? '7 học sinh' : index === 3 ? '4 học sinh' : 'Điểm đến'}
                </div>
              </div>
            ))}

            {(!currentRouteDetails || !currentRouteDetails.stops || currentRouteDetails.stops.length === 0) && (
              <div className="routes-stop-item-styled">
                <div className="routes-stop-number-badge">1</div>
                <div className="routes-stop-content">
                  <strong>12 Lê Duẩn</strong>
                  <small>07:12</small>
                </div>
                <div className="routes-stop-tag info">6 học sinh</div>
              </div>
            )}
          </div>
        </section>

        {/* CỘT PHẢI: BẢN ĐỒ LỘ TRÌNH ĐÃ TỐI ƯU */}
        <section className="routes-panel routes-map-panel-right">
          <div className="routes-panel-heading">
            <div>
              <h2>Lộ trình đã tối ưu</h2>
            </div>
            <span className="routes-map-meta-badge">Tiết kiệm 4 phút · 1,2 km</span>
          </div>

          <div className="routes-map-container-mock">
            {/* Mô phỏng giao diện bản đồ tuyến đường giống Figma */}
            <div className="routes-map-graphic">
              <div className="map-line-path" />
              <div className="map-bus-marker-pin" style={{ top: '45%', left: '55%' }}>
                <Bus size={14} /> <span>43B-123.45</span>
              </div>
              <div className="map-stop-node school" style={{ top: '25%', right: '20%' }}>Trường</div>
              <div className="map-stop-node point-a" style={{ bottom: '25%', right: '30%' }} />
              <div className="map-stop-node point-b" style={{ top: '65%', left: '30%' }} />
            </div>
          </div>
        </section>
      </div>

      {/* MODAL THÊM XE/CHUYẾN */}
      {showAddTrip && (
        <AddTripModal
          onClose={() => setShowAddTrip(false)}
          onSuccess={reload}
        />
      )}
    </div>
  )
}

export default RoutesPage