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

// Récupération des projets depuis l'API et affichage de ces derniers sans filtrage.
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
        //Rattachement de la balise "figure" à la div "gallery".
        gallery.appendChild(figureElement);
        // Rattachement des balises "img" et "figcaption" à l'élément "figure".
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

//Fonction qui crée les projets de façon individuels en fonction de la catégorie.
function createWork(work) {
  //Récupératiuon de l'élément du DOM qui contiendra les projets
  const gallery = document.querySelector(".gallery");
  //Création d'une balise dédié à un projet
  const figureElement = document.createElement("figure");
  // const projects = data[i]; //Permet de récupérer les projets un a un
  // Création des balises
  const imageElement = document.createElement("img");
  imageElement.src = work.imageUrl;
  const captionElement = document.createElement("figcaption");
  captionElement.innerText = work.title;
  // Rattachement des balises "img" et "figcaption" à l'élément "figure".
  figureElement.appendChild(imageElement);
  figureElement.appendChild(captionElement);
  //Rattachement de la balise figure à la div "gallery".
  gallery.appendChild(figureElement);
}

/****** Gestionnaires d'événements******/
// Mise en place du filtrage des projets via les boutons.
filters.addEventListener("click", function (event) {
  const idValue = event.target.id;

  // Vérification si le bouton "Tous" est cliqué.
  if (idValue === "all") {
    // Affichage de tous les projets.
    gallery.innerHTML = "";
    projectsRecovery();
  } else {
    //affichage des projets en fonction de la catégorie sélectionnée.
    gallery.innerHTML = "";
    getWorks().then((works) => {
      works.forEach((work) => {
        if (idValue == work.categoryId) {
          createWork(work);
        }
      });
    });
  }
});

//Réinitiamisation de la gallerie via le bouton Tous.

/******Appel des Fonctions******/
projectsRecovery();
categories();
