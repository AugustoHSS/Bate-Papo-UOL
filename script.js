let usuario;
let executarFuncaoUmaVez = true;
let todosUsuarios = [];
let usuariosNovos;



document.getElementById("texto-mensagem").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("botao-enviar-mensagem").click();
    }
});

function abrirSideBar() {
    const sidebar = document.querySelector(".container-sidebar")
    sidebar.classList.remove("display-none")

}

function fecharSideBar() {
    const sidebar = document.querySelector(".container-sidebar")
    sidebar.classList.add("display-none")
}

function enviarMensagem() {
    let textoMensagem = document.querySelector(".mandar-mensagem input").value;
    const mensagem = {
        from: usuario,
        to: "Todos",
        text: textoMensagem,
        type: "message"

    }

    const promessa = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", mensagem)
    document.querySelector(".mandar-mensagem input").value = ""
    promessa.then(carregarMensagens)
    promessa.catch(recarregarPagina)

}

function recarregarPagina() {
    window.location.reload()
    alert("Página foi recarregada pois voce estava offline")
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
        document.querySelector(".loading").classList.remove("display-none");
        requisicao.catch(tratarErro);
        requisicao.then(tratarSucesso);

    }
}

function tratarErro() {
    document.querySelector(".loading").classList.add("display-none");
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

}

function usuariosAtivos() {
    const promessa = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants")
    promessa.then(colocarUsuariosAtivos)
}



function colocarUsuariosAtivos(usuarios) {


    const localDosUsuariosOnline = document.querySelector(".participantes-online");
    localDosUsuariosOnline.innerHTML = ""
    usuariosNovos = usuarios.data

    if (executarFuncaoUmaVez) {
        for (let i = 0; i < usuariosNovos.length; i++) {
            localDosUsuariosOnline.innerHTML += `
            <div class="participante" id="${usuariosNovos[i].name}">
                <ion-icon name="person-circle"></ion-icon>
                <p>${usuariosNovos[i].name}</p>
            </div>
    
            `
        }


    }

    /*
        for (let i = 0; i < usuariosNovos.length; i++) {

            for (let j = 0; j < todosUsuarios.length; j++) {
                if (usuariosNovos[i].name === todosUsuarios[j].name) {
                    break;
                } else {
                    if (j == todosUsuarios.length - 1) {
                        localDosUsuariosOnline.innerHTML += `
                        <div class="participante" id="${usuariosNovos[i].name}">
                            <ion-icon name="person-circle"></ion-icon>
                            <p>${usuariosNovos[i].name}</p>
                        </div>
                
                        `
                    }
                }

            }

        }

        for (let i = 0; i < todosUsuarios.length; i++) {
            for (let j = 0; j < usuariosNovos.length; j++) {
                if (todosUsuarios[i].name === usuariosNovos[j].name) {

                    break;
                } else {
                    if (j === usuariosNovos.length - 1) {
                        let usuarioId = todosUsuarios[i].name;
                        console.log(usuarioId)

                        localDosUsuariosOnline.removeChild(document.getElementById(parseInt(usuarioId)));

                    }
                }

            }

        }
        todosUsuarios = usuariosNovos
    */
}


carregarMensagens();
setInterval(carregarMensagens, 3000);
setInterval(botaoCadastro, 200);
setInterval(usuariosAtivos, 220);