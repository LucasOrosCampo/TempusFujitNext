import tokenService from "./token";

const api_host = (process.env.NODE_ENV === 'development') ? 'http://localhost:5182' :'https://tempusfujit.com/api' 

export async function get<T>(route: string) : Promise<T>{
    let request = {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
        }
    }
    let response = await fetch(`${api_host}/${route}`, request)
    return response.json();
}
export async function post<T>(route: string, body: T, failCallback?: undefined | (() => void)) : Promise<any>{
    let request = {
        method: 'POST',
        headers: {
        'Authorization': `Bearer ${tokenService.getToken()}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(body ?? { })
    }
    let response = await fetch(`${api_host}/${route}`, request).catch(_ => failCallback && failCallback())
    return response?.text()
}