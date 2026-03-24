import supabase from "@/lib/config/supabase"
import type { PostgrestError } from "@supabase/supabase-js"

export interface ServiceResponse<T> {
  data: T
  error: PostgrestError | null
}

export interface DeleteResponse {
  success: boolean
  error: PostgrestError | null
}

export abstract class BaseService<T extends { id?: number }> {
  protected abstract table: string

  protected async findAll(): Promise<ServiceResponse<T[]>> {
    const { data, error } = await supabase.from(this.table).select("*")
    if (error) {
      console.error(`Error fetching ${this.table}:`, error)
      return { data: [], error }
    }
    return { data: data || [], error: null }
  }

  protected async findById(id: number): Promise<ServiceResponse<T | null>> {
    const { data, error } = await supabase.from(this.table).select("*").eq("id", id).single()
    if (error) {
      console.error(`Error fetching ${this.table} by id:`, error)
      return { data: null, error }
    }
    return { data, error: null }
  }

  protected async create(item: T): Promise<ServiceResponse<T | null>> {
    const { data, error } = await supabase.from(this.table).insert(item).select("*").single()
    if (error) {
      console.error(`Error creating ${this.table}:`, error)
      return { data: null, error }
    }
    return { data, error: null }
  }

  protected async update(id: number, item: Partial<T>): Promise<ServiceResponse<T | null>> {
    const { data, error } = await supabase.from(this.table).update(item).eq("id", id).select("*").single()
    if (error) {
      console.error(`Error updating ${this.table}:`, error)
      return { data: null, error }
    }
    return { data, error: null }
  }

  protected async delete(id: number): Promise<DeleteResponse> {
    const { error } = await supabase.from(this.table).delete().eq("id", id)
    if (error) {
      console.error(`Error deleting ${this.table}:`, error)
      return { success: false, error }
    }
    return { success: true, error: null }
  }

  protected async findByColumn<K extends keyof T>(column: K, value: T[K]): Promise<ServiceResponse<T[]>> {
    const { data, error } = await supabase.from(this.table).select("*").eq(column as string, value)
    if (error) {
      console.error(`Error fetching ${this.table} by ${String(column)}:`, error)
      return { data: [], error }
    }
    return { data: data || [], error: null }
  }
}