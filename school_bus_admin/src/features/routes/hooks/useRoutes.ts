
import { useCallback, useEffect, useMemo, useState } from 'react'
import { routesService } from '../services/routesService'
import type {
  BusWithTrip,
  GpsLocation,
  RouteSummary,
  Trip,
} from '../types'

export function useRoutes() {
  const [buses, setBuses] = useState<BusWithTrip[]>([])
  const [routes, setRoutes] = useState<RouteSummary[]>([])
  const [trips, setTrips] = useState<Trip[]>([])
  const [gpsLocations, setGpsLocations] = useState<GpsLocation[]>([])

  const [search, setSearch] = useState('')
  const [selectedRoute, setSelectedRoute] = useState('ALL')

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadData = useCallback(async (refresh = false) => {
    try {
      if (refresh) setRefreshing(true)
      else setLoading(true)

      setError(null)

      const [busData, routeData, tripData, gpsData] =
        await Promise.all([
          routesService.getBuses(),
          routesService.getRoutes(),
          routesService.getTrips(),
          routesService.getGpsLocations(),
        ])

      const mappedBuses = routesService.buildBuses(
        busData,
        tripData,
      )

      const mappedRoutes = routesService.buildRoutes(
        routeData,
        mappedBuses,
      )

      setBuses(mappedBuses)
      setRoutes(mappedRoutes)
      setTrips(tripData)
      setGpsLocations(gpsData)
    } catch (err) {
      console.error('Routes loading error:', err)

      setError(
        err instanceof Error
          ? err.message
          : 'Không thể tải dữ liệu từ cơ sở dữ liệu.',
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    void loadData()
  }, [loadData])

  const filteredBuses = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return buses.filter((bus) => {
      const matchesSearch =
        !keyword ||
        [
          bus.bus_code,
          bus.license_plate,
          bus.vehicle_model,
          bus.driverName,
          bus.teacherName,
          bus.routeName,
        ].some((value) =>
          String(value ?? '').toLowerCase().includes(keyword),
        )

      const matchesRoute =
        selectedRoute === 'ALL' ||
        bus.currentTrip?.route_id === selectedRoute

      return matchesSearch && matchesRoute
    })
  }, [buses, search, selectedRoute])

  const activeBuses = buses.filter(
    (bus) => bus.status === 'ACTIVE',
  ).length

  const runningTrips = trips.filter(
    (trip) => trip.status === 'IN_PROGRESS',
  ).length

  const maintenanceBuses = buses.filter(
    (bus) => bus.status === 'MAINTENANCE',
  ).length

  const getLatestGps = useCallback(
    (tripId: string) =>
      gpsLocations.find((gps) => gps.trip_id === tripId) ?? null,
    [gpsLocations],
  )

  return {
    buses,
    routes,
    trips,
    gpsLocations,
    filteredBuses,

    search,
    setSearch,

    selectedRoute,
    setSelectedRoute,

    activeBuses,
    runningTrips,
    maintenanceBuses,

    loading,
    refreshing,
    error,

    reload: () => loadData(true),
    getLatestGps,
  }
}
