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

    const [anexo, setAnexo] = useState(null);
    const [inputArquivo, setInputArquivo] = useState(0);
    const [salvando, setSalvando] = useState(false);

    const [temperatura, setTemperatura] = useState(null);
    const [climaLoading, setClimaLoading] = useState(true);

    const [verificandoLogin, setVerificandoLogin] = useState(true);
    const [usuario, setUsuario] = useState(null);

    async function verificarLogin() {
        try {
            const response = await Api.get("/user");

            setUsuario(response.data);
            setVerificandoLogin(false);

            carregarRecados();
            carregarClima();
        } catch (error) {
            navigate("/", { replace: true });
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

    function limparFormulario() {
        setTitulo("");
        setDescricao("");
        setEditandoId(null);
        setAnexo(null);
        setInputArquivo((prev) => prev + 1);
    }

    async function logout() {
        try {
            await Api.post("/logout");

            setRecados([]);
            setUsuario(null);
            limparFormulario();
            setVerificandoLogin(true);

            navigate("/", { replace: true });
        } catch (error) {
            console.error(error);
            alert("Erro ao sair da conta.");
        }
    }

    async function carregarRecados() {
        try {
            setLoading(true);

            const response = await Api.get("/recados");

            setRecados(response.data);
        } catch (error) {
            console.error(error);

            if (error.response?.status === 401) {
                navigate("/", { replace: true });
            } else {
                alert("Erro ao carregar recados");
            }
        } finally {
            setLoading(false);
        }
    }

    function selecionarAnexo(e) {
        const arquivo = e.target.files[0];

        if (!arquivo) {
            setAnexo(null);
            return;
        }

        const tiposPermitidos = [
            "image/jpeg",
            "image/png",
            "image/webp",
            "application/pdf"
        ];

        if (!tiposPermitidos.includes(arquivo.type)) {
            alert("Selecione uma imagem ou um PDF.");
            e.target.value = "";
            setAnexo(null);
            return;
        }

        if (arquivo.size > 5 * 1024 * 1024) {
            alert("O arquivo deve ter no máximo 5 MB.");
            e.target.value = "";
            setAnexo(null);
            return;
        }

        setAnexo(arquivo);
    }

    async function enviarAnexo(id) {
        if (!anexo) return;

        const formData = new FormData();

        formData.append("anexo", anexo);

        await Api.post(`/recados/${id}/anexo`, formData);
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

    async function criarRecado() {
        if (!titulo || !descricao) {
            alert("Preencha título e descrição");
            return;
        }

        setSalvando(true);

        try {
            const response = await Api.post("/recados", {
                titulo,
                descricao
            });

            const id = response.data.recado.id;

            try {
                await enviarAnexo(id);
                limparFormulario();
            } catch (error) {
                setEditandoId(id);
                alert("Recado criado, mas o anexo não foi enviado. Tente salvar novamente.");
            }

            await carregarRecados();

        } catch (error) {
            console.error(error);
            alert("Erro ao criar recado");
        } finally {
            setSalvando(false);
        }
    }

    async function editarRecado() {
        if (!titulo || !descricao) {
            alert("Preencha título e descrição");
            return;
        }

        setSalvando(true);

        try {
            await Api.put(`/recados/${editandoId}`, {
                titulo,
                descricao
            });

            try {
                await enviarAnexo(editandoId);
                limparFormulario();
            } catch (error) {
                alert("Texto atualizado, mas o anexo não foi enviado.");
            }

            await carregarRecados();

        } catch (error) {
            console.error(error);
            alert("Erro ao editar recado");
        } finally {
            setSalvando(false);
        }
    }

    function iniciarEdicao(recado) {
        setTitulo(recado.titulo);
        setDescricao(recado.descricao);
        setEditandoId(recado.id);
        setAnexo(null);
        setInputArquivo((prev) => prev + 1);
    }

    async function deletarRecado(id) {
        try {
            await Api.delete(`/recados/${id}`);

            setRecados((prev) =>
                prev.filter((recado) => recado.id !== id)
            );

            if (editandoId === id) {
                limparFormulario();
            }

        } catch (error) {
            console.error(error);
            alert("Erro ao deletar recado");
        }
    }

    useEffect(() => {
        verificarLogin();
    }, []);

    if (verificandoLogin) {
        return (
            <div className="home-container">
                <p>Verificando login...</p>
            </div>
        );
    }

    return (
        <div className="home-container">

            <div className="home-header">

                <div>
                    <h1>Meus Recados</h1>
                    <p className="subtitle">
                        Organize seus lembretes de forma simples.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>

                    {usuario?.role === "admin" && (
                        <button
                            className="primary-button"
                            onClick={() => navigate("/admin")}
                        >
                            Administração
                        </button>
                    )}

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        Sair
                    </button>

                </div>

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
                    maxLength={255}
                    disabled={salvando}
                    onChange={(e) => setTitulo(e.target.value)}
                />

                <textarea
                    className="input textarea"
                    placeholder="Descrição"
                    value={descricao}
                    maxLength={5000}
                    disabled={salvando}
                    onChange={(e) => setDescricao(e.target.value)}
                />

                <div className="anexo-form">
                    <label>Anexo (opcional)</label>

                    <input
                        key={inputArquivo}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp,.pdf"
                        disabled={salvando}
                        onChange={selecionarAnexo}
                    />

                    <small>
                        Imagens ou PDF — máximo de 5 MB.
                    </small>

                    {editandoId && (
                        <small>
                            Selecionar um novo arquivo substitui o anexo anterior.
                        </small>
                    )}
                </div>

                <button
                    className="primary-button"
                    disabled={salvando}
                    onClick={editandoId ? editarRecado : criarRecado}
                >
                    {salvando
                        ? "Salvando..."
                        : editandoId
                        ? "Salvar Alterações"
                        : "Adicionar Recado"}
                </button>

                {editandoId && (
                    <button
                        className="cancel-button"
                        disabled={salvando}
                        onClick={limparFormulario}
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

                                {recado.anexo && (
                                    <div className="anexo-card">
                                        <span>
                                            📎 {recado.anexo_nome}
                                        </span>

                                        <small>
                                            {(recado.anexo_tamanho / 1024).toFixed(1)} KB
                                        </small>

                                        <button
                                            className="download-button"
                                            onClick={() => baixarAnexo(recado)}
                                        >
                                            Baixar anexo
                                        </button>
                                    </div>
                                )}

                                <div className="recado-actions">
                                    <button
                                        className="edit-button"
                                        disabled={salvando}
                                        onClick={() =>
                                            iniciarEdicao(recado)
                                        }
                                    >
                                        Editar
                                    </button>

                                    <button
                                        className="delete-button"
                                        disabled={salvando}
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