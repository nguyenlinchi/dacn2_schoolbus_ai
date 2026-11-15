export type FaceStatus = 'REGISTERED' | 'NEEDS_UPDATE' | 'NONE'

export interface StudentRow {
  id: string
  code: string
  fullName: string
  className: string
  avatarUrl: string | null
  parentName: string
  parentPhone: string // đã che bớt, ví dụ 09•• ••• 678
  hasParent: boolean // có phụ huynh đã được duyệt
  routeCode: string
  pickupStop: string
  faceStatus: FaceStatus
  faceCount: number
}

export interface ChildRequest {
  studentId: string
  parentId: string
  studentCode: string
  fullName: string
  dateOfBirth: string | null // YYYY-MM-DD
  gender: string | null
  className: string
  relationship: string
  parentName: string
  parentPhone: string
  parentEmail: string
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER'
export type Relationship = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER'

export interface ParentOption {
  parentId: string
  name: string
  phone: string
  email: string
  childrenCount: number
}

export interface NewStudentInput {
  fullName: string
  dateOfBirth: string // YYYY-MM-DD
  gender: Gender | ''
  className: string
  studentCode: string // để trống = tự sinh
  parentId: string // để trống = chưa gán phụ huynh
  relationship: Relationship
}

export type RemoveResult = 'DELETED' | 'DEACTIVATED'

export interface RouteOption {
  routeId: string
  code: string
  name: string
  studentCount: number
  stops: { stopId: string; name: string; order: number }[]
}

export interface CurrentAssignment {
  routeId: string
  pickupStopId: string
  dropoffStopId: string
  effectiveFrom: string
}

export interface AssignRouteInput {
  studentId: string
  routeId: string
  pickupStopId: string
  dropoffStopId: string
  effectiveFrom: string // YYYY-MM-DD
}