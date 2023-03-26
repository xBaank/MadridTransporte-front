const apiUrl = 'http://localhost:8080/v1'

export async function getStopsTimesByCode(code) {
    const response = await fetch(`${apiUrl}/stops/${code}/mode/8/times`)
    if (!response.ok) return null
    const data = await response.json()
    return data
}