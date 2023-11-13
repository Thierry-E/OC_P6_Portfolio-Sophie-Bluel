/****** Test de récupération des projets******/

// async function test() {
//   const url = "http://localhost:5678/api/works";
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((data) => console.log(data));
// }
// test();

/******Variables Globales******/
//Récupération de l'élément du DOM qui contiendra les projets
const gallery = document.querySelector(".gallery");

// Récupération de l'élément du DOM qui contiendra les boutons
const filters = document.querySelector(".filters");

/******Les Fonctions******/

// Récupération des projets depuis l'API
async function projectsRecovery() {
  const url = "http://localhost:5678/api/works";
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data);

      data.forEach((projects) => {
        //Création d'une balise dédié à un projet
        const figureElement = document.createElement("figure");
        // // Création des balises
        const imageElement = document.createElement("img");
        imageElement.src = projects.imageUrl;
        const captionElement = document.createElement("figcaption");
        captionElement.innerText = projects.title;
        //Rattachement de la balise figure à la div gallery
        gallery.appendChild(figureElement);
        // Rattachement des balises imd et figcaption à l'élément figure
        figureElement.appendChild(imageElement);
        figureElement.appendChild(captionElement);
      });
    });
}

// Création des boutons de filtrage.
async function categories() {
  // Récupération des catégories depuis l'API
  const url = "http://localhost:5678/api/categories";
  fetch(url)
    .then((resp) => resp.json())
    .then((category) => {
      category.forEach((projectsFilters) => {
        console.log(projectsFilters);

        // Génération des boutons
        const button = document.createElement("button");
        button.classList.add("btnFilters");
        button.id = projectsFilters.id;
        button.innerText = projectsFilters.name;
        filters.appendChild(button);
      });
    });
}

async function getWorks() {
  const requete = await fetch("http://localhost:5678/api/works");
  return requete.json();
}

function createWork(work) {
  //Récupératiuon de l'élément du DOM qui contiendra les projets
  const gallery = document.querySelector(".gallery");
  //Création d'une balise dédié à un projet
  const figureElement = document.createElement("figure");
  // const projects = data[i]; //Permet de récupérer les projets un a un
  // // Création des balises
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  const captionElement = document.createElement("figcaption");
  captionElement.innerText = work.title;
  // Rattachement des balises imd et figcaption à l'élément figure
  figureElement.appendChild(imageElement);
  figureElement.appendChild(captionElement);
  //Rattachement de la balise figure à la div gallery
  gallery.appendChild(figureElement);
}

/****** Ajout d'un gestionnaire d'événements au clic sur le bouton******/
filters.addEventListener("click", function (event) {
  const idValue = event.target.id;
  gallery.innerHTML = "";
  getWorks().then((works) => {
    works.forEach((work) => {
      if (idValue == work.categoryId) {
        createWork(work);
        console.log(work);
        console.log("value");
      }
    });
  });
});

/******Appel des Fonctions******/
projectsRecovery();
categories();
