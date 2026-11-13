
import { supabase } from '@/lib/supabase'
import type {
  Bus,
  BusWithTrip,
  GpsLocation,
  RouteSummary,
  Trip,
} from '../types'

function getLocalDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

export const routesService = {
  // Lấy danh sách xe
  async getBuses(): Promise<Bus[]> {
    const { data, error } = await supabase
      .from('buses')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []) as Bus[]
  },

  // Lấy tuyến đường và các điểm dừng
  async getRoutes(): Promise<RouteSummary[]> {
    const { data, error } = await supabase
      .from('routes')
      .select(`
        *,
        route_stops (*)
      `)
      .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []).map((item: any) => {
      const stops = [...(item.route_stops ?? [])]
        .sort((a, b) => a.stop_order - b.stop_order)

      return {
        ...item,
        route_stops: stops,
        stops,
        busCount: 0,
        activeBusCount: 0,
      }
    }) as RouteSummary[]
  },

  // Lấy chuyến xe cùng xe, tuyến, tài xế, giáo viên và GPS
  async getTrips(date?: string): Promise<Trip[]> {
    const tripDate = date ?? getLocalDate()

    const { data, error } = await supabase
      .from('trips')
      .select(`
        *,
        buses (*),
        routes (
          *,
          route_stops (*)
        ),
        drivers (
          *,
          users (*)
        ),
        teachers (
          *,
          users (*)
        ),
        gps_locations (*)
      `)
      .eq('trip_date', tripDate)
      .order('start_at', { ascending: true })

    if (error) throw error

    return (data ?? []).map((trip: any) => ({
      ...trip,
      gps_locations: [...(trip.gps_locations ?? [])].sort(
        (a, b) =>
          new Date(b.recorded_at).getTime() -
          new Date(a.recorded_at).getTime(),
      ),
      routes: trip.routes
        ? {
            ...trip.routes,
            route_stops: [...(trip.routes.route_stops ?? [])].sort(
              (a, b) => a.stop_order - b.stop_order,
            ),
          }
        : null,
    })) as Trip[]
  },

  // Lấy GPS gần nhất của các chuyến trong ngày
  async getGpsLocations(date?: string): Promise<GpsLocation[]> {
    const tripDate = date ?? getLocalDate()

    const { data, error } = await supabase
      .from('gps_locations')
      .select(`
        *,
        trips!inner (
          trip_id,
          trip_date
        )
      `)
      .eq('trips.trip_date', tripDate)
      .order('recorded_at', { ascending: false })
      .limit(200)

    if (error) throw error

    return (data ?? []) as unknown as GpsLocation[]
  },

  // Kết hợp xe với chuyến, tài xế và giáo viên
  buildBuses(
    buses: Bus[],
    trips: Trip[],
  ): BusWithTrip[] {
    return buses.map((bus) => {
      const busTrips = trips.filter(
        (trip) => trip.bus_id === bus.bus_id,
      )

      const currentTrip =
        busTrips.find((trip) => trip.status === 'IN_PROGRESS') ??
        busTrips.find((trip) => trip.status === 'SCHEDULED') ??
        busTrips[0] ??
        null

      const gps = currentTrip?.gps_locations ?? []

      return {
        ...bus,
        currentTrip,
        driverName:
          currentTrip?.drivers?.users?.full_name ?? 'Chưa phân công',
        teacherName:
          currentTrip?.teachers?.users?.full_name ?? 'Chưa phân công',
        routeName:
          currentTrip?.routes?.route_name ?? 'Chưa có tuyến',
        latestGps: gps[0] ?? null,
      }
    })
  },

  // Tổng hợp số lượng xe theo tuyến
  buildRoutes(
    routes: RouteSummary[],
    buses: BusWithTrip[],
  ): RouteSummary[] {
    return routes.map((route) => {
      const routeBuses = buses.filter(
        (bus) =>
          bus.currentTrip?.route_id === route.route_id,
      )

      return {
        ...route,
        busCount: routeBuses.length,
        activeBusCount: routeBuses.filter(
          (bus) => bus.currentTrip?.status === 'IN_PROGRESS',
        ).length,
      }
    })
  },
}

export async function getLatestVehicleLocations() {
  const { data, error } = await supabase
    .from('gps_locations')
    .select(`
      gps_id,
      trip_id,
      latitude,
      longitude,
      speed,
      heading,
      accuracy,
      recorded_at,
      trips!inner (
        trip_id,
        status,
        bus_id,
        buses (
          bus_code,
          license_plate
        )
      )
    `)
    .order('recorded_at', { ascending: false })
    .limit(100)

  if (error) {
    console.error('Lỗi lấy vị trí xe:', error)
    throw error
  }

  return data ?? []
}

