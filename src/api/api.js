const apiUrl = 'http://localhost:8080/v1'

export async function getStopsTimesByCode(code) {
    const response = await fetch(`${apiUrl}/stops/${code}/times`)
    if (!response.ok) return response.status
    const data = await response.json()
    return data
}

export async function getLineLocations(code) {
    const response = await fetch(`${apiUrl}/lines/${code}/mode/8/locations`)
    if (!response.ok) return response.status
    const data = await response.json()
    return data
}

export async function getItinerariesByCode(code) {
    const response = await fetch(`${apiUrl}/lines/${code}/mode/8/itineraries`)
    if (!response.ok) return response.status
    const data = await response.json()
    return data
}