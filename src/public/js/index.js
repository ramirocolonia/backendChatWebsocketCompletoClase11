const socket = io();
let user;
let h1 = document.getElementById("h1");
let chatBox = document.getElementById("chatBox");

Swal.fire({
    title:"Identifícate",
    input:"text",
    text:"Ingresa el usuario para identificarte en el chat...",
    inputValidator: (value)=>{
        return !value && "necesitas escribir un nombre de usuario para continuar..."
        // validacion para que el usuario ingrese un usr antes de dar click en continuar
    },
    allowOutsideClick: false //impide que el usuario pueda dar click fuera del cuadro
}).then(result =>{
    user = result.value;
    // una vez que el usuario se identifica lo asignamos a user
    h1.innerHTML = `Chateando como ${user}`;
    socket.emit("logIn", user); 
    //evento para cargar los msj ya enviados previos a iniciar sesión
    // y notificar al resto de los usuarios el nuevo usuario logueado
});

chatBox.addEventListener("keyup", e=>{
    if(e.key === "Enter"){
        if(chatBox.value.trim().length > 0){
            socket.emit("message", {user:user, message:chatBox.value});
            chatBox.value = "";
        }
    }
});

// SOCKET LISTENERS
socket.on("messageLogs", data=>{
    let log = document.getElementById("messageLogs");
    let messages = "";
    data.forEach(message => {
        messages = messages + `${message.user} dice: ${message.message} </br>`;
    });
    log.innerHTML = messages;
});

socket.on("newUser", user=>{
    Swal.fire({
        text:`Nuevo usuario conectado: ${user}`,
        toast: true,
        position: "top-right"
    });
});
