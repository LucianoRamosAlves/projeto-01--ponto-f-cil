const loginForm = document.querySelector("[data-login-form]");
const submitButton = document.querySelector("[data-login-submit]");
const buttonText = document.querySelector("[data-login-button-text]");
const messageBox = document.querySelector("[data-login-message]");
const forgotPasswordLink = document.querySelector("[data-forgot-password]");

const setLoading = (isLoading) => {
  if (!submitButton || !buttonText) return;

  submitButton.disabled = isLoading;
  submitButton.classList.toggle("is-loading", isLoading);
  buttonText.textContent = isLoading ? "VERIFICANDO ACESSO..." : "ACESSAR LABORATÓRIO";
};

const showMessage = (type, text) => {
  if (!messageBox) return;

  messageBox.hidden = false;
  messageBox.textContent = text;
  messageBox.className = `form-message is-${type}`;
};

const clearMessage = () => {
  if (!messageBox) return;

  messageBox.hidden = true;
  messageBox.textContent = "";
  messageBox.className = "form-message";
};

loginForm?.addEventListener("submit", async (event) => {
  event.preventDefault();
  clearMessage();

  const formData = new FormData(loginForm);
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");

  if (!email || !password) {
    showMessage("error", "Acesso negado: preencha e-mail e senha para entrar no laboratório.");
    return;
  }

  setLoading(true);

  try {
    /*
      INTEGRAÇÃO REAL COM SUPABASE

      1. Carregue ou importe o client do Supabase antes deste script.
      2. Substitua a simulação abaixo por:

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      window.location.href = "aulas.html";
    */

    await new Promise((resolve) => {
      window.setTimeout(resolve, 900);
    });

    throw new Error("Acesso negado. Conecte o Supabase para validar suas credenciais reais.");
  } catch (error) {
    showMessage("error", error.message || "Acesso negado. Confira seus dados e tente novamente.");
  } finally {
    setLoading(false);
  }
});

forgotPasswordLink?.addEventListener("click", (event) => {
  event.preventDefault();
  showMessage("info", "Recuperação de senha pronta para integração com o Supabase.");
});
