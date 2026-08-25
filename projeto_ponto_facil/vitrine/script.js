const menuButton = document.querySelector('.cabecalho__menu');
const navigation = document.querySelector('.cabecalho__navegacao');
const navigationLinks = document.querySelectorAll('.cabecalho__navegacao a');
const terminalText = document.querySelector('#terminal-texto');

menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('cabecalho__navegacao--aberto');
  menuButton.setAttribute('aria-expanded', String(isOpen));
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('cabecalho__navegacao--aberto');
    menuButton.setAttribute('aria-expanded', 'false');
  });
});

const command = 'flask run --project microprojeto-real';
let characterIndex = 0;

function typeCommand() {
  if (characterIndex < command.length) {
    terminalText.textContent += command.charAt(characterIndex);
    characterIndex += 1;
    window.setTimeout(typeCommand, 48);
    return;
  }

  window.setTimeout(() => {
    terminalText.textContent = '';
    characterIndex = 0;
    typeCommand();
  }, 3000);
}

typeCommand();