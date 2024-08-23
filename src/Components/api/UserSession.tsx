import { useEffect, useState } from "react";

export default function UserSession (){

    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        
        const usuarioDados = sessionStorage.getItem('user');
        if (usuarioDados) {
            const usuarioDadosParse = JSON.parse(usuarioDados);
            setUser(usuarioDadosParse);
        }
    }, []);

      return {user, setUser} as const;
    


}