import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { ChangePasswordPage } from '@/features/auth/ChangePasswordPage'
import { LoginPage } from '@/features/auth/LoginPage'
import { RequireStaff } from '@/features/auth/RequireStaff'
import { FleetPage } from '@/features/fleet/FleetPage'
import { PagePlaceholder } from '@/features/shared/PagePlaceholder'
import { OverviewPage } from '@/features/overview/OverviewPage'
import { RoutesPage } from '@/features/routes/RoutesPage'
import { AbsencesPage } from '@/features/absences/AbsencesPage'
import { AlertsPage } from '@/features/alerts/AlertsPage'


export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RequireStaff />}>
        <Route element={<AppShell />}>
          <Route index element={<OverviewPage />} />
          <Route path="monitor" element={<PagePlaceholder title="Giám sát đội xe" />} />
          <Route path="students" element={<PagePlaceholder title="Học sinh & khuôn mặt" />} />
          <Route path="staff" element={<PagePlaceholder title="Tài xế & bảo mẫu" />} />
          <Route path="fleet" element={<FleetPage />} />
          <Route path="routes" element={<RoutesPage />} />
          <Route path="attendance" element={<PagePlaceholder title="Điểm danh" />} />
          <Route path="absences" element={<AbsencesPage/>} />
          <Route path="alerts" element={<AlertsPage/>} />
          <Route path="account" element={<ChangePasswordPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
