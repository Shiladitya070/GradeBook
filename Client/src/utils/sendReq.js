import { useCookies } from "react-cookie";
import { backend_url } from "../../config";



export async function sendReq(endPoint = "/", method = "GET", data = null, auth) {
    const url = `http://${backend_url}/${endPoint}`;
    const res = await fetch(url, {
        method: method, // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        headers: {
            "Content-Type": "application/json",
            "Authorization": auth

        },
        // if(body: JSON.stringify(data), )// body data type must match "Content-Type" header
    });

    return { data: res.json() }; // parses JSON response into native JavaScript objects

}