import tokenService from "./token";

const api_host = (process.env.NODE_ENV === 'development') ? 'http://localhost:5182' :'https://tempusfujit.com/api' 

export async function get<T>(route: string, failCallback?: undefined | (() => void)) : Promise<T>{
    let request = {
        method: 'GET', 
        headers: {
          'Authorization': `Bearer ${tokenService.getToken()}`,
        }
    }
    let response = await fetch(`${api_host}/${route}`, request)
    if (response.status !== 200) {
        failCallback && failCallback()
        throw response?.status
    }
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
    if (response?.status !== 200 ) {
        failCallback && failCallback() 
        throw response?.status 
    }
    return response?.text()
}