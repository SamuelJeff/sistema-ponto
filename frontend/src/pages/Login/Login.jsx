import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

import { AuthContext } from "../../contexts/AuthContext";
import api from "../../services/api";

function Login() {
  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setCarregando(true);

    try {
      const response = await api.post("/users/login", {
        email,
        senha,
      });

      const { token } = response.data;

      // Salva temporariamente para que o interceptor
      // consiga enviar o token na próxima requisição.
      localStorage.setItem("token", token);

      // Busca os dados do usuário autenticado.
      const perfil = await api.get("/users/profile");

      // Atualiza o AuthContext.
      login(token, perfil.data);

      // Vai para o dashboard.
      navigate("/dashboard");
    } catch (error) {
      console.error(error);

      localStorage.removeItem("token");

      setErro(
        error.response?.data?.message ||
          "Erro ao realizar login."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="login-page">
      <div className="login-container">
        <section className="login-card">
          <div className="login-header">
            <div className="login-logo">
              SP
            </div>

            <h1>Sistema de Ponto</h1>

            <p>
              Entre com seus dados para acessar o sistema.
            </p>
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <div className="login-field">
              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="Digite seu e-mail"
                autoComplete="email"
                required
              />
            </div>

            <div className="login-field">
              <label htmlFor="senha">
                Senha
              </label>

              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(event) =>
                  setSenha(event.target.value)
                }
                placeholder="Digite sua senha"
                autoComplete="current-password"
                required
              />
            </div>

            {erro && (
              <div
                className="login-error"
                role="alert"
              >
                {erro}
              </div>
            )}

            <button
              className="login-button"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Entrando..."
                : "Entrar"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Login;