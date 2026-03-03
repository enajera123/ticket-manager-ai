export interface PaginationType {
    page: number
    limit: number
    total: number
    totalPages: number
}

export type APIResponse<T> = {
    data: T
    message: string
    status: number
}