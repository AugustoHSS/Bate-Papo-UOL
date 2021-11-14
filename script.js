let usuario;
let usuariosOnline;

function enviarMensagem() {
    let textoMensagem = document.querySelector(".mandar-mensagem input").value;
    const mensagem = {
        from: usuario,
        to: "Todos",
        text: textoMensagem,
        type: "message"

    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem)
    promessa.then(carregarMensagens)

}

function botaoCadastro() {

    if (document.querySelector(".tela-cadastro input").value != "") {
        document.querySelector(".botao-cadastro").classList.add("botao-cadastro-liberado")


    } else {
        document.querySelector(".botao-cadastro").classList.remove("botao-cadastro-liberado")
    }

}

function cadastrarUsuario() {

    if (document.querySelector(".tela-cadastro input").value != "") {
        const requisicao = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", { name: document.querySelector(".tela-cadastro input").value });
        requisicao.catch(tratarErro);
        requisicao.then(tratarSucesso);

    }
}

function tratarErro() {
    alert("Nome de usuário já está em uso")
}

function tratarSucesso() {
    document.querySelector(".tela-cadastro").classList.add("display-none");
    usuario = document.querySelector(".tela-cadastro input").value
    setInterval(testaUsuarioPresente, 5000);
}

function carregarMensagens() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promessa.then(processarRespostaMensagens, promessa);
}

function processarRespostaMensagens(resposta) {
    const mensagens = resposta.data;
    const localDasMensagens = document.querySelector(".local-mensagens")
    let todasMensagens = document.querySelectorAll(".mensagem");
    const ultimaMensagem = todasMensagens[todasMensagens.length - 1]
    localDasMensagens.innerHTML = "";


    for (let i = 0; i < mensagens.length; i++) {
        if (mensagens[i].type === "status") {

            localDasMensagens.innerHTML += `
            <div class="mensagem status" data-identifier="message">
                <p>${mensagens[i].time} <strong> ${mensagens[i].from} </strong> ${mensagens[i].text}</p>
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
    const novaUltimaMensagem = todasMensagens[todasMensagens.length - 1]
    if (novaUltimaMensagem.innerHTML !== ultimaMensagem.innerHTML) {
        novaUltimaMensagem.scrollIntoView();
    }


}

function testaUsuarioPresente() {
    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", { name: usuario })
    promessa.catch(erroDeConexao)
}

function erroDeConexao(erro) {
    alert("Você foi desconectado do chat!")
    console.log("erro foi " + erro.data)
}

function usuariosAtivos() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promessa.then(pegarUsuarios)
}

function pegarUsuarios(usuarios) {
    usuariosOnline = usuarios.data

}



carregarMensagens();
setInterval(carregarMensagens, 3000);
setInterval(botaoCadastro, 200);
setInterval(usuariosAtivos, 220);