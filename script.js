// Função para animar reação visualmente
function animarReacao(element) {
  element.style.transform = "scale(1.5)";
  element.style.filter = "drop-shadow(0 0 12px #00b4db)";
  setTimeout(() => {
    element.style.transform = "";
    element.style.filter = "";
  }, 300);
}

// Função para Check-in Emocional
function salvarCheckin(form) {
  const emocao = form.querySelector('input[name="emocao"]:checked');
  if (!emocao) {
    alert("Por favor, selecione uma emoção.");
    return;
  }
  const comentario = form.querySelector("#comentario").value.trim();
  const data = new Date().toLocaleString();

  const checkin = { emocao: emocao.value, comentario, data };

  let historico = JSON.parse(localStorage.getItem("checkins")) || [];
  historico.push(checkin);
  localStorage.setItem("checkins", JSON.stringify(historico));

  form.reset();
  mostrarHistorico();

  // Feedback visual simples
  alert("Check-in salvo com sucesso!");
}

function mostrarHistorico() {
  const lista = document.getElementById("listaCheckins");
  if (!lista) return;

  lista.innerHTML = "";
  const historico = JSON.parse(localStorage.getItem("checkins")) || [];
  historico.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${item.data}</strong> – ${item.emocao} ${item.comentario ? "– " + item.comentario : ""}`;
    lista.appendChild(div);
  });
}

// Funções para Canal de Apoio
function salvarApoio(form) {
  const mensagem = form.querySelector("#mensagem").value.trim();
  if (mensagem.length === 0) {
    alert("Digite uma mensagem para enviar.");
    return;
  }
  const querContato = form.querySelector("#querContato").checked;
  const data = new Date().toLocaleString();

  const apoio = { mensagem, querContato, data };

  let mensagens = JSON.parse(localStorage.getItem("apoio")) || [];
  mensagens.push(apoio);
  localStorage.setItem("apoio", JSON.stringify(mensagens));

  form.reset();
  mostrarApoio();

  alert("Mensagem de apoio enviada!");
}

function mostrarApoio() {
  const lista = document.getElementById("listaApoio");
  if (!lista) return;

  lista.innerHTML = "";

  const mensagens = JSON.parse(localStorage.getItem("apoio")) || [];
  mensagens.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.innerHTML = `<strong>${item.data}</strong> – ${item.mensagem} ${item.querContato ? "<br><em>(Quer contato)</em>" : ""}`;
    lista.appendChild(div);
  });
}

// Funções para Mural e Feedback
function salvarMural(form) {
  const mensagem = form.querySelector("#mensagemMural").value.trim();
  if (mensagem.length === 0) {
    alert("Digite uma mensagem para enviar ao mural.");
    return;
  }
  const publica = form.querySelector("#publica").checked;
  if (!publica) {
    alert("Para aparecer no mural, marque a opção 'Desejo que minha mensagem apareça no mural'.");
    return;
  }
  const data = new Date().toLocaleString();

  let mensagens = JSON.parse(localStorage.getItem("mural")) || [];

  const novaMsg = { 
    id: Date.now(), 
    mensagem, 
    data, 
    reacoes: { coracao: 0, aplaudir: 0, agradecer: 0 } 
  };

  mensagens.push(novaMsg);
  localStorage.setItem("mural", JSON.stringify(mensagens));

  form.reset();
  mostrarMural();

  alert("Mensagem adicionada ao mural!");
}

function mostrarMural() {
  const lista = document.getElementById("listaMural");
  if (!lista) return;

  lista.innerHTML = "";

  const mensagens = JSON.parse(localStorage.getItem("mural")) || [];
  mensagens.slice().reverse().forEach(item => {
    const div = document.createElement("div");
    div.className = "item";
    div.dataset.id = item.id;

    div.innerHTML = `
      <strong>${item.data}</strong><br/>
      <p>${item.mensagem}</p>
      <div class="reactions">
        <span title="❤️" data-tipo="coracao">❤️ ${item.reacoes.coracao}</span>
        <span title="👏" data-tipo="aplaudir">👏 ${item.reacoes.aplaudir}</span>
        <span title="🙏" data-tipo="agradecer">🙏 ${item.reacoes.agradecer}</span>
      </div>
    `;

    lista.appendChild(div);
  });

  // Eventos das reações com animação
  document.querySelectorAll(".reactions span").forEach(el => {
    el.onclick = function() {
      const tipo = this.getAttribute("data-tipo");
      const id = this.parentElement.parentElement.dataset.id;
      curtirMensagem(id, tipo);
      animarReacao(this);
    };
  });
}

function curtirMensagem(id, tipo) {
  let mensagens = JSON.parse(localStorage.getItem("mural")) || [];
  const idx = mensagens.findIndex(m => m.id == id);
  if (idx >= 0) {
    mensagens[idx].reacoes[tipo]++;
    localStorage.setItem("mural", JSON.stringify(mensagens));
    mostrarMural();
  }
}

// Inicializar a exibição ao carregar a página
document.addEventListener("DOMContentLoaded", () => {
  mostrarHistorico();
  mostrarApoio();
  mostrarMural();

  // Form listeners
  const formCheckin = document.getElementById("formCheckin");
  if (formCheckin) {
    formCheckin.addEventListener("submit", e => {
      e.preventDefault();
      salvarCheckin(formCheckin);
    });
  }

  const formApoio = document.getElementById("formApoio");
  if (formApoio) {
    formApoio.addEventListener("submit", e => {
      e.preventDefault();
      salvarApoio(formApoio);
    });
  }

  const formMural = document.getElementById("formMural");
  if (formMural) {
    formMural.addEventListener("submit", e => {
      e.preventDefault();
      salvarMural(formMural);
    });
  }
});
