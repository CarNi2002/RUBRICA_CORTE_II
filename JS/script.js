const select = document.getElementById('pokemon-select');
const contenedor = document.getElementById('pokemon-info');

// Cargar nombres en el <select>
fetch("https://pokeapi.co/api/v2/pokemon?limit=150")
  .then(res => res.json())
  .then(data => {
    data.results.forEach(pokemon => {
      const option = document.createElement('option');
      option.value = pokemon.name;
      option.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      select.appendChild(option);
    });
  });

select.addEventListener('change', () => {
  const seleccion = select.value;
  contenedor.innerHTML = "<p>Cargando...</p>";

  if (seleccion === "ver15") {
    fetch("https://pokeapi.co/api/v2/pokemon?limit=15")
      .then(res => res.json())
      .then(async data => {
        const pokemonesHTML = await Promise.all(data.results.map(async (pokemon) => {
          const res = await fetch(pokemon.url);
          const info = await res.json();
          return `
            <div class="pokemon">
              <h3>${info.name.charAt(0).toUpperCase() + info.name.slice(1)}</h3>
              <img src="${info.sprites.front_default}" alt="${info.name}">
              <p><strong>Habilidad:</strong> ${info.abilities[0].ability.name}</p>
            </div>
          `;
        }));
        contenedor.innerHTML = pokemonesHTML.join('');
      });

  } else if (seleccion !== "") {
    fetch(`https://pokeapi.co/api/v2/pokemon/${seleccion}`)
      .then(res => res.json())
      .then(data => {
        contenedor.innerHTML = `
          <div class="pokemon">
            <h2>${data.name.charAt(0).toUpperCase() + data.name.slice(1)}</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}">
            <p><strong>Habilidad:</strong> ${data.abilities[0].ability.name}</p>
          </div>
        `;
      });
  } else {
    contenedor.innerHTML = "";
  }
});