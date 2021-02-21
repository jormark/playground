let template_page_add = document.getElementById('template-overlay-createfolder');
let overlay_back = document.getElementById('overlay-back');
let popupContainer = document.getElementById('popupContainer');
let thumbnailsDiv = document.getElementById('thumbnails');
var thumbnailDoc = db.collection("Thumbnails").doc("thumbs");
let namesArray = [];

function refreshThumbs(){
    thumbnailDoc.get().then((doc) => {
        doc.data().names.forEach(doc => {
            let input = document.createElement("input");
            input.name="thumb";
            input.style = "display: none;";
            input.value = "Playground 1";

            let div1 = document.createElement("div");
            div1.appendChild(input);

            let p = document.createElement("p");
            p.id = "playgroundName";
            
            let text = document.createTextNode(doc);
            p.appendChild(text);

            let button = document.createElement("button");
            button.id = "thumb";
            button.appendChild(p);

            let div2 = document.createElement("div");
            div2.style = "width: 100%; height: 100%;";
            div2.appendChild(button);

            let form = document.createElement("form");
            form.id = "thumbForm";
            form.action = "playground.html";
            form.method = "GET";
            form.appendChild(div1);
            form.appendChild(div2);
            thumbnailsDiv.appendChild(form);
            console.log("doneso");
        })
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

refreshThumbs();

thumbnailDoc.get().then((doc) => {
    doc.data().names.forEach(doc => {
        namesArray.push(doc);
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});


db.collection('Playground').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
    })
})

function newThumb(name){
        namesArray.push(name);
        console.log(namesArray);
        thumbnailDoc.update({
            names: namesArray,
        })
}

function newPlayground(name){
    db.collection("Playground").add({
        gravity: true,
        gravityMultiplier: 0,
        name: name,
        public: true,
        itemArray: [],
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
}




function addPlayground(){
    let form = template_page_add.cloneNode(true).content.children[0];
    
    form.save.addEventListener('click', e => {
        let playgroundName = form.playground_name.value;
        var x = 0;
        namesArray.forEach(e => {
            if(e == playgroundName){
                window.alert("Name already exists!");
                x = 1;
            }
        })
        if(x==0){
            newPlayground(playgroundName);
            newThumb(playgroundName);
            popupContainer.removeChild(form);
            console.log("count");
            thumbnailsDiv.innerHTML = "";
            refreshThumbs();
        }
        
    })

    form.cancel.addEventListener('click', e => {
        popupContainer.removeChild(form);
    })
   

    popupContainer.appendChild(form);  
    

    
}

