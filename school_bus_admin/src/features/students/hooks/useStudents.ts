import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { studentService } from '../services/studentService'
import type { NewStudentInput } from '../types'


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