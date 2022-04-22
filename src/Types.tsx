export interface ServiceResponse {
    service_id: number
    area: string
    route: string
    additional_info?: string | null
    last_updated_date?: string | null
    disruption_reason?: string | null
    updated: string | null
    status: number
    locations: Location[]
}

export interface Location {
    id: number
    name: string
    latitude: number
    longitude: number
}

export enum Status {
    Normal = 0,
    Disrupted = 1,
    Cancelled = 2,
    Unknown = -99
}

export type Service = {
    serviceID: number,
    area: string
    route: string
    status: Status
    additional_info?: string | null
}

export function serviceResponseToService(response: ServiceResponse): Service {
    return {
        serviceID: response.service_id,
        area: response.area,
        route: response.route,
        status: response.status,
        additional_info: response.additional_info
    }
}
