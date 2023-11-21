/****** Variables Globales******/

// Récupération de l'input "Submit"
const inputSubmit = document.querySelector("#btn-login");

/****** Les Fonctions******/

// Gestion de la connexion
function login() {
  console.log("lecture fonction login");
  // contacte de l'api.
  const apiUrl = "http://localhost:5678/api/users/login";
  // les données transmises à l'api.
  //Récupération de l'input "Email"
  const email = document.querySelector("#email").value;
  // Récupération de l'input "Password"
  const password = document.querySelector("#password").value;
  console.log("email", email);
  const data = {
    email: email,
    password: password,
    //Utilisation de ".value", pour obtenir la valeur de l'input.
  };

  //Configuration de requête HTTP
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  //Appel de l'API
  fetch(apiUrl, requestOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(
          "Les informations utilisateur/mot de passe ne sont  pas correctes"
        );
      }
      // Demande à avoir un retour de la réponse JSON pour le traitement dans le prochain bloc then.
      return response.json();
    })

    .then((authUser) => {
      //Stockage de L'ID et du token de l'utilisateur..
      console.log("authUser", authUser);
      const userId = authUser.userId;
      const authToken = authUser.token;
      localStorage.setItem("userId", userId);
      localStorage.setItem("authToken", authToken);

      //Affichage des informations récupérées via la console.
      console.log("userId", userId);
      console.log("authToken", authToken);

      // Si les informations transmises sont correcte on redire vers la page d'accueil du site.
      window.location.href = "../index.html";
    })

    .catch((error) => {
      //Affichage d'un message d'erreur
      alert(
        "Erreur de connexion, merci de vérifier vos identifiants de connexion."
      );
    });
}

/******Gestionnaire d'événements ******/
if (inputSubmit) {
  inputSubmit.addEventListener("click", (event) => {
    event.preventDefault(); // Empêche le formulaire de se soumettre
    login(); // Appelle la fonction login lorsque le bouton est cliqué
  });
}
