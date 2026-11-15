import { useMemo, useState } from 'react'
import { useCreateStudent, useParents } from '../hooks/useStudents'
import type { Gender, Relationship } from '../types'
import { Modal } from './Modal'

const inputCls =
  'mt-1 h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-blue-500'
const labelCls = 'block text-sm text-slate-600'

const REL_LABEL: Record<Relationship, string> = {
  FATHER: 'Bố',
  MOTHER: 'Mẹ',
  GUARDIAN: 'Người giám hộ',
  OTHER: 'Khác',
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase().trim()

const todayLocal = () => {
  const d = new Date()
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
  return d.toISOString().slice(0, 10)
}

export function AddStudentDialog({ onClose }: { onClose: () => void }) {
  const { data: parents = [], isLoading: loadingParents } = useParents(true)
  const create = useCreateStudent()

  const [fullName, setFullName] = useState('')
  const [dob, setDob] = useState('')
  const [gender, setGender] = useState<Gender | ''>('')
  const [className, setClassName] = useState('')
  const [code, setCode] = useState('')
  const [parentId, setParentId] = useState('')
  const [relationship, setRelationship] = useState<Relationship>('FATHER')
  const [q, setQ] = useState('')

  const list = useMemo(() => {
    const k = norm(q)
    return parents
      .filter(
        (p) =>
          !k || norm(p.name).includes(k) || p.phone.includes(q.trim()) || norm(p.email).includes(k),
      )
      .slice(0, 30)
  }, [parents, q])

  const canSubmit = fullName.trim() !== '' && dob !== '' && !create.isPending

  const submit = () =>
    create.mutate(
      {
        fullName,
        dateOfBirth: dob,
        gender,
        className,
        studentCode: code,
        parentId,
        relationship,
      },
      { onSuccess: onClose },
    )

  return (
    <Modal title="Thêm học sinh" onClose={onClose}>
      <div className="space-y-3">
        <label className={labelCls}>
          Họ và tên *
          <input className={inputCls} value={fullName} onChange={(e) => setFullName(e.target.value)} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            Ngày sinh *
            <input
              type="date"
              className={inputCls}
              value={dob}
              max={todayLocal()}
              onChange={(e) => setDob(e.target.value)}
            />
          </label>
          <label className={labelCls}>
            Giới tính
            <select className={inputCls} value={gender} onChange={(e) => setGender(e.target.value as Gender | '')}>
              <option value="">Chưa chọn</option>
              <option value="MALE">Nam</option>
              <option value="FEMALE">Nữ</option>
              <option value="OTHER">Khác</option>
            </select>
          </label>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <label className={labelCls}>
            Lớp
            <input
              className={inputCls}
              placeholder="Ví dụ 3A"
              value={className}
              onChange={(e) => setClassName(e.target.value)}
            />
          </label>
          <label className={labelCls}>
            Mã học sinh
            <input
              className={inputCls}
              placeholder="Để trống = tự sinh"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
        </div>

        <div>
          <div className="text-sm text-slate-600">Phụ huynh (không bắt buộc)</div>
          <input
            className={inputCls}
            placeholder="Tìm theo tên, số điện thoại, email..."
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
          <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-200">
            {loadingParents && <p className="p-3 text-sm text-slate-400">Đang tải...</p>}
            {!loadingParents && list.length === 0 && (
              <p className="p-3 text-sm text-slate-400">Không tìm thấy phụ huynh</p>
            )}
            {list.map((p) => (
              <button
                key={p.parentId}
                type="button"
                onClick={() => setParentId(parentId === p.parentId ? '' : p.parentId)}
                className={`flex w-full flex-col items-start border-b border-slate-100 px-3 py-2 text-left last:border-0 hover:bg-slate-50 ${
                  parentId === p.parentId ? 'bg-blue-50' : ''
                }`}
              >
                <span className="text-sm font-semibold text-[#0F172A]">
                  {p.name}
                  {p.childrenCount > 0 && (
                    <span className="ml-2 text-xs font-normal text-slate-400">
                      đã có {p.childrenCount} con
                    </span>
                  )}
                </span>
                <span className="text-xs text-slate-400">
                  {[p.phone, p.email].filter(Boolean).join(' · ') || '—'}
                </span>
              </button>
            ))}
          </div>
          <p className="mt-1 text-xs text-slate-400">
            {parentId ? 'Bấm lần nữa để bỏ chọn.' : 'Chưa chọn: có thể để phụ huynh tự đăng ký con trong ứng dụng.'}
          </p>
        </div>

        {parentId && (
          <label className={labelCls}>
            Quan hệ với học sinh
            <select
              className={inputCls}
              value={relationship}
              onChange={(e) => setRelationship(e.target.value as Relationship)}
            >
              {(Object.keys(REL_LABEL) as Relationship[]).map((r) => (
                <option key={r} value={r}>{REL_LABEL[r]}</option>
              ))}
            </select>
          </label>
        )}
      </div>

      {create.error && (
        <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-600">
          {(create.error as Error).message}
        </p>
      )}

      <div className="mt-4 flex justify-end gap-2">
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
          onClick={submit}
          className="h-10 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {create.isPending ? 'Đang lưu...' : 'Thêm học sinh'}
        </button>
      </div>
    </Modal>
  )
}