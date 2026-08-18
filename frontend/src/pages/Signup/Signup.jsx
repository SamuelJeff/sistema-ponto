import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";

import "./Signup.css";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    nome: "",
    nome_empresa: "",
    email: "",
    senha: "",
  });

  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] =
    useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((estadoAnterior) => ({
      ...estadoAnterior,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setErro("");
    setSucesso("");
    setCarregando(true);

    try {
      const response = await api.post(
        "/users/signup",
        form
      );

      setSucesso(
        response.data.message ||
          "Conta criada com sucesso."
      );

      setForm({
        nome: "",
        nome_empresa: "",
        email: "",
        senha: "",
      });

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setErro(
        error.response?.data?.message ||
          "Não foi possível criar sua conta."
      );
    } finally {
      setCarregando(false);
    }
  }

  return (
    <main className="signup-page">
      <div className="signup-container">
        <section className="signup-card">
          <div className="signup-decoration-circle" />
          <div className="signup-decoration-square" />

          <div className="signup-header">
            <div className="signup-logo">
              SP
              <span />
            </div>

            <h1>Crie sua conta</h1>

            <p>
              Cadastre sua empresa para começar
              a gerenciar sua equipe.
            </p>
          </div>

          <form
            className="signup-form"
            onSubmit={handleSubmit}
          >
            <div className="signup-field">
              <label htmlFor="nome">
                Seu nome
              </label>

              <input
                id="nome"
                name="nome"
                type="text"
                placeholder="Digite seu nome"
                value={form.nome}
                onChange={handleChange}
                disabled={carregando}
                autoComplete="name"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="nome_empresa">
                Nome da empresa
              </label>

              <input
                id="nome_empresa"
                name="nome_empresa"
                type="text"
                placeholder="Digite o nome da empresa"
                value={form.nome_empresa}
                onChange={handleChange}
                disabled={carregando}
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="email">
                E-mail
              </label>

              <input
                id="email"
                name="email"
                type="email"
                placeholder="Digite seu e-mail"
                value={form.email}
                onChange={handleChange}
                disabled={carregando}
                autoComplete="email"
                required
              />
            </div>

            <div className="signup-field">
              <label htmlFor="senha">
                Senha
              </label>

              <input
                id="senha"
                name="senha"
                type="password"
                placeholder="Digite sua senha"
                value={form.senha}
                onChange={handleChange}
                disabled={carregando}
                autoComplete="new-password"
                required
              />
            </div>

            {erro && (
              <div
                className="signup-message signup-error"
                role="alert"
              >
                {erro}
              </div>
            )}

            {sucesso && (
              <div
                className="signup-message signup-success"
                role="status"
              >
                {sucesso}
              </div>
            )}

            <button
              className="signup-button"
              type="submit"
              disabled={carregando}
            >
              {carregando
                ? "Criando conta..."
                : "Criar minha conta"}
            </button>
          </form>

          <div className="signup-footer">
            <span>
              Já possui uma conta?
            </span>

            <button
              type="button"
              onClick={() =>
                navigate("/login")
              }
            >
              Entrar
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

export default Signup;