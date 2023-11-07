// test de récupération des projets
async function test() {
  const url = "http://localhost:5678/api/works";
  fetch(url)
    .then((resp) => resp.json())
    .then((data) => console.log(data));
}
test();
