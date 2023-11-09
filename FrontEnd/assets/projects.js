// test de récupération des projets
// async function test() {
//   const url = "http://localhost:5678/api/works";
//   fetch(url)
//     .then((resp) => resp.json())
//     .then((data) => console.log(data));
// }
// test();

// Récupération des projets depuis l'API
async function allProjects() {
  const url = "http://localhost:5678/api/works";
  const response = await fetch(url);
  const data = await response.json();
  //Récupératiuon de l'élément du DOM qui contiendra les projets
  const gallery = document.querySelector(".gallery");
  // Vérification de l'élément récupérer
  //console.log("Div gallery", gallery) ;
  for (let i = 0; i < data.length; i++) {
    //Création d'une balise dédié à un projet
    const figureElement = document.createElement("figure");
    const projects = data[i];
    // Création des balises
    const imageElement = document.createElement("img");
    imageElement.src = projects.imageUrl;
    const captionElement = document.createElement("figcaption");
    captionElement.innerText = projects.title;
    //Rattachement de la balise figure à la div gallery
    gallery.appendChild(figureElement);
    // Rattachement des balises imd et figcaption à l'élément figure
    figureElement.appendChild(imageElement);
    figureElement.appendChild(captionElement);
  }
}
allProjects();
