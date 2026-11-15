import { useRemoveStudent } from '../hooks/useStudents'
import type { StudentRow } from '../types'
import { Modal } from './Modal'

export function RemoveStudentDialog({
  student,
  onClose,
}: {
  student: StudentRow
  onClose: () => void
}) {
  const remove = useRemoveStudent()

  if (remove.data) {
    return (
      <Modal title="Đã xóa học sinh" onClose={onClose}>
        <p className="text-sm text-slate-600">
          {remove.data === 'DELETED'
            ? `Đã xóa vĩnh viễn ${student.fullName} khỏi hệ thống (em chưa có lịch sử nào).`
            : `${student.fullName} đã ngừng hoạt động. Em không còn trong danh sách và các chuyến chưa chạy, lịch sử điểm danh cũ được giữ lại.`}
        </p>
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="h-10 rounded-xl bg-[#2563EB] px-4 text-sm font-semibold text-white hover:bg-blue-700"
          >
            Đóng
          </button>
        </div>
      </Modal>
    )
  }

  return (
    <Modal title="Xóa học sinh" onClose={onClose}>
      <p className="text-sm text-slate-600">
        Bạn có chắc muốn xóa <b className="text-[#0F172A]">{student.fullName}</b> (lớp{' '}
        {student.className || '—'})?
      </p>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-slate-500">
        <li>Dữ liệu khuôn mặt của em sẽ bị xóa vĩnh viễn.</li>
        <li>Em sẽ không còn trong danh sách, trên tuyến xe và các chuyến chưa chạy.</li>
        <li>Nếu em đã có lịch sử điểm danh, đơn nghỉ hoặc cảnh báo, các dữ liệu đó được giữ lại.</li>
      </ul>

      {remove.error && (
        <p className="mt-3 rounded-lg bg-rose-50 p-2 text-sm text-rose-600">
          {(remove.error as Error).message}
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
          disabled={remove.isPending}
          onClick={() => remove.mutate(student.id)}
          className="h-10 rounded-xl bg-rose-600 px-4 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {remove.isPending ? 'Đang xóa...' : 'Xóa học sinh'}
        </button>
      </div>
    </Modal>
  )
}