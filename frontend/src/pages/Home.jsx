import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";

export default function Home() {

    const navigate = useNavigate();

    const [recados, setRecados] = useState([]);
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");
    const [loading, setLoading] = useState(false);
    const [editandoId, setEditandoId] = useState(null);

    const token = localStorage.getItem("token");

    // proteção de rota
    useEffect(() => {
        if (!token) {
            navigate("/");
        }
    }, []);

    const authHeaders = {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
    
    function logout() {
    localStorage.removeItem("token");
    navigate("/");
}

    // carregar os recado
    async function carregarRecados() {
        try {
            setLoading(true);

            const response = await Api.get("/recados", authHeaders);

            setRecados(response.data);
        } catch (error) {
            console.error(error);
            alert("Erro ao carregar recados");
        } finally {
            setLoading(false);
        }
    }

    // CRIAR recado
    async function criarRecado() {
        if (!titulo || !descricao) {
            alert("Preencha título e descrição");
            return;
        }

        try {
            await Api.post(
                "/recados",
                { titulo, descricao },
                authHeaders
            );

            setTitulo("");
            setDescricao("");

            await carregarRecados();

        } catch (error) {
            console.error(error);
            alert("Erro ao criar recado");
        }
    }

    //editar recado
    async function editarRecado() {
     if (!titulo || !descricao) {
        alert("Preencha título e descrição");
        return;
    }

    try {

        await Api.put(
            `/recados/${editandoId}`,
            {
                titulo,
                descricao
            },
            authHeaders
        );

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

    // DELETAR recado
    async function deletarRecado(id) {
        try {
            await Api.delete(`/recados/${id}`, authHeaders);

            setRecados((prev) =>
                prev.filter((recado) => recado.id !== id)
            );
        } catch (error) {
            console.error(error);
            alert("Erro ao deletar recado");
        }
    }

    useEffect(() => {
        carregarRecados();
    }, []);

    return (

        
        <div
            style={{
                maxWidth: 600,
                margin: "0 auto",
                fontFamily: "Arial",
            }}
        >
            <h1>Meus Recados</h1>
                <button
    onClick={logout}
    style={{
        marginBottom: 15,
        padding: "8px 14px",
        background: "#e74c3c",
        color: "white",
        border: "none",
        borderRadius: 8,
        cursor: "pointer",
        fontWeight: "bold",
        transition: "0.2s",
    }}
    onMouseOver={(e) => (e.target.style.background = "#c0392b")}
    onMouseOut={(e) => (e.target.style.background = "#e74c3c")}
                                >
                        Sair
                </button>

            
            <input
                style={{ width: "100%", padding: 8, marginBottom: 10 }}
                placeholder="Título"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
            />

            <textarea
                style={{ width: "100%", padding: 8 }}
                placeholder="Descrição"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
            />

            <button
                onClick={editandoId ? editarRecado: criarRecado}
                style={{
                    marginTop: 10,
                    padding: 10,
                    width: "100%",
                    background: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: 6,
                }}
            >
              {editandoId ? "Salvar Alterações" : "Adicionar Recado"}
            </button>

            <hr style={{ margin: "20px 0" }} />

            
            {loading ? (
                <p>Carregando...</p>
            ) : recados.length === 0 ? (
                <p>Nenhum recado encontrado.</p>
            ) : (
                recados.map((recado) => (
                    <div
                        key={recado.id}
                        style={{
                            border: "1px solid #ddd",
                            padding: 12,
                            borderRadius: 8,
                            marginBottom: 10,
                        }}
                    >
                        <h3>{recado.titulo}</h3>
                        <p>{recado.descricao}</p>

                        <button
                          onClick={() => iniciarEdicao(recado)}
                           style={{
                             marginTop: 5,
                             marginRight: 10,
                             background: "#3498db",
                             color: "white",
                             border: "none",
                             padding: 6,
                             borderRadius: 5,
                              }}
                                  >
                                Editar
                        </button>

                        <button
                            onClick={() => deletarRecado(recado.id)}
                            style={{
                                marginTop: 5,
                                background: "red",
                                color: "white",
                                border: "none",
                                padding: 6,
                                borderRadius: 5,
                            }}
                        >
                            Excluir
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}