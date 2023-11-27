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
const gallery = document.querySelector('.gallery')
const token = localStorage.getItem('authToken')
console.log('test local storage', token)

// Récupération de l'élément du DOM qui contiendra les boutons
const filters = document.querySelector('.filters')

/******Les Fonctions******/

// Récupération des projets depuis l'API et affichage de ces derniers sans filtrage.
async function projectsRecovery() {
  const url = 'http://localhost:5678/api/works'
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => {
      console.log(data)

      data.forEach((projects) => {
        //Création d'une balise dédié à un projet
        const figureElement = document.createElement('figure')
        // // Création des balises
        const imageElement = document.createElement('img')
        imageElement.src = projects.imageUrl
        const captionElement = document.createElement('figcaption')
        captionElement.innerText = projects.title
        //Rattachement de la balise "figure" à la div "gallery".
        gallery.appendChild(figureElement)
        // Rattachement des balises "img" et "figcaption" à l'élément "figure".
        figureElement.appendChild(imageElement)
        figureElement.appendChild(captionElement)
      })
    })
}

// Création des boutons de filtrage.
async function categories() {
  // Récupération des catégories depuis l'API
  const url = 'http://localhost:5678/api/categories'
  fetch(url)
    .then((resp) => resp.json())
    .then((category) => {
      category.forEach((projectsFilters) => {
        console.log(projectsFilters)

        // Génération des boutons
        const button = document.createElement('button')
        button.classList.add('btnFilters')
        button.id = projectsFilters.id
        button.innerText = projectsFilters.name
        filters.appendChild(button)
      })
    })
}

async function getWorks() {
  const requete = await fetch('http://localhost:5678/api/works')
  return requete.json()
}

// Fonction qui crée les projets de façon individuels en fonction de la catégorie.
function createWork(work) {
  //Récupératiuon de l'élément du DOM qui contiendra les projets
  const gallery = document.querySelector('.gallery')
  //Création d'une balise dédié à un projet
  const figureElement = document.createElement('figure')
  // const projects = data[i]; //Permet de récupérer les projets un a un
  // Création des balises
  const imageElement = document.createElement('img')
  imageElement.src = work.imageUrl
  const captionElement = document.createElement('figcaption')
  captionElement.innerText = work.title
  // Rattachement des balises "img" et "figcaption" à l'élément "figure".
  figureElement.appendChild(imageElement)
  figureElement.appendChild(captionElement)
  //Rattachement de la balise figure à la div "gallery".
  gallery.appendChild(figureElement)
}

// Affichage des éléments de modifications si token correct
function verifyToken(token) {
  const isTokenValid = token === localStorage.getItem('authToken')
  const elementEditing = document.querySelector('.editing')
  const elementModal = document.querySelector('.modal-link')
  const loginLink = document.querySelector('#login')
  const logoutLink = document.querySelector('#logout')
  console.log('test des éléments', elementEditing, elementModal, login, logout)
  if (!elementModal) {
    console.error("L'élément modal-link n'a pas été trouvé dans le DOM.")
  }

  if (isTokenValid) {
    console.log('Token valide, ajout de la classe display-on')
    //Affichage des éléments du mode édition
    elementEditing.style.display = 'flex'
    elementModal.style.display = 'flex'
    //Masque le lien login et affiche le lien logout
    if (loginLink) loginLink.style.display = 'none'
    if (logoutLink) logoutLink.style.display = 'block'
  } else {
    elementEditing.style.display = 'none'
    elementModal.style.display = 'none'
    // Masque le lien logout et affiche le lien login
    if (loginLink) loginLink.style.display = 'block'
    if (logoutLink) logoutLink.style.display = 'none'
  }

  return isTokenValid
}

//Permet la déconnexion de l'utilisateur
function logoutUser() {
  console.log('Déconnexion en cours...')
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
  console.log('Après suppression authToken:', localStorage.getItem('authToken'))

  // Masquage des éléments du mode édition
  const elementEditing = document.querySelector('.editing')
  const elementModal = document.querySelector('.modal-link')

  if (elementEditing) {
    console.log('Masquer élément editing')
    elementEditing.style.display = 'none'
  }

  if (elementModal) {
    console.log('masquer élément modal-link')
    elementModal.style.display = 'none'
  }
  console.log('Fin de la déconnexion')
}

/****** Gestionnaires d'événements******/

//Réinitialisation de la gallerie via le bouton Tous.
// Mise en place du filtrage des projets via les boutons.
filters.addEventListener('click', function (event) {
  const idValue = event.target.id

  // Vérification si le bouton "Tous" est cliqué.
  if (idValue === 'all') {
    // Affichage de tous les projets.
    gallery.innerHTML = ''
    projectsRecovery()
  } else {
    //affichage des projets en fonction de la catégorie sélectionnée.
    gallery.innerHTML = ''
    getWorks().then((works) => {
      works.forEach((work) => {
        if (idValue == work.categoryId) {
          createWork(work)
        }
      })
    })
  }
})

//Récupération de l'élément du DOM pour le lien "logout"
const logoutLink = document.getElementById('logout')
if (logoutLink) {
  logoutLink.addEventListener('click', function (event) {
    console.log('clic sur logout')
    event.preventDefault()
    logoutUser()
    verifyToken()
  })
}

// // Vérification du token après chargement complet de la page
// document.addEventListener('DOMContentLoaded', function () {
//   const authToken = localStorage.getItem('authToken')
//   console.log('vérification token', authToken)
//   console.log('Avant verifiToken')
//   verifyToken('authToken')
//   console.log('Après verifyToken')
// })
/******Appel des Fonctions******/
projectsRecovery()
categories()
verifyToken(token)
