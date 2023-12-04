var bd;
let loggedUser = 0;
const key = "Dtj/Ik1Phl/Xdz64rDEaM21BmKyqy0V+Lug/y+A+CZ6pNZT28O1wwN5e1bfukA74";
// const encryptedData = CryptoJS.AES.encrypt("queso", key).toString();
// const decryptedData = CryptoJS.AES.decrypt(encryptedData, key).toString(CryptoJS.enc.Utf8);

function iniciarDB() {
  var solicitud = indexedDB.open("dibarra_Users_DB");

  solicitud.addEventListener("error", mostrarError);
  solicitud.addEventListener("success", comenzar);
  solicitud.addEventListener("upgradeneeded", crearAlmacen);
}

function mostrarError(evento) {
  console.log("ERROR: " + evento.code + " / " + evento.message);
}

function comenzar(evento) {
  bd = evento.target.result;

  if (typeof usuarioLoggeado === "function") {
    usuarioLoggeado();
  }

}

function crearAlmacen(evento) {
  var basededatos = evento.target.result;
  var almacen = basededatos.createObjectStore("users", {
    keyPath: "id",
    autoIncrement: true,
  });

  almacen.createIndex("username", "username", { unique: true });
  almacen.createIndex("displayName", "displayName", { unique: false });
  almacen.createIndex("email", "email", { unique: true });
  almacen.createIndex("password", "password", { unique: false });
  almacen.createIndex("date", "date", { unique: false });
  almacen.createIndex("pfp", "pfp", { unique: false });
  almacen.createIndex("phone", "phone", { unique: false });
  almacen.createIndex("admin", "admin", { unique: false });

  basededatos = evento.target.result;
  almacen = basededatos.createObjectStore("loggedUser", {
    keyPath: "id",
    autoIncrement: true,
  });

  almacen.createIndex("username", "username", { unique: true });
  almacen.createIndex("displayName", "displayName", { unique: false });
  almacen.createIndex("email", "email", { unique: true });
  almacen.createIndex("password", "password", { unique: false });
  almacen.createIndex("date", "date", { unique: false });
  almacen.createIndex("pfp", "pfp", { unique: false });
  almacen.createIndex("phone", "phone", { unique: false });
  almacen.createIndex("admin", "admin", { unique: false });
}

function almacenarUsuario(
  username,
  displayName,
  email,
  password,
  date,
  phone,
  pfp,
  admin
) {
  var transaccion = bd.transaction("users", "readwrite");
  var almacen = transaccion.objectStore("users");
  var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();

  var obj = {
    username: username,
    displayName: displayName,
    email: email,
    password: encryptedPassword,
    date: date,
    pfp: pfp,
    phone: phone,
    admin: admin,
  };

  almacen.add(obj);
}

function logIN(
  username,
  displayName,
  email,
  password,
  date,
  phone,
  pfp,
  admin
) {
  var transaccion = bd.transaction("loggedUser", "readwrite");
  var almacen = transaccion.objectStore("loggedUser");
  var encryptedPassword = CryptoJS.AES.encrypt(password, key).toString();

  var obj = {
    username: username,
    displayName: displayName,
    email: email,
    password: encryptedPassword,
    date: date,
    pfp: pfp,
    phone: phone,
    admin: admin,
  };

  almacen.add(obj);
}


window.addEventListener("load", iniciarDB);
