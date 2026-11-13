import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Clock, MapPin, Plus } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

interface Bus {
  bus_id: string
  bus_code: string
  license_plate: string
  capacity: number
  vehicle_model: string | null
  status: 'ACTIVE' | 'MAINTENANCE' | 'INACTIVE'
}

interface RouteItem {
  route_id: string
  route_code: string
  route_name: string
  start_location: string | null
  end_location: string | null
  status: 'ACTIVE' | 'INACTIVE'
}

interface RouteStop {
  stop_id: string
  stop_name: string
  address: string
  stop_order: number
  estimated_time: string | null
}

const STATUS_LABEL: Record<Bus['status'], string> = {
  ACTIVE: 'Hoạt động',
  MAINTENANCE: 'Bảo dưỡng',
  INACTIVE: 'Ngừng dùng',
}

const schema = z.object({
  bus_code: z.string().trim().min(1, 'Nhập mã xe'),
  license_plate: z.string().trim().min(1, 'Nhập biển số'),
  capacity: z.number().int().positive('Số chỗ phải lớn hơn 0'),
  vehicle_model: z.string().trim().optional(),
})
type FormValues = z.infer<typeof schema>

export function FleetPage() {
  const qc = useQueryClient()
  const [open, setOpen] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(null)

  const buses = useQuery({
    queryKey: ['buses'],
    queryFn: async () => {
      const { data, error } = await supabase.from('buses').select('*').order('bus_code')
      if (error) throw error
      return data as Bus[]
    },
  })

  const routes = useQuery({
    queryKey: ['routes'],
    queryFn: async () => {
      const { data, error } = await supabase.from('routes').select('*').order('route_code')
      if (error) throw error
      const list = data as RouteItem[]
      if (list.length > 0 && !selectedRouteId) {
        setSelectedRouteId(list[0].route_id)
      }
      return list
    },
  })

  const activeRouteId = selectedRouteId ?? routes.data?.[0]?.route_id ?? null

  const stops = useQuery({
    queryKey: ['route-stops', activeRouteId],
    enabled: !!activeRouteId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('route_stops')
        .select('*')
        .eq('route_id', activeRouteId!)
        .eq('is_active', true)
        .order('stop_order')
      if (error) throw error
      return data as RouteStop[]
    },
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) })

  const create = useMutation({
    mutationFn: async (v: FormValues) => {
      setServerError(null)
      const { error } = await supabase.from('buses').insert({
        bus_code: v.bus_code,
        license_plate: v.license_plate,
        capacity: v.capacity,
        vehicle_model: v.vehicle_model || null,
      })
      if (error) throw error
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ['buses'] })
      reset()
      setOpen(false)
    },
    onError: (e: { code?: string; message: string }) =>
      setServerError(e.code === '23505' ? 'Mã xe hoặc biển số đã tồn tại.' : e.message),
  })

  const activeRoute = routes.data?.find((r) => r.route_id === activeRouteId)

  return (
    <div className="flex flex-col gap-6">
      {/* Khối 1: Đội xe */}
      <section className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm">
        <header className="flex items-center justify-between">
          <h2 className="text-lg font-bold">Đội xe · {buses.data?.length ?? 0} xe</h2>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" /> Thêm xe
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Thêm xe</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit((v) => create.mutate(v))} className="flex flex-col gap-4" noValidate>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bus_code">Mã xe</Label>
                  <Input id="bus_code" placeholder="BUS-01" {...register('bus_code')} />
                  {errors.bus_code && <p className="text-sm text-red-600">{errors.bus_code.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="license_plate">Biển số</Label>
                  <Input id="license_plate" placeholder="43B-123.45" {...register('license_plate')} />
                  {errors.license_plate && <p className="text-sm text-red-600">{errors.license_plate.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="capacity">Số chỗ</Label>
                  <Input id="capacity" type="number" {...register('capacity', { valueAsNumber: true })} />
                  {errors.capacity && <p className="text-sm text-red-600">{errors.capacity.message}</p>}
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="vehicle_model">Dòng xe (không bắt buộc)</Label>
                  <Input id="vehicle_model" placeholder="Hyundai County 29 chỗ" {...register('vehicle_model')} />
                </div>
                {serverError && <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{serverError}</p>}
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? 'Đang lưu...' : 'Lưu'}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </header>

        {buses.isLoading && <p className="text-sm text-muted-ink">Đang tải...</p>}
        {buses.error && (
          <p role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
            Không tải được danh sách xe: {buses.error.message}
          </p>
        )}

        {buses.data && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Mã xe</TableHead>
                <TableHead>Biển số</TableHead>
                <TableHead>Số chỗ</TableHead>
                <TableHead>Dòng xe</TableHead>
                <TableHead>Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buses.data.map((b) => (
                <TableRow key={b.bus_id}>
                  <TableCell className="font-semibold">{b.bus_code}</TableCell>
                  <TableCell>{b.license_plate}</TableCell>
                  <TableCell>{b.capacity} chỗ</TableCell>
                  <TableCell>{b.vehicle_model ?? '—'}</TableCell>
                  <TableCell>
                    <Badge variant={b.status === 'ACTIVE' ? 'default' : 'secondary'}>{STATUS_LABEL[b.status]}</Badge>
                  </TableCell>
                </TableRow>
              ))}
              {buses.data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-10 text-center text-muted-ink">
                    Chưa có xe nào. Bấm "Thêm xe" để bắt đầu.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </section>

      {/* Khối 2: Tuyến đường & Các điểm dừng */}
      <section className="flex flex-col gap-5 rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold">
              {activeRoute ? `${activeRoute.route_name}` : 'Tuyến đường & điểm dừng'}
            </h2>
            {activeRoute && (
              <p className="text-sm text-muted-ink">
                {activeRoute.start_location ?? 'Điểm đầu'} → {activeRoute.end_location ?? 'Trường VKU'}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            {routes.data?.map((r) => (
              <button
                key={r.route_id}
                type="button"
                onClick={() => setSelectedRouteId(r.route_id)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  r.route_id === activeRouteId
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-ink hover:bg-slate-200'
                }`}
              >
                {r.route_name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-2.5">
          {stops.data?.map((s) => (
            <div
              key={s.stop_id}
              className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 px-4 py-3"
            >
              <div className="flex items-center gap-3.5">
                <span className="grid size-7 place-items-center rounded-full bg-blue-600 text-xs font-bold text-white">
                  {s.stop_order}
                </span>
                <div>
                  <b className="block text-sm">{s.stop_name}</b>
                  <span className="flex items-center gap-1 text-xs text-muted-ink">
                    <MapPin className="size-3.5" /> {s.address}
                  </span>
                </div>
              </div>
              {s.estimated_time && (
                <span className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-ink shadow-xs">
                  <Clock className="size-3.5 text-blue-600" />
                  {s.estimated_time.slice(0, 5)}
                </span>
              )}
            </div>
          ))}
          {stops.data?.length === 0 && (
            <p className="py-6 text-center text-sm text-muted-ink">Tuyến này chưa có điểm dừng nào.</p>
          )}
        </div>
      </section>
    </div>
  )
}