import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./CadastrarUsuario.css";

function CadastrarUsuario() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    email: "",
    senha: "",
    cargo: "Funcionario",
    jornada_diaria_minutos: 480,
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: name === "jornada_diaria_minutos" ? Number(value) : value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const response = await api.post("/users/register", form);

      setSucesso(response.data.message || "Usuário cadastrado com sucesso.");

      setForm({
        nome: "",
        email: "",
        senha: "",
        cargo: "Funcionario",
        jornada_diaria_minutos: 480,
      });
    } catch (error) {
      console.error(error);

      setErro(
        error.response?.data?.message ||
          "Não foi possível cadastrar o usuário.",
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="register-user-page">
      <div className="register-user-container">
        <section className="register-user-card">
          <header className="register-user-header">
            <p className="register-user-subtitle">Gestão de equipe</p>

            <h1>Cadastrar usuário</h1>

            <p className="register-user-description">
              Adicione um administrador ou funcionário à sua equipe.
            </p>
          </header>

          <div className="register-user-card-decoration" />

          <form className="register-user-form" onSubmit={handleSubmit}>
            <div className="register-user-field">
              <label htmlFor="nome">Nome completo</label>

              <input
                id="nome"
                name="nome"
                type="text"
                value={form.nome}
                onChange={handleChange}
                placeholder="Digite o nome do usuário"
                disabled={carregando}
                autoComplete="name"
                required
              />
            </div>

            <div className="register-user-field">
              <label htmlFor="email">E-mail</label>

              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="usuario@email.com"
                disabled={carregando}
                autoComplete="email"
                required
              />
            </div>

            <div className="register-user-field">
              <label htmlFor="senha">Senha inicial</label>

              <input
                id="senha"
                name="senha"
                type="password"
                value={form.senha}
                onChange={handleChange}
                placeholder="Digite uma senha inicial"
                disabled={carregando}
                autoComplete="new-password"
                required
              />

              <small>
                O usuário utilizará essa senha para realizar o primeiro acesso.
              </small>
            </div>

            <div className="register-user-row">
              <div className="register-user-field">
                <label htmlFor="cargo">Cargo</label>

                <select
                  id="cargo"
                  name="cargo"
                  value={form.cargo}
                  onChange={handleChange}
                  disabled={carregando}
                >
                  <option value="Funcionario">Funcionário</option>

                  <option value="Administrador">Administrador</option>
                </select>
              </div>

              <div className="register-user-field">
                <label htmlFor="jornada_diaria_minutos">Jornada diária</label>

                <select
                  id="jornada_diaria_minutos"
                  name="jornada_diaria_minutos"
                  value={form.jornada_diaria_minutos}
                  onChange={handleChange}
                  disabled={carregando}
                >
                  <option value={240}>4 horas</option>

                  <option value={360}>6 horas</option>

                  <option value={480}>8 horas</option>
                </select>
              </div>
            </div>

            {erro && (
              <div
                className="register-user-message register-user-error"
                role="alert"
              >
                {erro}
              </div>
            )}

            {sucesso && (
              <div
                className="register-user-message register-user-success"
                role="status"
              >
                {sucesso}
              </div>
            )}

            <div className="register-user-actions">
              <button
                className="register-user-cancel"
                type="button"
                onClick={() => navigate("/dashboard")}
                disabled={carregando}
              >
                Voltar
              </button>

              <button
                className="register-user-submit"
                type="submit"
                disabled={carregando}
              >
                {carregando ? "Cadastrando..." : "Cadastrar usuário"}
              </button>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}

export default CadastrarUsuario;
