class profileStorage {
    #selectDOM:HTMLSelectElement;

    constructor(dom:HTMLSelectElement){
        this.#selectDOM = dom;
        this.#build();
    }

    #build(){
        let configs = [""];
        for(let i = 0, length = localStorage.length; i < length; i++){
            configs.push(localStorage.key(i) as string);
        }

        configs.sort();

        this.#selectDOM.innerHTML = "";
        configs.forEach(name => {
            let option = new Option(name, name);
            this.#selectDOM.appendChild(option);
        });
    }

    #flash(id:string, colorName:string){
        const dom = document.getElementById(id);
        if(dom === null){return;}

        dom.className = colorName;
        setTimeout(() => {dom.className = "off";}, 500);
    }

    add(){
        let name = prompt("Enter the name of the profile:");
        while(name === ""){name = prompt("Name cannot be blank:");}
        if(name === null){return;}

        localStorage.setItem(name, "");
        this.#build();

        this.#selectDOM.value = name;
        this.save();
    }

    save(){
        const name = this.#selectDOM.value;
        if(name === ""){this.add(); return;}

        const data = autofunction.cache.loadAll();
        localStorage.setItem(name, JSON.stringify(data));

        this.#flash("save", "active");
    }

    load(){
        const name = this.#selectDOM.value;
        let item = localStorage.getItem(name);

        if(name === "" || item === null){this.#flash("load", "error"); return;}

        const data = JSON.parse(item);
        for(let id in data){
            autofunction.cache.save(id, data[id]);
        }

        this.#flash("load", "active");
    }

    remove(){
        const name = this.#selectDOM.value;
        if(name === ""){return;}

        const conf = confirm("Are you sure you want to delete: " + name);
        if(!conf){return;}

        localStorage.removeItem(name);
        this.#build();
    }
}