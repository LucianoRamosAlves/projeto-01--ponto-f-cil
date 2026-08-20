// 1. SELECIONAR OS ELEMENTOS
const botaoMenu = document.querySelector(".botao__menu"); 
const menu = document.querySelector("#menu-principal");   
const linksDoMenu = document.querySelectorAll("#menu-principal a"); 

// 2. ABRIR E FECHAR O MENU
botaoMenu.addEventListener("click", function () {
    // Agora usando o seu padrão de nomenclatura com dois underlines
    menu.classList.toggle("menu__aberto");
});

// 3. FECHAR O MENU AO CLICAR EM UM LINK
linksDoMenu.forEach(function (link) {
    link.addEventListener("click", function () {
        // Remove a classe usando o mesmo padrão
        menu.classList.remove("menu__aberto");
    });
});
