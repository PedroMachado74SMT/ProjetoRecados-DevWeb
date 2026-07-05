import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "../services/Api";

export default function Register() {

    const navigate = useNavigate();

    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    async function cadastrar(e) {
        e.preventDefault();

        if (!nome || !email || !senha) {
            alert("Preencha todos os campos");
            return;
        }

        try {
            await Api.post("/register", {
                name: nome,
                email,
                password: senha,
            });

            alert("Cadastro realizado com sucesso!");
            navigate("/");

        } catch (error) {

            console.log("ERRO COMPLETO:", error);
            console.log("RESPOSTA DO BACKEND:", error.response?.data);
            console.log("STATUS:", error.response?.status);

            alert("Erro ao cadastrar");
        }
    }

    return (
        <div
            style={{
                maxWidth: 400,
                margin: "0 auto",
                fontFamily: "Arial",
            }}
        >
            <h1>Cadastro</h1>

            <form onSubmit={cadastrar}>

                <input
                    type="text"
                    placeholder="Nome"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />

                <input
                    type="password"
                    placeholder="Senha"
                    value={senha}
                    onChange={(e) => setSenha(e.target.value)}
                    style={{ width: "100%", padding: 8, marginBottom: 10 }}
                />

                <button
                    style={{
                        width: "100%",
                        padding: 10,
                        background: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: 6,
                    }}
                >
                    Cadastrar
                </button>

            </form>
        </div>
    );
}