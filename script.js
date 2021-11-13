function enviarMensagem() {
    alert("teste")
}

function entrarNaSala() {
    prompt("Digite seu nome:")

}

function cadastrarUsuario() {

}

function carregarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(processarRespostaMensagens, promessa);
}

function processarRespostaMensagens(resposta) {
    const mensagens = resposta.data;
    const localDasMensagens = document.querySelector(".local-mensagens")
    let todasMensagens = document.querySelectorAll(".mensagem");
    const ultimaMensagem = todasMensagens[99]
    localDasMensagens.innerHTML = "";

    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {

            localDasMensagens.innerHTML += `
            <div class="mensagem status" data-identifier="message">
                <p>${mensagens[i].time} <strong> ${mensagens[i].from} </strong> entra na sala...</p>
            </div>
    `;
        } else if (mensagens[i].type === "message") {
            localDasMensagens.innerHTML += `
           <div class="mensagem message" data-identifier="message">
              <p>${mensagens[i].time} <strong> ${mensagens[i].from} </strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
           </div>
     `;
        } else if (mensagens[i].type === "private_message") {
            localDasMensagens.innerHTML += `
            <div class="mensagem private" data-identifier="message">
               <p>${mensagens[i].time} <strong> ${mensagens[i].from} </strong> para <strong>${mensagens[i].to}</strong>: ${mensagens[i].text}</p>
            </div>
      `;
        }

    }

    todasMensagens = document.querySelectorAll(".mensagem");
    const novaUltimaMensagem = todasMensagens[99]
    if (novaUltimaMensagem.innerHTML !== ultimaMensagem.innerHTML) {
        novaUltimaMensagem.scrollIntoView();
    }


}

carregarMensagens();
setInterval(carregarMensagens, 3000);