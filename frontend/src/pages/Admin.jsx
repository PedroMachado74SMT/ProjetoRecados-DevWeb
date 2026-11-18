import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";
import "./Home.css";

export default function Admin() {
    const navigate = useNavigate();

    const [recados, setRecados] = useState([]);
    const [loading, setLoading] = useState(true);

    async function carregarRecados() {
        try {
            const response = await Api.get("/admin/recados");

            setRecados(response.data);
            setLoading(false);

        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                navigate("/", { replace: true });

            } else if (error.response?.status === 403) {
                alert("Acesso restrito a administradores.");
                navigate("/home", { replace: true });

            } else {
                alert("Erro ao carregar os recados.");
                navigate("/home", { replace: true });
            }
        }
    }

    async function baixarAnexo(recado) {
        try {
            const response = await Api.get(
                `/recados/${recado.id}/anexo`,
                {
                    responseType: "blob"
                }
            );

            const url = window.URL.createObjectURL(response.data);
            const link = document.createElement("a");

            link.href = url;
            link.download = recado.anexo_nome || "anexo";

            document.body.appendChild(link);

            link.click();
            link.remove();

            setTimeout(() => {
                window.URL.revokeObjectURL(url);
            }, 1000);

        } catch (error) {
            console.error(error);
            alert("Erro ao baixar o anexo.");
        }
    }

    useEffect(() => {
        carregarRecados();
    }, []);

    if (loading) {
        return <p>Verificando acesso...</p>;
    }

    return (
        <div className="home-container">

            <div className="home-header">
                <div>
                    <h1>Painel de Administração</h1>
                    <p className="subtitle">
                        Moderação dos recados de todos os usuários.
                    </p>
                </div>

                <button
                    className="primary-button"
                    onClick={() => navigate("/home")}
                >
                    Voltar
                </button>
            </div>

            <div className="recados-section">

                <h2>Todos os recados ({recados.length})</h2>

                {recados.length === 0 ? (
                    <p>Nenhum recado encontrado.</p>
                ) : (
                    <div className="recados-list">

                        {recados.map((recado) => (
                            <div
                                className="recado-card"
                                key={recado.id}
                            >
                                <h3>{recado.titulo}</h3>

                                <p>
                                    <strong>Usuário: </strong>
                                    {recado.user?.name}
                                </p>

                                <p>
                                    <strong>E-mail: </strong>
                                    {recado.user?.email}
                                </p>

                                <p className="recado-descricao">
                                    {recado.descricao}
                                </p>

                                <small className="recado-data">
                                    Criado em:{" "}
                                    {new Date(
                                        recado.created_at
                                    ).toLocaleString("pt-BR")}
                                </small>

                                {recado.anexo && (
                                    <div className="anexo-card">

                                        <span>
                                            📎 {recado.anexo_nome}
                                        </span>

                                        <button
                                            className="download-button"
                                            onClick={() => baixarAnexo(recado)}
                                        >
                                            Baixar anexo
                                        </button>

                                    </div>
                                )}
                            </div>
                        ))}

                    </div>
                )}
            </div>
        </div>
    );
}