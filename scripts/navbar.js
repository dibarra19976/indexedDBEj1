function usuarioLoggeado() {
  let transaccion = bd.transaction("loggedUser");
  let almacen = transaccion.objectStore("loggedUser");
  let puntero = almacen.openCursor();
  puntero.addEventListener("success", (e) => {
    var puntero = e.target.result;
    if (puntero) {
      let login = document.getElementById("loginbtn");
      login.classList.add("d-none");
      let register = document.getElementById("registerbtn");
      register.classList.add("d-none");
      let logout = document.getElementById("logoutbtn");
      logout.classList.remove("d-none");
      let pfpRoute = puntero.value.pfp;
      const profileIcon = document.getElementById("profileIcon");
      profileIcon.src = pfpRoute;
      profileIcon.classList.remove("filter-secondary");
      const profileTop = document.getElementById("profile");
      profileTop.classList.remove("d-none");
      const profilePicTop = document.getElementById("profilePicTop");
      profilePicTop.src = pfpRoute;
      const username = document.getElementById("username");
      username.innerText = puntero.value.displayName;
      puntero.continue();
      if (typeof mostrarLista === "function" ) {
        if(puntero.value.admin == true){
            mostrarLista();
        }
        else{
            window.location.href = "/index.html";
        }
      }
    }
  });
}
