/* PAGEVRON — scripts do site (sem dependências) */
(function () {
  // Menu móvel
  var botao = document.querySelector('.menu-botao');
  var menu = document.getElementById('menu');
  if (botao && menu) {
    botao.addEventListener('click', function () {
      var aberto = botao.getAttribute('aria-expanded') === 'true';
      botao.setAttribute('aria-expanded', String(!aberto));
      menu.classList.toggle('aberto', !aberto);
    });
    menu.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') { botao.setAttribute('aria-expanded', 'false'); menu.classList.remove('aberto'); }
    });
  }

  // Ano no rodapé
  document.querySelectorAll('[data-ano]').forEach(function (el) { el.textContent = new Date().getFullYear(); });

  // Formulário de contato
  // Sem backend: abre o aplicativo de e-mail do visitante com a mensagem pronta.
  // Com backend (ex.: Formspree), preencha data-endpoint no <form> e o envio passa a ser direto.
  var form = document.getElementById('form-contato');
  if (!form) return;
  var aviso = form.querySelector('.form-aviso');
  function avisar(txt, tipo) { aviso.textContent = txt; aviso.setAttribute('data-tipo', tipo || ''); }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    if (form.querySelector('.hp input').value) return; // anti-spam
    if (!form.checkValidity()) { form.reportValidity(); avisar('Preencha os campos obrigatórios.', 'erro'); return; }
    var d = new FormData(form);
    var endpoint = form.getAttribute('data-endpoint');

    if (endpoint) {
      avisar('Enviando…');
      fetch(endpoint, { method: 'POST', body: d, headers: { Accept: 'application/json' } })
        .then(function (r) {
          if (!r.ok) throw new Error();
          form.reset(); avisar('Mensagem enviada. Responderemos pelo e-mail informado.', 'ok');
        })
        .catch(function () { avisar('Não foi possível enviar agora. Tente pelo e-mail ao lado.', 'erro'); });
      return;
    }

    var para = form.getAttribute('data-email');
    var assunto = '[Site PAGEVRON] ' + (d.get('assunto') || 'Contato');
    var corpo = 'Nome: ' + d.get('nome') + '\nE-mail: ' + d.get('email') + '\n\n' + d.get('mensagem');
    window.location.href = 'mailto:' + para + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
    avisar('Abrimos seu aplicativo de e-mail com a mensagem pronta. Se nada abrir, escreva para ' + para + '.', 'ok');
  });
})();
