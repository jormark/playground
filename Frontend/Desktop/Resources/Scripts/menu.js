let template_page_add = document.getElementById('template-overlay-createfolder');
let overlay_back = document.getElementById('overlay-back');
let popupContainer = document.getElementById('popupContainer');
let thumbnailsDiv = document.getElementById('thumbnails');
var thumbnailDoc = db.collection("Thumbnails").doc("thumbs");
var PlaygroundDoc = db.collection("Playground").doc("Grounds");
let namesArray = [];
let grounds = [];

overlay_back.style.opacity = '0';
overlay_back.style.pointerEvents = 'none';


//creates elemenets for each of the playground "thumbnails" and puts them on the page
function refreshThumbs(){
    thumbnailDoc.get().then((doc) => {
        doc.data().names.forEach(doc => {
            let input = document.createElement("input");
            input.name="thumb";
            input.style = "display: none;";
            input.value = doc;

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

//gets the list of current playgrounds and puts them in an array called namesArray
thumbnailDoc.get().then((doc) => {
    doc.data().names.forEach(doc => {
        namesArray.push(doc);
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});

//gets the playground data and puts it in an object
PlaygroundDoc.get().then((doc) => {
    doc.data().groundList.forEach(doc => {
        grounds.push(doc);
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});

//console logs all data from current playgrounds
db.collection('Playground').get().then((snapshot) => {
    snapshot.docs.forEach(doc => {
        console.log(doc.data());
    })
})

//adds inputted name to namesArray, pushes namesArray to firebase
function newThumb(name){
        namesArray.push(name);
        console.log(namesArray);
        thumbnailDoc.update({
            names: namesArray,
        })
}

//adds a new playground to the firebase with default settings and inputted name
function newPlayground(name){
    
    var newGround = {
        gravity: true,
        gravityMultiplier: 0,
        name: name,
        public: true,
        itemArray: [],
        bouncy: false,
    }
    grounds.push(newGround);

    PlaygroundDoc.update({
        groundList: grounds,
    })
}



//creates form, takes user input, if name already exists create alert, if not, create new playground and thumbnail by calling functions mentioned above, clears all thumbnails and adds them back with new one included
function addPlayground(){
    let form = template_page_add.cloneNode(true).content.children[0];
    overlay_back.style.opacity = '0.3';
    overlay_back.style.pointerEvents = 'all';
    form.save.addEventListener('click', e => {
        let playgroundName = form.playground_name.value;
        var x = 0;
        namesArray.forEach(e => {
            if(e.toLowerCase() == playgroundName.toLowerCase()){
                window.alert("Name already exists!");
                x = 1;
            }
        })
        if(x==0){
            newPlayground(playgroundName);
            newThumb(playgroundName);
            popupContainer.removeChild(form);
            thumbnailsDiv.innerHTML = "";
            overlay_back.style.opacity = '0';
            overlay_back.style.pointerEvents = 'none';
            refreshThumbs();
        }
        
    })

    form.cancel.addEventListener('click', e => {
        overlay_back.style.opacity = '0';
        overlay_back.style.pointerEvents = 'none';
        popupContainer.removeChild(form);
    })
   

    popupContainer.appendChild(form);  
    

    
}

