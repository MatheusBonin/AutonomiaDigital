import { getFirestore, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const questoes = [
{
    p: "Uma pessoa com a foto de um parente/amigo entra em contato pelo WhatsApp pedindo dinheiro devido a uma emergência. O que você faz?",
    a: "Mando o dinheiro para ele(a) na hora para não deixar ele(a) na mão, afinal devemos sempre ajudar o próximo.",
    b: "Ligar para o número de telefone dele(a) ou conversar pessoalmente para entender melhor a situação.",
    r: "B",
    f: "Correto! Nunca faça pagamentos por mensagens sem confirmar por ligação.",
    e: "Incorreto: Nunca faça pagamentos apenas por mensagem. Sempre ligue para a pessoa para confirmar."
},
{
    p: "Você recebe um e-mail dizendo que seu boleto de luz está atrasado e precisa ser pago. O valor está muito acima que você costuma pagar e o e-mail diz que se o boleto não for pago logo o valor irá aumentar ou que irão cortar sua energia. O que você faz?",
    a: "Pago o boleto o mais rápido possível, afinal a conta está atrasada e vão cortar minha luz se não pagar.",
    b: "Entro em contato com a empresa de energia por telefone ou vou até um ponto de atendimento para confirmar que o boleto é válido.",
    r: "B",
    f: "Correto! Sempre verifique boletos nos canais oficiais das empresas.",
    e: "Incorreto: Golpistas criam boletos falsos. Sempre verifique suspeitos com a empresa de energia."
},
{
    p: "Você recebe uma mensagem de texto dizendo que você ganhou um prêmio de R$10.000 e precisa enviar seus dados para resgatar. O que você faz?",
    a: "Envio meus dados para garantir meu prêmio, afinal são R$10.000",
    b: "Ignoro e apago a mensagem e não passo nenhum dos meus dados. Nenhuma empresa séria pediria meus dados por mensagem de texto",
    r: "B",
    f: "Correto! Links desconhecidos podem roubar seus dados. Desconfie de prêmios fáceis.",
    e: "Incorreto: Prêmios que pedem seus documentos ou cartão são golpes. Apague a mensagem."
},
{
    p: "Uma pessoa liga dizendo ser do banco e pede a senha do seu cartão. O que você faz?",
    a: "Passo a senha para o atendente para poder prosseguir com o atendimento.",
    b: "Encerro a ligação e ligo para o número oficial do banco que está atrás do meu cartão.",
    r: "B",
    f: "Correto! Os bancos NUNCA pedem senha ou códigos por telefone.",
    e: "Incorreto: O banco nunca solicita senhas por telefone. Desligue e ligue para o número oficial atrás do seu cartão."
},
{
    p: "Qual a melhor forma de criar uma senha (e-mail, conta bancária, aplicativos)?",
    a: "Uso minha data de nascimento ou o número do meu CPF.",
    b: "Crio uma senha única com letras, números e símbolos.",
    r: "B",
    f: "Correto! Senhas complexas protegem melhor sua conta.",
    e: "Incorreto: Nunca use datas de nascimento ou números repetidos. Use uma mistura de letras e números que só você saiba."
}
];

let indice = 0;
let acertos = 0;

function carregarPergunta() {
    if (indice >= questoes.length) return;

    document.getElementById('pergunta-texto').innerText = questoes[indice].p;
    document.getElementById('btn-a').innerText = "A) " + questoes[indice].a;
    document.getElementById('btn-b').innerText = "B) " + questoes[indice].b;

    document.getElementById('btn-a').disabled = false;
    document.getElementById('btn-b').disabled = false;

    document.getElementById('feedback').style.display = 'none';
    document.getElementById('btn-proximo').style.display = 'none';
}

function responder(opcao) {
    document.getElementById('btn-a').disabled = true;
    document.getElementById('btn-b').disabled = true;

    const feedback = document.getElementById('feedback');
    const ehCorreto = (opcao === questoes[indice].r);

    feedback.style.display = 'block';
    feedback.style.backgroundColor = ehCorreto ? '#2D8A4D' : '#D9534F';
    feedback.style.color = 'white';

    feedback.innerText = ehCorreto ? questoes[indice].f : questoes[indice].e;

    if (ehCorreto) acertos++;

    document.getElementById('btn-proximo').style.display = 'inline-block';
}

async function proximaPergunta() {
    indice++;
    if (indice < questoes.length) {
        carregarPergunta();
    } else {
        // Salva o resultado no Firestore
        const docId = sessionStorage.getItem('firestoreDocId');
        if (docId && window.__db) {
            try {
                const db = window.__db;
                await updateDoc(doc(db, "respostas", docId), {
                    acertos: acertos,
                    totalQuestoes: questoes.length,
                    finalizadoEm: new Date()
                });
            } catch (erro) {
                console.error("Erro ao salvar resultado:", erro);
            }
        }

        const quizBox = document.getElementById('quiz-box');
        quizBox.innerHTML = `
        <h2>Desafio Concluído!</h2>
        <p>Obrigado por participar, ${sessionStorage.getItem('usuarioNome') || 'participante'}!</p>
        <p>Você acertou <strong>${acertos}</strong> de ${questoes.length} questões.</p>
        <br>
        <a href="index.html" class="btn-iniciar">Voltar ao Início</a>
        `;
    }
}

// Expõe as funções globalmente (necessário para os onclick no HTML)
window.responder = responder;
window.proximaPergunta = proximaPergunta;

carregarPergunta();
