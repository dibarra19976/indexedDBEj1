const form = document.getElementById("form");
const show = document.getElementById("show");
const selects = document.getElementById("selects");
const close = document.getElementById("close");
console.log(selects);
var indexedDB =
  window.indexedDB ||
  window.mozIndexedDB ||
  window.webkitIndexedDB ||
  window.msIndexedDB ||
  window.shimIndexedDB;
var database = "usersDB";
const DB_STORE_NAME = "users";
const DB_VERSION = 1;
var db;
var opened = false;
const EDIT_USER = "Edit user";
const NEW_USER = "New user";
const ADD_USER = "Add user";

//Events
form.addEventListener("submit", (e) => {
  e.preventDefault();
  addUser(db);
});

show.addEventListener("click", () => {
  selects.classList.toggle("d-none");
  readData();
});
close.addEventListener("click", () => {
  selects.classList.toggle("d-none");
});

/**
 * openCreateDb
 * opens and/or creates an IndexedDB database
 */
function openCreateDb(db) {
  if (opened) {
    db.close();
    opened = false;
  }
  var req = indexedDB.open(database, DB_VERSION);

  //This is how we pass the DB instance to our var

  req.addEventListener("success", comenzar);
  req.addEventListener("error", mostrarError);
  req.addEventListener("upgradeneeded", crearAlmacen);
}

function comenzar(e) {
  db = this.result; // Or event.target.result
  console.log("openCreateDb: Databased opened " + db);
  opened = true;

  //The function passed by parameter is called after creating/opening database
}

// Very important event fired when
// 1. ObjectStore first time creation
// 2. Version change
function crearAlmacen(e) {
  //Value of previous db instance is lost. We get it back using the event
  db = e.target.result; //Or this.result

  var store = db.createObjectStore(DB_STORE_NAME, {
    keyPath: "id",
    autoIncrement: true,
  });

  
}

function mostrarError(e) {
  console.error(
    "openCreateDb: error opening or creating DB:",
    e.target.errorCode
  );
}

function addUser(db) {
  var username = document.getElementById("username").value;
  var displayName = document.getElementById("displayName").value;
  var email = document.getElementById("email").value;
  var password = document.getElementById("password").value;
  var date = document.getElementById("date").value;

  const pfp = document.querySelector("input[type='checkbox']:checked");

  var obj = {
    username: username,
    displayName: displayName,
    email: email,
    password: password,
    date: date,
    pfp: pfp,
  };

  // Start a new transaction in readwrite mode. We can use readonly also
  var tx = db.transaction(DB_STORE_NAME, "readwrite");
  var store = tx.objectStore(DB_STORE_NAME);

  try {
    // Inserts data in our ObjectStore
    req = store.add(obj);
  } catch (e) {
    console.log("Catch");
  }

  req.onsuccess = function (e) {
    console.log(
      "addUser: Data insertion successfully done. Id: " + e.target.result
    );

    // Operations we want to do after inserting data
    readData();
    // clearFormInputs();
  };
  req.onerror = function (e) {
    console.error("addUser: error creating data", this.error);
  };

  //After transaction is completed we close de database
  tx.oncomplete = function () {
    console.log("addUser: transaction completed");
    db.close();
    opened = false;
  };
}


function readData(){
  readUsers(db);
}

// Reads all the records from our ObjectStore
function readUsers(db) {
  var tx = db.transaction(DB_STORE_NAME, "readonly"); 
  var store = tx.objectStore(DB_STORE_NAME);

  var result = [];
  var req = store.openCursor();
  
  req.onsuccess = function(e){
    var cursor = e.target.result;

    if (cursor) {
      result.push(cursor.value);
      console.log(cursor.value);
      cursor.continue();
    } else {
      console.log("EOF");
      console.log(result);
      //Operations to do after reading all the records
      addUsersToHTML(result);
    }  
  };

  req.onerror = function(e){
    console.error("readUsers: error reading data:", e.target.errorCode);
  };

  tx.oncomplete = function() {
    console.log("readUsers: tx completed");
    db.close();
    opened = false;
  };
}

function addUsersToHTML(users){
  var ul = document.getElementById("users-ul");

  ul.innerHTML = "";

  for (let i = 0; i < users.length; i++) {
    ul.innerHTML += "<li><span>"+users[i].id+" "+users[i].username+" "+users[i].displayName+" "+users[i].email+"</span><button user_id="+users[i].id+" id=edit_"+users[i].id+">Edit user</button><button user_id="+users[i].id+" id=delete_"+users[i].id+">Delete user</button></li>";
  }
}



openCreateDb(db);
