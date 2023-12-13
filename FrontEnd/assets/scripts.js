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
const imgPreview = document.querySelector('#img-preview')

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
function verifyToken() {
  const isTokenValid = localStorage.getItem('connected') === 'true'
  const elementEditing = document.querySelector('.editing')
  const elementModal = document.querySelector('.btn-Modal-Link')
  const elementBtnFilters = document.querySelector('.filters')
  const loginLink = document.querySelector('#login')
  const logoutLink = document.querySelector('#logout')
  console.log('test des éléments', elementEditing, elementModal, login, logout)
  if (!elementModal) {
    console.error("L'élément modal-link n'a pas été trouvé dans le DOM.")
  }

  console.log('valeur du token', isTokenValid)
  if (isTokenValid) {
    console.log('Token valide, ajout de la classe display-on')
    //Affichage des éléments du mode édition
    elementEditing.style.display = 'flex'
    elementModal.style.display = 'flex'
    //Masque le lien login et affiche le lien logout
    if (loginLink) loginLink.style.display = 'none'
    if (logoutLink) logoutLink.style.display = 'block'
    if (elementBtnFilters) elementBtnFilters.style.visibility = 'hidden'
  } else {
    elementEditing.style.display = 'none'
    elementModal.style.display = 'none'
    // Masque le lien logout et affiche le lien login
    if (loginLink) loginLink.style.display = 'block'
    if (logoutLink) logoutLink.style.display = 'none'
    if (elementBtnFilters) elementBtnFilters.style.visibility = 'visible'
  }

  return isTokenValid
}

//Permet la déconnexion de l'utilisateur
function logoutUser() {
  console.log('Déconnexion en cours...')
  localStorage.removeItem('authToken')
  localStorage.removeItem('userId')
  localStorage.removeItem('connected')
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

async function displayProjectsInModal() {
  const modalProjects = document.querySelector('.modal-gallery')
  const projects = await getWorks()

  projects.forEach((projects) => {
    // Ajout d'une div pour contenir les miniatures et la corbeille.
    const modalThumbnailsTrash = document.createElement('div')
    modalThumbnailsTrash.classList.add('modal-thumbnails-trash')

    const modalElementImg = document.createElement('img')
    modalElementImg.src = projects.imageUrl
    modalElementImg.classList.add('modal-thumbnails')

    const modalTrash = document.createElement('i')
    modalTrash.classList.add('fa-solid', 'fa-trash-can')

    modalTrash.id = projects.id

    // Ajout des éléments dans la div "modalThumbnailsTrash"
    modalThumbnailsTrash.appendChild(modalElementImg)
    modalThumbnailsTrash.appendChild(modalTrash)

    // Ajout de la div "modalThumbnailsTrash" à la galerie de la modale.
    modalProjects.appendChild(modalThumbnailsTrash)
  })
  deleteTrash()
}

async function deleteProject(projectId) {
  const urlDelete = `http://localhost:5678/api/works/${projectId}`
  const response = await fetch(urlDelete, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  console.log('deleteResponse', response)
  console.log(token)

  if (response.ok) {
    console.log('Projet supprimé avec succès')
    // Mise à jour de la galerie
    gallery.innerHTML = ' '
    await projectsRecovery()

    // mise à jour de la modale
    const modalProjects = document.querySelector('.modal-gallery')
    modalProjects.innerHTML = ' '
    await displayProjectsInModal()

    // Ajout a nouveau de l'écouteur d'événement sur les corbeilles
    deleteTrash()
  } else {
    console.log('Erreur lors de la suppression du projet')
  }
}

// fonction qui ajoute un écouteur d'événement à la corbeille

function deleteTrash() {
  const modalTrash = document.querySelectorAll('.fa-trash-can')
  const modalTrashArray = Array.from(modalTrash)
  console.log('test corbeilles 1', modalTrashArray)

  modalTrash.forEach((modalTrash) => {
    modalTrash.addEventListener('click', () => {
      console.log(' je clique sur la corbeille')
      deleteProject(modalTrash.id)
      console.log('id des corbeilles', modalTrash.id)
    })
  })
}

// // Fonction pour la prévisualisation du projet ajouté
function previewPicture(event) {
  //Vérification pour savoir si des fichiers ont étaient séléctionnés
  if (event.target.files && event.target.files[0]) {
    // L'objet filereader
    const reader = new FileReader()
    //déclenchement de l'événement lorsque la lecture est complète
    reader.onload = function (event) {
      //Changement de l'url de l'image dans l'élément d'aperçu
      imgPreview.src = event.target.result

      // Centrer et afficher l'image de prévisualisation dans modalPictures-box
      imgPreview.style.display = 'block'
      imgPreview.style.margin = 'auto'

      // Masquer les autres éléments
      const faImage = document.querySelector('.fa-image')
      const modalPicturesLabel = document.querySelector('#modalPictures-label')
      const uploadInput = document.querySelector('#uploadInput')
      const modalPicturesText = document.querySelector('.modalpictures-text')

      if (faImage) faImage.style.display = 'none'
      if (modalPicturesLabel) modalPicturesLabel.style.display = 'none'
      if (uploadInput) uploadInput.style.display = 'none'
      if (modalPicturesText) modalPicturesText.style.display = 'none'

      // Ajouter un gestionnaire d'événement clic à l'image pour la supprimer
      imgPreview.addEventListener('click', function () {
        // Réinitialiser l'élément d'aperçu
        imgPreview.src = ''
        imgPreview.style.display = 'none'

        // Effacer la valeur de l'entrée de fichier
        if (uploadInput) {
          uploadInput.value = ''
        }

        // Afficher à nouveau les éléments masqués
        if (faImage) faImage.style.display = 'block'
        if (modalPicturesLabel) modalPicturesLabel.style.display = 'block'
        if (modalPicturesText) modalPicturesText.style.display = 'block'

        // Supprimer le gestionnaire d'événement clic de l'image
        imgPreview.removeEventListener('click', clickToRemove)
      })
    }
    //Lecture du fichier d'image séléctionné
    reader.readAsDataURL(event.target.files[0])
  }
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

// Récupération de l'élément du DOM pour afficher la première modale.
const modalLink = document.querySelector('.btn-Modal-Link')
modalLink.addEventListener('click', () => {
  const modalContainer = document.querySelector('.modal-container')
  modalContainer.classList.add('active')
})

// Récupération des éléments du DOM pour masquer la première modale
const modalOverlay = document.querySelector('.modal-overlay')
const modalClose = document.querySelector('.modal-close')

modalOverlay.addEventListener('click', () => {
  const modalContainer = document.querySelector('.modal-container')
  modalContainer.classList.remove('active')
})

modalClose.addEventListener('click', () => {
  const modalContainer = document.querySelector('.modal-container')
  modalContainer.classList.remove('active')
})

// Récupération de l'élément du DOM pour afficher la seconde modale.
const modalBtn = document.querySelector('.modal-btn')
modalBtn.addEventListener('click', () => {
  const modalPictures = document.querySelector('.modalPictures')
  modalPictures.style.display = 'flex'
})

// Récupération des éléments du DOm pour masquer la seconde modale.
const modalPicturesClose = document.querySelector('.modalPictures-close')
modalPicturesClose.addEventListener('click', () => {
  const modalPictures = document.querySelector('.modalPictures')
  modalPictures.style.display = 'none'

  const modalContainer = document.querySelector('.modal-container')
  modalContainer.classList.remove('active')
})

// Récupération de l'élément flèche de la seconde modale pour faire un retour sur la première modale.
const arrow = document.querySelector('.modalPictures-arrow')
arrow.addEventListener('click', () => {
  const modalPictures = document.querySelector('.modalPictures')
  modalPictures.style.display = 'none'
})

// Récupération de l'élément d'entrée de fichier (input type="file")
const fileInput = document.querySelector('#uploadInput')
fileInput.addEventListener('change', previewPicture)

/******Appel des Fonctions******/
projectsRecovery()
categories()
verifyToken()
displayProjectsInModal()
