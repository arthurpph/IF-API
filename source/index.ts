type stateValue = string | number | boolean;

function bridge(){
    setVisibility(true);

    const addressInput = document.getElementById("address") as HTMLInputElement;
    let address = addressInput.value;
    const parts = address.split(".");

    if(address !== ""){
        if(parts.length < 2){
            address = "1." + address;
        }
        if(parts.length < 3){
            address = "168." + address;
        }
        if(parts.length < 4){
            address = "192." + address;
        }
    }

    socket.emit("bridge", address, (response:string) => {
        statLog.innerText = response;
        console.log(response);
    });
}

function closeBridge(){
    reset();

    socket.emit("break", (response:string) => {
        statLog.innerText = response;
        console.log(response);
    });
}

function read(command:string, callback:(value:stateValue) => void){
    socket.emit("read", command, (value:stateValue) => {
        callback(value);
    });
}

function readAsync(command:string, callback:(value:stateValue) => void){
    socket.emit("readAsync", command, (value:stateValue) => {
        callback(value);
    });
}

function readLog(command:string){
    read(command, (value:stateValue) => { console.log(value); });
}

function write(command:string, value:stateValue){
    socket.emit("write", command, value);
}

function setVisibility(hidden:boolean){
    for(let i = 1, length = panels.length; i < length; i++){
        const panel = panels[i] as HTMLDivElement;
        panel.hidden = hidden;
    }
}

function reset(){
    setVisibility(true);

    autofunctions.forEach(autofunc => {
        if(autofunc.active){
            autofunc.active = false;
        }
    });
}

let statLog = document.getElementById("status") as HTMLSpanElement;
let panels = document.getElementsByClassName("panel") as HTMLCollectionOf<HTMLDivElement>;

const storage = new Storage();

storage.init(document.getElementById("configselect"));

const select = document.getElementById("voices") as HTMLSelectElement;
const voices = speechSynthesis.getVoices();
for(let i = 0, length = voices.length; i < length; i++){
    const newOption = new Option(voices[i].lang, i.toString());
    select.add(newOption);
}

socket.emit("test", (response:string) => {
    statLog.innerText = response;
    console.log(response);
});

socket.on("ready", (address:string) => {
    const addressInput = document.getElementById("address") as HTMLInputElement;
    addressInput.value = address;
    setVisibility(false);
});

socket.on("log", (response:string) => {
    statLog.innerText = response;
    console.log(response);
});