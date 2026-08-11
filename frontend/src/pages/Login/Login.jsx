import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

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

      // Se alguma coisa falhar, evitamos deixar
      // um token inválido salvo.
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
    <div>
      <h1>Sistema de Ponto</h1>

      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
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
            required
          />
        </div>

        <div>
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
            required
          />
        </div>

        {erro && (
          <p>
            {erro}
          </p>
        )}

        <button
          type="submit"
          disabled={carregando}
        >
          {carregando
            ? "Entrando..."
            : "Entrar"}
        </button>
      </form>
    </div>
  );
}

export default Login;