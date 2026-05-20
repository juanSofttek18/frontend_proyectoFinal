import {useEffect, useState} from "react"
function useVehicles(apiFn){
const[data, setData] = useState("");
const [error, setError] = useState("");
const [status, setStatus] = useState("");


    useEffect(() => {
    
            async function fetchVehicles() {
    
               try {

                setStatus("loading");
                const response = await apiFn()
                setData(response.data)
                setStatus("success")

               } catch (err) {
                console.log("Ha ocurrido un error", err)
                setError(err);
                setStatus("error");
            } 
            }
            
            fetchVehicles();
        }, [apiFn]);

        return[data, status, error];
}
export default useVehicles;