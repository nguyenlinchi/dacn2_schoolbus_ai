import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentService } from '../services/studentService'
import type { NewStudentInput } from '../types'
import type { AssignRouteInput } from '../types'


export function useStudents() {
  return useQuery({
    queryKey: ['students'],
    queryFn: studentService.getStudents,
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  })
}

export function useChildRequests() {
  return useQuery({
    queryKey: ['child-requests'],
    queryFn: studentService.getChildRequests,
    refetchInterval: 30_000, // phụ huynh gửi xong, tối đa 30 giây là thấy
    refetchOnWindowFocus: true,
  })
}

export function useReviewRequest() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: studentService.reviewRequest,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['child-requests'] })
      qc.invalidateQueries({ queryKey: ['students'] })
    },
  })
}

export function useParents(enabled: boolean) {
  return useQuery({
    queryKey: ['parent-options'],
    queryFn: studentService.getParents,
    enabled,
    staleTime: 60_000,
  })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: NewStudentInput) => studentService.createStudent(input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['parent-options'] })
    },
  })
}

export function useRemoveStudent() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (studentId: string) => studentService.removeStudent(studentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['students'] })
      qc.invalidateQueries({ queryKey: ['child-requests'] })
    },
  })
}

export function useRouteOptions(enabled: boolean) {
  return useQuery({
    queryKey: ['route-options'],
    queryFn: studentService.getRouteOptions,
    enabled,
    staleTime: 0,
  })
}

export function useCurrentAssignment(studentId: string) {
  return useQuery({
    queryKey: ['current-assignment', studentId],
    queryFn: () => studentService.getCurrentAssignment(studentId),
    staleTime: 0,
  })
}

function useInvalidateAssignment() {
  const qc = useQueryClient()
  return () => {
    qc.invalidateQueries({ queryKey: ['students'] })
    qc.invalidateQueries({ queryKey: ['route-options'] })
    qc.invalidateQueries({ queryKey: ['current-assignment'] })
  }
}

export function useAssignRoute() {
  const invalidate = useInvalidateAssignment()
  return useMutation({
    mutationFn: (input: AssignRouteInput) => studentService.assignRoute(input),
    onSuccess: invalidate,
  })
}

export function useUnassignRoute() {
  const invalidate = useInvalidateAssignment()
  return useMutation({
    mutationFn: (studentId: string) => studentService.unassignRoute(studentId),
    onSuccess: invalidate,
  })
}