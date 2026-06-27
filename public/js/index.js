const URL_API = "https://animal-api-qwny.onrender.com"

function sucesso(msg) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #00b09b, #96c93d)"
        }
    }).showToast();
}

function erro(msg) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #ff416c, #ff4b2b)"
        }
    }).showToast();
}

function aviso(msg) {
    Toastify({
        text: msg,
        duration: 3000,
        gravity: "top",
        position: "right",
        style: {
            background: "linear-gradient(to right, #f7971e, #ffd200)"
        }
    }).showToast();
}

function warning(msg) {
    return Swal.fire({
        icon: "warning",
        title: "Atenção",
        text: msg,
        showCancelButton: true,
        confirmButtonText: "Sim",
        cancelButtonText: "Cancelar",
        confirmButtonColor: "#e74c3c"
    });
}

// ================================
// renderizar
// ================================
function renderizarAnimais(lista) {
    const container = document.getElementById("lista-animais");
    container.innerHTML = "";

    lista.forEach(animal => {
        const li = document.createElement("li");

        li.innerHTML = `
      <strong>${animal.nome}</strong><br>
      Idade: ${animal.idade}<br>
      Sexo: ${animal.sexo}<br>
      Cor: ${animal.cor}<br><br>

      <button onclick="eliminar('${animal.id}')">
        Eliminar
      </button>
    `;

        container.appendChild(li);
    });
}

// ================================
// carregar animais
// ================================
async function carregarAnimais() {
    const container = document.getElementById("lista-animais");
    const response = await axios.get(`${URL_API}/animais`);

    todosAnimais = response.data;
    // guarda original

    container.innerHTML = "";

if (todosAnimais.length === 0) {
  container.innerHTML = "<p>Nenhum animal cadastrado</p>";
  return;
}

    renderizarAnimais(todosAnimais);
}

// ================================
// cadastrar animais
// ================================
function guardarAnimal() {
    const form_animal = document.getElementById("form_animal");
    const input_nome = document.getElementById("nome");

    form_animal.onsubmit = async e => {
        e.preventDefault();
        const nome = document.getElementById("nome").value;
        const idade = document.getElementById("idade").value;
        const sexo = document.getElementById("sexo").value;
        const cor = document.getElementById("cor").value;

        if (idade <= 0) {
            erro("Idade inválida");
        } else {
            await axios.post(`${URL_API}/animais`, {
                nome: nome,
                idade: idade,
                sexo: sexo,
                cor: cor
            });

            sucesso("Animal cadastrado com sucesso");
        }

        carregarAnimais();
    };
}

// ================================
// buscar animal
// ================================
function buscarAnimal() {
    const nome = document.getElementById("buscar").value.trim().toLowerCase();

    if (nome.trim().length === 0) {
        erro(`Digite o nome do animal`);
        renderizarAnimais(todosAnimais);
        return;
    }

    const filtrados = todosAnimais.filter(animal =>
        animal.nome.toLowerCase().includes(nome)
    );

    if (filtrados.length === 0) {
        erro(`O animal ${nome} não foi encontrado`);
        renderizarAnimais(todosAnimais);
        return;
    }

    renderizarAnimais(filtrados);
}

// ================================
// resetar busca feita
// ================================
function resetLista() {
    document.getElementById("buscar").value = "";
    renderizarAnimais(todosAnimais);
    sucesso("Lista de busca resetada com sucesso");
}

// ================================
// eliminar animais
// ================================
async function eliminar(id) {
    const result = await warning("Tens a certeza que queres eliminar este animal?");

    if (!result.isConfirmed) {
        return;
    }

    try {
        await axios.delete(`${URL_API}/animais/${id}`);
        sucesso("Animal eliminado com sucesso");

        carregarAnimais();
    } catch (error) {
        console.error(error);
        erro("Ocorreu um erro ao eliminar");
    }
}

// ================================
// aplicativo
// ================================
function app() {
    console.log("App iniciada");
    carregarAnimais();
    guardarAnimal();
    buscarAnimal();
    eliminar(id);
}

app();
