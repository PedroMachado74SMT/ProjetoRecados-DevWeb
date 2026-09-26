import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";
import "./Home.css";

export default function Home() {
    const navigate = useNavigate();

    const [recados, setRecados] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    const [temperatura, setTemperatura] = useState(null);
    const [climaLoading, setClimaLoading] = useState(true);

    async function verificarLogin() {
        try {
            await Api.get("/user");
            carregarRecados();
            carregarClima();
        } catch (error) {
            navigate("/");
        }
    }

    async function carregarClima() {
        try {
            setClimaLoading(true);

            const response = await fetch(
                "https://api.open-meteo.com/v1/forecast?latitude=-22.8375&longitude=-47.2669&current=temperature_2m,weather_code&timezone=America%2FSao_Paulo"
            );

            const data = await response.json();

            setTemperatura(data.current.temperature_2m);
        } catch (error) {
            console.error("Erro ao carregar clima:", error);
        } finally {
            setClimaLoading(false);
        }
    }

    async function logout() {
        try {
            await Api.post("/logout");
        } catch (error) {
            console.error(error);
        }

        navigate("/");
    }

    async function carregarRecados() {
        try {
            setLoading(true);

            const response = await Api.get("/recados");

            setRecados(response.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                navigate("/");
            } else {
                alert("Erro ao carregar recados");
            }
        } finally {
            setLoading(false);
        }
    }

    async function criarRecado() {
        if (!titulo || !descricao) {
            alert("Preencha título e descrição");
            return;
        }

        try {
            await Api.post("/recados", {
                titulo,
                descricao
            });

            setTitulo("");
            setDescricao("");

            await carregarRecados();
        } catch (error) {
            console.error(error);
            alert("Erro ao criar recado");
        }
    }

    async function editarRecado() {
        if (!titulo || !descricao) {
            alert("Preencha título e descrição");
            return;
        }

        try {
            await Api.put(`/recados/${editandoId}`, {
                titulo,
                descricao
            });

            setTitulo("");
            setDescricao("");
            setEditandoId(null);

            await carregarRecados();
        } catch (error) {
            console.error(error);
            alert("Erro ao editar recado");
        }
    }

    function iniciarEdicao(recado) {
        setTitulo(recado.titulo);
        setDescricao(recado.descricao);
        setEditandoId(recado.id);
    }

    async function deletarRecado(id) {
        try {
            await Api.delete(`/recados/${id}`);

            setRecados((prev) =>
                prev.filter((recado) => recado.id !== id)
            );
        } catch (error) {
            console.error(error);
            alert("Erro ao deletar recado");
        }
    }

    useEffect(() => {
        verificarLogin();
    }, []);

    return (
        <div className="home-container">
            <div className="home-header">
                <div>
                    <h1>Meus Recados</h1>
                    <p className="subtitle">
                        Organize seus lembretes de forma simples.
                    </p>
                </div>

                <button className="logout-button" onClick={logout}>
                    Sair
                </button>
            </div>

            <div className="weather-card">
                <div>
                    <h3>Clima atual</h3>

                    {climaLoading ? (
                        <p>Carregando clima...</p>
                    ) : temperatura !== null ? (
                        <p className="temperature">
                            🌤️ Sumaré: {temperatura}°C
                        </p>
                    ) : (
                        <p>Não foi possível carregar o clima.</p>
                    )}
                </div>
            </div>

            <div className="form-card">
                <h2>
                    {editandoId ? "Editar recado" : "Novo recado"}
                </h2>

                <input
                    className="input"
                    placeholder="Título"
                    value={titulo}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                    className="input textarea"
                    placeholder="Descrição"
                    value={descricao}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                <button
                    className="primary-button"
                    onClick={editandoId ? editarRecado : criarRecado}
                >
                    {editandoId
                        ? "Salvar Alterações"
                        : "Adicionar Recado"}
                </button>

                {editandoId && (
                    <button
                        className="cancel-button"
                        onClick={() => {
                            setTitulo("");
                            setDescricao("");
                            setEditandoId(null);
                        }}
                    >
                        Cancelar edição
                    </button>
                )}
            </div>

            <div className="recados-section">
                <div className="section-header">
                    <h2>Seus recados</h2>
                    <span className="recados-count">
                        {recados.length}
                    </span>
                </div>

                {loading ? (
                    <p className="message">Carregando...</p>
                ) : recados.length === 0 ? (
                    <p className="message">
                        Nenhum recado encontrado.
                    </p>
                ) : (
                    <div className="recados-list">
                        {recados.map((recado) => (
                            <div
                                className="recado-card"
                                key={recado.id}
                            >
                                <h3>{recado.titulo}</h3>

                                <p className="recado-descricao">
                                    {recado.descricao}
                                </p>

                                <small className="recado-data">
                                    Criado em:{" "}
                                    {new Date(
                                        recado.created_at
                                    ).toLocaleString("pt-BR")}
                                </small>

                                <div className="recado-actions">
                                    <button
                                        className="edit-button"
                                        onClick={() =>
                                            iniciarEdicao(recado)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="delete-button"
                                        onClick={() =>
                                            deletarRecado(recado.id)
                                        }
                                    >
                                        Excluir
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}