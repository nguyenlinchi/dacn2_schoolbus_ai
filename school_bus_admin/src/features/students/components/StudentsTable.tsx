import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { Bus, MoreVertical, Plus, Search, Trash2 } from 'lucide-react'
import type { FaceStatus, StudentRow } from '../types'

const PAGE_SIZE = 8

const avatarPalette = [
  'bg-blue-100 text-blue-700',
  'bg-amber-100 text-amber-700',
  'bg-emerald-100 text-emerald-700',
  'bg-rose-100 text-rose-700',
]

function getInitials(fullName: string): string {
  const parts = fullName.trim().split(/\s+/)
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[parts.length - 2][0] + parts[parts.length - 1][0]).toUpperCase()
}

const paletteOf = (name: string) =>
  avatarPalette[[...name].reduce((a, c) => a + c.charCodeAt(0), 0) % avatarPalette.length]

const FACE_BADGE: Record<FaceStatus, { text: string; cls: string }> = {
  REGISTERED: { text: 'Đã đăng ký', cls: 'bg-emerald-100 text-emerald-700' },
  NEEDS_UPDATE: { text: 'Cần cập nhật', cls: 'bg-amber-100 text-amber-700' },
  NONE: { text: 'Chưa đăng ký', cls: 'bg-rose-100 text-rose-700' },
}

const selectCls =
  'h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none focus:border-blue-500'

interface Props {
  rows: StudentRow[]
  isLoading: boolean
  selectedId: string | null
  onSelect: (s: StudentRow) => void
  onAddStudent: () => void
  onRemove: (s: StudentRow) => void
  onAssignRoute: (s: StudentRow) => void
  
}

export function StudentsTable({
  rows,
  isLoading,
  selectedId,
  onSelect,
  onAddStudent,
  onRemove,
  onAssignRoute,
}: Props) {
  const [search, setSearch] = useState('')
  const [cls, setCls] = useState('')
  const [route, setRoute] = useState('')
  const [face, setFace] = useState<FaceStatus | ''>('')
  const [page, setPage] = useState(1)
  const [menu, setMenu] = useState<{ student: StudentRow; top: number; left: number } | null>(null)

  // Có học sinh mới lên đầu danh sách thì tự về trang 1 để thấy ngay
  const newestId = rows[0]?.id
  useEffect(() => {
    setPage(1)
  }, [newestId])

  const classes = useMemo(
    () => [...new Set(rows.map((r) => r.className))].filter(Boolean).sort(),
    [rows],
  )
  const routes = useMemo(
    () => [...new Set(rows.map((r) => r.routeCode))].filter((r) => r !== '—').sort(),
    [rows],
  )

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return rows.filter(
      (r) =>
        (!q ||
          r.fullName.toLowerCase().includes(q) ||
          r.code.toLowerCase().includes(q) ||
          r.parentName.toLowerCase().includes(q)) &&
        (!cls || r.className === cls) &&
        (!route || (route === 'NONE' ? r.routeCode === '—' : r.routeCode === route)) &&
        (!face || r.faceStatus === face),
    )
  }, [rows, search, cls, route, face])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, pageCount)
  const pageRows = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : (safePage - 1) * PAGE_SIZE + 1
  const to = Math.min(safePage * PAGE_SIZE, filtered.length)

  const change = (fn: () => void) => {
    fn()
    setPage(1)
  }

  const openMenu = (e: MouseEvent<HTMLButtonElement>, student: StudentRow) => {
    e.stopPropagation()
    const r = e.currentTarget.getBoundingClientRect()
    setMenu(
      menu?.student.id === student.id
        ? null
        : { student, top: r.bottom + 4, left: r.right - 208 },
    )
  }

  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-base font-bold text-[#0F172A]">
          Danh sách học sinh · {filtered.length} em
        </h2>

        <div className="flex flex-wrap items-center gap-2">
          <label className="flex h-9 items-center gap-2 rounded-xl border border-slate-200 px-3">
            <Search className="size-4 text-slate-400" />
            <input
              value={search}
              onChange={(e) => change(() => setSearch(e.target.value))}
              placeholder="Tìm tên, mã, phụ huynh..."
              className="w-44 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <select className={selectCls} value={cls} onChange={(e) => change(() => setCls(e.target.value))}>
            <option value="">Tất cả lớp</option>
            {classes.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>

          <select className={selectCls} value={route} onChange={(e) => change(() => setRoute(e.target.value))}>
            <option value="">Tất cả tuyến</option>
            <option value="NONE">Chưa gán tuyến</option>
            {routes.map((r) => <option key={r} value={r}>Tuyến {r}</option>)}
          </select>

          <select
            className={selectCls}
            value={face}
            onChange={(e) => change(() => setFace(e.target.value as FaceStatus | ''))}
          >
            <option value="">Khuôn mặt: Tất cả</option>
            <option value="REGISTERED">Đã đăng ký</option>
            <option value="NEEDS_UPDATE">Cần cập nhật</option>
            <option value="NONE">Chưa đăng ký</option>
          </select>

          <button
            type="button"
            onClick={onAddStudent}
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            <Plus className="size-4" /> Thêm học sinh
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-xs text-slate-400">
              <th className="py-2 font-medium">Học sinh</th>
              <th className="py-2 font-medium">Phụ huynh</th>
              <th className="py-2 font-medium">Tuyến</th>
              <th className="py-2 font-medium">Điểm đón</th>
              <th className="py-2 font-medium">Khuôn mặt</th>
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {pageRows.map((s) => {
              const badge = FACE_BADGE[s.faceStatus]
              return (
                <tr
                  key={s.id}
                  onClick={() => onSelect(s)}
                  className={`cursor-pointer border-t border-slate-100 hover:bg-slate-50 ${
                    selectedId === s.id ? 'bg-blue-50/60' : ''
                  }`}
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      {s.avatarUrl ? (
                        <img src={s.avatarUrl} alt="" className="size-9 rounded-full object-cover" />
                      ) : (
                        <span className={`grid size-9 place-items-center rounded-full text-xs font-bold ${paletteOf(s.fullName)}`}>
                          {getInitials(s.fullName)}
                        </span>
                      )}
                      <div className="leading-tight">
                        <div className="font-semibold text-[#0F172A]">{s.fullName}</div>
                        <div className="text-xs text-slate-400">Lớp {s.className || '—'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 leading-tight">
                    {s.hasParent ? (
                      <>
                        <div className="text-slate-700">{s.parentName}</div>
                        <div className="text-xs text-slate-400">{s.parentPhone}</div>
                      </>
                    ) : (
                      <span className="text-xs font-semibold text-rose-500">Chưa có phụ huynh</span>
                    )}
                  </td>
                  <td className="py-3 text-slate-700">
                    {s.routeCode === '—' ? (
                      <span className="text-xs font-semibold text-amber-600">Chưa gán tuyến</span>
                    ) : (
                      s.routeCode
                    )}
                  </td>
                  <td className="py-3 text-slate-700">{s.pickupStop}</td>
                  <td className="py-3">
                    <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${badge.cls}`}>
                      {badge.text}
                    </span>
                  </td>
                  <td className="py-3">
                    <button
                      type="button"
                      title="Thao tác"
                      onClick={(e) => openMenu(e, s)}
                      className="grid size-8 place-items-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                    >
                      <MoreVertical className="size-4" />
                    </button>
                  </td>
                </tr>
              )
            })}
            {!isLoading && pageRows.length === 0 && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">
                  Không có học sinh phù hợp
                </td>
              </tr>
            )}
            {isLoading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-slate-400">Đang tải...</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
        <span>Hiển thị {from}–{to} trên {filtered.length} học sinh</span>
        <div className="flex items-center gap-2">
          <button
            disabled={safePage <= 1}
            onClick={() => setPage(safePage - 1)}
            className="h-8 rounded-lg border border-slate-200 px-3 font-medium text-slate-600 disabled:opacity-40"
          >
            Trước
          </button>
          <span className="grid h-8 min-w-8 place-items-center rounded-lg bg-[#2563EB] px-2 font-semibold text-white">
            {safePage}
          </span>
          <button
            disabled={safePage >= pageCount}
            onClick={() => setPage(safePage + 1)}
            className="h-8 rounded-lg border border-slate-200 px-3 font-medium text-slate-600 disabled:opacity-40"
          >
            Sau
          </button>
        </div>
      </div>

      {/* Menu ba chấm: vị trí fixed để không bị bảng cắt */}
      {menu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setMenu(null)} />
          <div
            className="fixed z-50 w-52 rounded-xl border border-slate-200 bg-white p-1 shadow-lg"
            style={{ top: menu.top, left: Math.max(8, menu.left) }}
          >
            <button
              type="button"
              onClick={() => {
                const s = menu.student
                setMenu(null)
                onAssignRoute(s)
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <Bus className="size-4 text-slate-400" />
              Gán tuyến &amp; điểm đón
            </button>
            <button
              type="button"
              onClick={() => {
                const s = menu.student
                setMenu(null)
                onRemove(s)
              }}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-rose-600 hover:bg-rose-50"
            >
              <Trash2 className="size-4" />
              Xóa học sinh
            </button>
          </div>
        </>
      )}
    </section>
  )
}