import { supabase } from '@/lib/supabase'
import type {
  AssignRouteInput,
  ChildRequest,
  CurrentAssignment,
  FaceStatus,
  NewStudentInput,
  ParentOption,
  RemoveResult,
  RouteOption,
  StudentRow,
} from '../types'

const REQUIRED_ANGLES = 3 // nhìn thẳng, quay trái, quay phải

interface LinkRow {
  student_id: string
  parent_id: string
  relationship: string
  verification_status: string
  parent_name: string | null
  parent_phone: string | null
  parent_email: string | null
  student_code: string | null
  student_name: string | null
  date_of_birth: string | null
  gender: string | null
  class_name: string | null
  student_status: string | null
}

const first = <T,>(x: T | T[] | null | undefined): T | undefined =>
  Array.isArray(x) ? x[0] : (x ?? undefined)

function maskPhone(p?: string | null): string {
  if (!p) return '—'
  const d = p.replace(/\D/g, '')
  return d.length < 6 ? p : `${d.slice(0, 2)}•• ••• ${d.slice(-3)}`
}

function faceStatusOf(valid: number, total: number): FaceStatus {
  if (valid >= REQUIRED_ANGLES) return 'REGISTERED'
  if (total > 0) return 'NEEDS_UPDATE'
  return 'NONE'
}

async function fetchLinks(): Promise<LinkRow[]> {
  const { data, error } = await supabase.rpc('admin_parent_links')
  if (error) throw new Error(error.message)
  return (data ?? []) as LinkRow[]
}

const ERROR_TEXT: Record<string, string> = {
  NOT_ALLOWED: 'Bạn không có quyền thực hiện thao tác này',
  INVALID_NAME: 'Họ tên không hợp lệ (không được để trống, tối đa 150 ký tự)',
  INVALID_DOB: 'Ngày sinh không hợp lệ',
  INVALID_GENDER: 'Giới tính không hợp lệ',
  INVALID_CLASS: 'Tên lớp quá dài (tối đa 50 ký tự)',
  INVALID_CODE: 'Mã học sinh chỉ gồm chữ, số và dấu . _ - (tối đa 30 ký tự)',
  CODE_EXISTS: 'Mã học sinh này đã tồn tại',
  DUPLICATE_STUDENT:
    'Đã có học sinh trùng tên và ngày sinh (có thể đang chờ duyệt ở tab "Yêu cầu chờ duyệt")',
  PARENT_NOT_FOUND: 'Không tìm thấy phụ huynh đã chọn',
  INVALID_RELATIONSHIP: 'Quan hệ với học sinh không hợp lệ',
  STUDENT_NOT_FOUND: 'Không tìm thấy học sinh (có thể đã bị xóa)',
    DATE_IN_PAST: 'Ngày hiệu lực không được ở quá khứ',
  STUDENT_NOT_ACTIVE: 'Học sinh chưa được duyệt hoặc đã ngừng hoạt động',
  ROUTE_NOT_AVAILABLE: 'Tuyến không còn hoạt động hoặc không tồn tại',
  SAME_STOP: 'Điểm đón và điểm trả phải khác nhau',
  STOP_NOT_IN_ROUTE: 'Điểm đón hoặc điểm trả không thuộc tuyến đã chọn',
}

function friendlyError(message: string): string {
  for (const [code, text] of Object.entries(ERROR_TEXT)) {
    if (message.includes(code)) return text
  }
  return message
}

export const studentService = {
  /** Danh sách học sinh đang hoạt động. Phụ huynh chỉ tính khi đã được duyệt (APPROVED). */
  async getStudents(): Promise<StudentRow[]> {
    const [studentsRes, routeLinksRes, routesRes, links, faceRes] = await Promise.all([
      supabase
        .from('students')
        .select('student_id, student_code, full_name, class_name, avatar_url')
        .eq('status', 'ACTIVE')
        .order('created_at', { ascending: false }) // mới tạo lên đầu
        .order('full_name'), // cùng thời điểm thì xếp theo tên

      supabase
        .from('student_routes')
        .select(`
          student_id,
          route_id,
          pickup_stop:route_stops!student_routes_route_id_pickup_stop_id_fkey ( stop_name )
        `)
        .eq('status', 'ACTIVE'),

      supabase.from('routes').select('route_id, route_code'),
      fetchLinks(),
      supabase.rpc('admin_face_summary'),
    ])

    for (const res of [studentsRes, routeLinksRes, routesRes, faceRes]) {
      if (res.error) throw new Error(res.error.message)
    }

    const routeCodeById = new Map(
      (routesRes.data ?? []).map((r) => [r.route_id as string, r.route_code as string]),
    )

    const routeByStudent = new Map<string, { code: string; stop: string }>()
    for (const l of routeLinksRes.data ?? []) {
      if (routeByStudent.has(l.student_id)) continue
      const stop = first(l.pickup_stop as { stop_name: string } | { stop_name: string }[] | null)
      routeByStudent.set(l.student_id, {
        code: routeCodeById.get(l.route_id) ?? '—',
        stop: stop?.stop_name ?? '—',
      })
    }

    const parentByStudent = new Map<string, { name: string; phone: string }>()
    for (const l of links) {
      if (l.verification_status !== 'APPROVED' || parentByStudent.has(l.student_id)) continue
      parentByStudent.set(l.student_id, {
        name: l.parent_name ?? '—',
        phone: l.parent_phone ?? '',
      })
    }

    const faceByStudent = new Map(
      ((faceRes.data ?? []) as { student_id: string; valid_count: number; total_count: number }[])
        .map((f) => [f.student_id, f]),
    )

    return (studentsRes.data ?? []).map((s): StudentRow => {
      const face = faceByStudent.get(s.student_id)
      const route = routeByStudent.get(s.student_id)
      const parent = parentByStudent.get(s.student_id)
      return {
        id: s.student_id,
        code: s.student_code ?? '',
        fullName: s.full_name ?? '',
        className: s.class_name ?? '',
        avatarUrl: s.avatar_url ?? null,
        parentName: parent?.name ?? '—',
        parentPhone: maskPhone(parent?.phone),
        hasParent: !!parent,
        routeCode: route?.code ?? '—',
        pickupStop: route?.stop ?? '—',
        faceStatus: faceStatusOf(face?.valid_count ?? 0, face?.total_count ?? 0),
        faceCount: face?.valid_count ?? 0,
      }
    })
  },

  /** Các đăng ký đang chờ nhà trường duyệt. */
  async getChildRequests(): Promise<ChildRequest[]> {
    const links = await fetchLinks()
    return links
      .filter((l) => l.verification_status === 'PENDING')
      .map((l): ChildRequest => ({
        studentId: l.student_id,
        parentId: l.parent_id,
        studentCode: l.student_code ?? '',
        fullName: l.student_name ?? '',
        dateOfBirth: l.date_of_birth,
        gender: l.gender,
        className: l.class_name ?? '',
        relationship: l.relationship,
        parentName: l.parent_name ?? '—',
        parentPhone: l.parent_phone ?? '',
        parentEmail: l.parent_email ?? '',
      }))
  },
    /** Tuyến đang hoạt động kèm điểm dừng, để chọn khi gán học sinh. */
  async getRouteOptions(): Promise<RouteOption[]> {
    const [routesRes, stopsRes, countRes] = await Promise.all([
      supabase.from('routes').select('route_id, route_code, route_name').eq('status', 'ACTIVE').order('route_code'),
      supabase.from('route_stops').select('stop_id, route_id, stop_name, stop_order').eq('is_active', true).order('stop_order'),
      supabase.from('student_routes').select('route_id').eq('status', 'ACTIVE'),
    ])
    for (const res of [routesRes, stopsRes, countRes]) {
      if (res.error) throw new Error(friendlyError(res.error.message))
    }

    const countByRoute = new Map<string, number>()
    for (const r of countRes.data ?? []) {
      countByRoute.set(r.route_id, (countByRoute.get(r.route_id) ?? 0) + 1)
    }
    const stopsByRoute = new Map<string, RouteOption['stops']>()
    for (const s of stopsRes.data ?? []) {
      const list = stopsByRoute.get(s.route_id) ?? []
      list.push({ stopId: s.stop_id, name: s.stop_name, order: s.stop_order })
      stopsByRoute.set(s.route_id, list)
    }

    return (routesRes.data ?? []).map((r) => ({
      routeId: r.route_id,
      code: r.route_code,
      name: r.route_name,
      studentCount: countByRoute.get(r.route_id) ?? 0,
      stops: stopsByRoute.get(r.route_id) ?? [],
    }))
  },

  async getCurrentAssignment(studentId: string): Promise<CurrentAssignment | null> {
    const { data, error } = await supabase
      .from('student_routes')
      .select('route_id, pickup_stop_id, dropoff_stop_id, effective_from')
      .eq('student_id', studentId)
      .eq('status', 'ACTIVE')
      .order('effective_from', { ascending: false })
      .limit(1)
      .maybeSingle()
    if (error) throw new Error(friendlyError(error.message))
    if (!data) return null
    return {
      routeId: data.route_id,
      pickupStopId: data.pickup_stop_id,
      dropoffStopId: data.dropoff_stop_id,
      effectiveFrom: data.effective_from,
    }
  },

  async assignRoute(i: AssignRouteInput) {
    const { error } = await supabase.rpc('admin_assign_student_route', {
      p_student_id: i.studentId,
      p_route_id: i.routeId,
      p_pickup_stop_id: i.pickupStopId,
      p_dropoff_stop_id: i.dropoffStopId,
      p_effective_from: i.effectiveFrom || null,
    })
    if (error) throw new Error(friendlyError(error.message))
  },

  async unassignRoute(studentId: string) {
    const { error } = await supabase.rpc('admin_unassign_student_route', {
      p_student_id: studentId,
    })
    if (error) throw new Error(friendlyError(error.message))
  },

  async reviewRequest(p: {
    studentId: string
    parentId: string
    approve: boolean
    mergeIntoId?: string
    note?: string
  }) {
    const { error } = await supabase.rpc('admin_review_child_link', {
      p_student_id: p.studentId,
      p_parent_id: p.parentId,
      p_approve: p.approve,
      p_merge_into: p.mergeIntoId ?? null,
      p_note: p.note ?? null,
    })
    if (error) throw new Error(error.message)
  },
  /** Danh sách phụ huynh để chọn khi thêm học sinh. */
  async getParents(): Promise<ParentOption[]> {
    const { data, error } = await supabase.rpc('admin_list_parents')
    if (error) throw new Error(friendlyError(error.message))
    return (
      (data ?? []) as {
        parent_id: string
        full_name: string | null
        phone: string | null
        email: string | null
        children_count: number
      }[]
    ).map((p) => ({
      parentId: p.parent_id,
      name: p.full_name ?? '—',
      phone: p.phone ?? '',
      email: p.email ?? '',
      childrenCount: p.children_count,
    }))
  },

  async createStudent(i: NewStudentInput): Promise<string> {
    const { data, error } = await supabase.rpc('admin_create_student', {
      p_full_name: i.fullName.trim(),
      p_date_of_birth: i.dateOfBirth,
      p_gender: i.gender || null,
      p_class_name: i.className.trim() || null,
      p_student_code: i.studentCode.trim() || null,
      p_parent_id: i.parentId || null,
      p_relationship: i.relationship,
    })
    if (error) throw new Error(friendlyError(error.message))
    return data as string
  },

  /** DELETED = xóa hẳn (chưa có lịch sử); DEACTIVATED = ngừng hoạt động (giữ lịch sử). */
  async removeStudent(studentId: string): Promise<RemoveResult> {
    const { data, error } = await supabase.rpc('admin_remove_student', {
      p_student_id: studentId,
    })
    if (error) throw new Error(friendlyError(error.message))
    return data as RemoveResult
  },
}