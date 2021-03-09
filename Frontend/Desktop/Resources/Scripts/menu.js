let template_page_add = document.getElementById('template-overlay-createfolder');
let overlay_back = document.getElementById('overlay-back');
let popupContainer = document.getElementById('popupContainer');
let thumbnailsDiv = document.getElementById('thumbnails');
var newImage = document.getElementById('newImage');
var thumbnailDoc;
var PlaygroundDoc;
var doesExist = false;
var thumbExists = false;
let namesArray = [];
let grounds = [];

//clears effects that are later applied
overlay_back.style.opacity = '0';
overlay_back.style.pointerEvents = 'none';

//gets email from url that was put there when user logged in. Email is then used to access individual playgrounds
var url = new URL(window.location.href);
var usermail = url.searchParams.get("email");

//checks to see if the user already has a database section for their account. If yes then set database reference to it, if no, create one
db.collection("Playground").get().then((querySnapshot) => {
    querySnapshot.forEach(doc =>{
        if(doc.id == usermail){
            console.log("found");
            PlaygroundDoc = db.collection("Playground").doc(doc.id);
            doesExist = true;
        }
        
    });
    if(doesExist==false){
            console.log("not found");
            db.collection("Playground").doc(usermail).set({
                groundList: []
            })
            .then(() => {
                console.log("Document successfully written!");
            })
            .catch((error) => {
                console.error("Error writing document: ", error);
            });
            PlaygroundDoc = db.collection("Playground").doc(usermail);
        }
});

//same as before but different section of database

db.collection("Thumbnails").get().then((querySnapshot) => {
    querySnapshot.forEach(doc =>{
        if(doc.id == usermail){
            console.log("found");
            thumbnailDoc = db.collection("Thumbnails").doc(doc.id);
            thumbExists = true;
        }
        
    });
    if(thumbExists==false){
        console.log("not found");
        db.collection("Thumbnails").doc(usermail).set({
            names: []
        })
        .then(() => {
            console.log("Document successfully written!");
        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });
        thumbnailDoc = db.collection("Thumbnails").doc(usermail);
    }
    
//creates elemenets for each of the playground "thumbnails" and puts them on the page
function refreshThumbs(){
    thumbnailDoc.get().then((doc) => {
        doc.data().names.forEach(doc => {
            let p = document.createElement("p");
            p.id = "playgroundName";
            
            let text = document.createTextNode(doc);
            p.appendChild(text);

            let button = document.createElement("button");
            button.id = "thumb";
            button.addEventListener("click", function(){
                window.location = "playground.html?email=" + usermail + "&thumb=" + doc;
            })
            button.appendChild(p);
            thumbnailsDiv.appendChild(button);
            console.log("doneso");
        })
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
}

refreshThumbs();

//pulls all user's playground's names from database and puts them in an array
thumbnailDoc.get().then((doc) => {
    doc.data().names.forEach(doc => {
        namesArray.push(doc);
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});







//gets the list of current playgrounds and puts them in an array called namesArray

//gets the playground data and puts it in an object
PlaygroundDoc.get().then((doc) => {
    doc.data().groundList.forEach(doc => {
        grounds.push(doc);
    })
}).catch((error) => {
    console.log("Error getting document:", error);
});


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
newImage.addEventListener("click", function(){
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
    })
    


});