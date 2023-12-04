function mostrarLista() {
  let userList = document.getElementById("user-list-div");
  let transaccion = bd.transaction("users");
  let almacen = transaccion.objectStore("users");
  let puntero = almacen.openCursor();
  puntero.addEventListener("success", (e) => {
    var puntero = e.target.result;
    if (puntero) {
      let elements = `<li class="w-100 my-3">
        <div class="d-flex align-items-center user-div">
          <div style="height: 100px; margin: 20px">
            <img src="${puntero.value.pfp}" class="h-100" />
          </div>
          <div class="d-flex flex-column user-info p-3">
            <h4>${puntero.value.username}</h4>
            <div class="d-flex flex-row">
              <div class="d-flex flex-column user-info p-3">
                <p>Display Name: <span>${puntero.value.displayName}</span></p>
                <p>Email: <span>${puntero.value.email}</span></p>
                <p>Date of birth: <span>${puntero.value.date}</span></p>
              </div>

              <div class="d-flex flex-column user-info p-3">
                <p>Phone Number: <span>${puntero.value.phone}</span></p>
                <p>Admin: <span>${puntero.value.admin ? "Yes" : "No"}</span></p>
              </div>
            </div>
          </div>
        </div>
      </li>`;
      userList.innerHTML += elements;
      puntero.continue();
    }
  });
}
