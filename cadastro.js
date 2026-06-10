import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyCD9PAPA1i5AusS_TVQ6H8nDAfSeGnFti4",
  authDomain: "autonomia-digital-552db.firebaseapp.com",
  projectId: "autonomia-digital-552db",
  storageBucket: "autonomia-digital-552db.firebasestorage.app",
  messagingSenderId: "993081821939",
  appId: "1:993081821939:web:0b038d406da98d27eb0586"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Disponibiliza o db globalmente para o perguntas.js usar
window.__db = db;

document.getElementById('form-cadastro').addEventListener('submit', async function(e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value.trim();
    const idade = parseInt(document.getElementById('idade').value);

    if (idade < 1) {
        alert("Por favor, informe uma idade válida.");
        return;
    }

    try {
        // Cria o documento no Firestore e salva o ID gerado
        const docRef = await addDoc(collection(db, "respostas"), {
            nome: nome,
            idade: idade,
            iniciadoEm: new Date(),
            acertos: null // será preenchido ao final do quiz
        });

        // Salva nome, idade e o ID do documento para usar no quiz
        sessionStorage.setItem('usuarioNome', nome);
        sessionStorage.setItem('usuarioIdade', idade);
        sessionStorage.setItem('firestoreDocId', docRef.id);

        window.location.href = "perguntas.html";

    } catch (erro) {
        console.error("Erro ao salvar no Firestore:", erro);
        alert("Erro ao salvar seus dados. Verifique sua conexão e tente novamente.");
    }
});
