import { useEffect, useState } from "react";
import Api from "../services/Api";

export default function Home() {

    const [recados, setRecados] = useState([]);

    async function carregarRecados() {

        try {

            const resposta = await Api.get("/recados", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });

            setRecados(resposta.data);

        } catch (erro) {

            alert("Erro ao carregar recados");

        }

    }

    useEffect(() => {
        carregarRecados();
    }, []);

    return (

        <div>

            <h1>Meus Recados</h1>

            {recados.map((recado) => (

                <div key={recado.id}>

                    <h3>{recado.titulo}</h3>

                    <p>{recado.descricao}</p>

                    <hr />

                </div>

            ))}

        </div>

    );

}