import "server-only";

export async function backendFetch(path:string , init:RequestInit = {},):Promise<Response>{

    const baseUrl = process.env.BACKEND_URL;

    if(!baseUrl){
        throw new Error("API_BACKEND URL is not configured")
    }

    const url = new URL (path,baseUrl);

    return fetch(url, {...init, 
        headers:{
            Accept: "application/json",
            ...(init.body ? {"Content-Type" : "application/json"} : {}),
            ...init.headers,
        },

        cache: "no-store",
        signal: init.signal ?? AbortSignal.timeout(10_000)
    });
}