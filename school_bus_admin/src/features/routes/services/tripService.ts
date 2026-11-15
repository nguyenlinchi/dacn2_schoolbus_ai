
import { supabase } from '@/lib/supabase'

export type TripType = 'MORNING' | 'AFTERNOON'

export interface TripFormData {
  bus_id: string
  route_id: string
  driver_id: string
  teacher_id: string
  trip_date: string
  trip_type: TripType
  start_time: string // 'HH:MM', để trống = giờ mặc định (sáng 06:30-07:45, chiều 16:30-17:45)
  end_time: string
}

export interface TripFormOptions {
  buses: Array<{
    bus_id: string
    bus_code: string
    license_plate: string
  }>
  routes: Array<{
    route_id: string
    route_code: string
    route_name: string
  }>
  drivers: Array<{
    driver_id: string
    driver_code: string
    full_name: string
  }>
  teachers: Array<{
    teacher_id: string
    teacher_code: string
    full_name: string
  }>
}

type StaffRow = {
  driver_id?: string
  teacher_id?: string
  driver_code?: string
  teacher_code?: string
  users:
    | { full_name: string | null }
    | { full_name: string | null }[]
    | null
}

function getUserFullName(
  users: StaffRow['users'],
): string {
  if (Array.isArray(users)) {
    return users[0]?.full_name ?? ''
  }

  return users?.full_name ?? ''
}

export async function getTripFormOptions(): Promise<TripFormOptions> {
  const [
    busesResult,
    routesResult,
    driversResult,
    teachersResult,
  ] = await Promise.all([
    supabase
      .from('buses')
      .select('bus_id, bus_code, license_plate')
      .eq('status', 'ACTIVE')
      .order('bus_code'),

    supabase
      .from('routes')
      .select('route_id, route_code, route_name')
      .eq('status', 'ACTIVE')
      .order('route_name'),

    supabase
      .from('drivers')
      .select(`
        driver_id,
        driver_code,
        users (
          full_name
        )
      `)
      .order('driver_code'),

    supabase
      .from('teachers')
      .select(`
        teacher_id,
        teacher_code,
        users (
          full_name
        )
      `)
      .order('teacher_code'),
  ])

  if (busesResult.error) {
    throw new Error(`Không tải được danh sách xe: ${busesResult.error.message}`)
  }

  if (routesResult.error) {
    throw new Error(`Không tải được danh sách tuyến: ${routesResult.error.message}`)
  }

  if (driversResult.error) {
    throw new Error(`Không tải được danh sách tài xế: ${driversResult.error.message}`)
  }

  if (teachersResult.error) {
    throw new Error(`Không tải được danh sách giáo viên: ${teachersResult.error.message}`)
  }

  const drivers = (driversResult.data ?? []) as unknown as StaffRow[]
  const teachers = (teachersResult.data ?? []) as unknown as StaffRow[]

  return {
    buses: busesResult.data ?? [],
    routes: routesResult.data ?? [],

    drivers: drivers.map((item) => ({
      driver_id: item.driver_id!,
      driver_code: item.driver_code ?? '',
      full_name:
        getUserFullName(item.users) ||
        item.driver_code ||
        'Chưa có tên tài xế',
    })),

    teachers: teachers.map((item) => ({
      teacher_id: item.teacher_id!,
      teacher_code: item.teacher_code ?? '',
      full_name:
        getUserFullName(item.users) ||
        item.teacher_code ||
        'Chưa có tên giáo viên',
    })),
  }
}

const TRIP_ERRORS: Record<string, string> = {
  NOT_ALLOWED: 'Bạn không có quyền thực hiện thao tác này',
  INVALID_TRIP_TYPE: 'Buổi chạy không hợp lệ',
  DATE_IN_PAST: 'Không thể tạo chuyến cho ngày đã qua',
  BUS_NOT_AVAILABLE: 'Xe không còn hoạt động hoặc không tồn tại',
  ROUTE_NOT_AVAILABLE: 'Tuyến không còn hoạt động hoặc không tồn tại',
  DRIVER_NOT_FOUND: 'Không tìm thấy tài xế',
  TEACHER_NOT_FOUND: 'Không tìm thấy giáo viên',
  INVALID_TIME: 'Giờ kết thúc phải sau giờ khởi hành',
  BUS_BUSY: 'Xe này đã có chuyến trong cùng buổi và ngày đã chọn',
  DRIVER_BUSY: 'Tài xế này đã có chuyến trong cùng buổi và ngày đã chọn',
  TEACHER_BUSY: 'Giáo viên này đã có chuyến trong cùng buổi và ngày đã chọn',
  TRIP_NOT_FOUND: 'Không tìm thấy chuyến xe',
  TRIP_CLOSED: 'Chuyến đã hoàn thành hoặc đã hủy, không thể thay đổi',
}

function friendlyTripError(message: string): string {
  for (const [code, text] of Object.entries(TRIP_ERRORS)) {
    if (message.includes(code)) return text
  }
  return message
}

export async function createTrip(input: TripFormData): Promise<string> {
  if (!input.bus_id || !input.route_id || !input.driver_id || !input.teacher_id || !input.trip_date) {
    throw new Error('Vui lòng nhập đầy đủ thông tin chuyến xe.')
  }

  const { data, error } = await supabase.rpc('admin_create_trip', {
    p_bus_id: input.bus_id,
    p_route_id: input.route_id,
    p_driver_id: input.driver_id,
    p_teacher_id: input.teacher_id,
    p_trip_date: input.trip_date,
    p_trip_type: input.trip_type,
    p_start_time: input.start_time || null,
    p_end_time: input.end_time || null,
  })

  if (error) {
    console.error('Supabase createTrip error:', error)
    throw new Error(friendlyTripError(error.message))
  }
  return data as string
}

/** Đổi xe / tài xế / giáo viên của một chuyến chưa hoàn thành. */
export async function updateTripStaff(input: {
  tripId: string
  busId: string
  driverId: string
  teacherId: string
}) {
  const { error } = await supabase.rpc('admin_update_trip_staff', {
    p_trip_id: input.tripId,
    p_bus_id: input.busId,
    p_driver_id: input.driverId,
    p_teacher_id: input.teacherId,
  })
  if (error) throw new Error(friendlyTripError(error.message))
}
