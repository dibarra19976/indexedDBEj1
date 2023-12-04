const loginForm = document.getElementById("loginForm");
const user = document.getElementById("user");
const password = document.getElementById("password");

let valido = true;

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  verificarCampos();
  if (valido === true) {
    iniciarSesion();
  }
});

function iniciarSesion() {
  let transaccion = bd.transaction("users");
  let almacen = transaccion.objectStore("users");

  let puntero = almacen.openCursor();
  puntero.addEventListener("success", iterarArrayVerificar);
}

function iterarArrayVerificar(evento) {
  var puntero = evento.target.result;
  if (puntero) {
    let stringUser = puntero.value.username;
    let stringPassword = puntero.value.password;
    let decryptedPassword = CryptoJS.AES.decrypt(stringPassword, key).toString(
      CryptoJS.enc.Utf8
    );
    if (user.value == stringUser && password.value == decryptedPassword) {
      logIN(puntero.value.username, puntero.value.displayName, puntero.value.email, puntero.value.password, puntero.value.date, puntero.value.phone, puntero.value.pfp, puntero.value.admin);
      if(puntero.value.admin){
        window.location.href = "../docs/user_list.html";
      }
      else{
        window.location.href = "../index.html";
      }
    }
    else{
        puntero.continue();
    }
  }
}

function verificarCampos() {
  valido = true;
  mostrarCorrecto([user, password]);
  verificarVacio([user, password]);
}

function verificarVacio(inputArray) {
  inputArray.forEach((input) => {
    if (input.value.trim() === null || input.value.trim() === "") {
      let mensaje = "The field can't be empty";
      mostrarError(input, mensaje);
      valido = false;
    }
  });
}

function mostrarError(input, mensaje) {
  input.classList.remove("border");
  input.classList.remove("border-success");
  input.classList.add("border");
  input.classList.add("border-danger");
  let parent = input.parentElement;
  let formText = parent.querySelector(".form-text");
  formText.classList.add("text-danger");
  formText.innerHTML = mensaje;
}

function mostrarCorrecto(inputArray) {
  inputArray.forEach((input) => {
    input.classList.add("border");
    input.classList.add("border-success");
    let parent = input.parentElement;
    let formText = parent.querySelector(".form-text");
    formText.innerHTML = "";
  });
}
