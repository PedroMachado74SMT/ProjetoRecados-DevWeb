import { useState } from "react";
import Api from "../services/Api";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            const resposta = await Api.post("/login", {
                email,
                password,
            });

            localStorage.setItem("token", resposta.data.token);

            alert("Login realizado!");

            navigate("/home");

        } catch (erro) {

            alert("E-mail ou senha inválidos.");
        }
    }

    return (
        <div>

            <h1>Login</h1>

            <form onSubmit={fazerLogin}>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <br /><br />

                <input
                    type="password"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                <br /><br />

                <button>Entrar</button>

            </form>

            
            <p style={{ marginTop: 15 }}>
                Não tem conta?{" "}
                <Link to="/register" style={{ color: "blue" }}>
                    Criar conta
                </Link>
            </p>

        </div>
    );
}
