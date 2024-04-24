document.getElementById('formulario').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const atributo = document.getElementById('atributo').value;
    const valor = document.getElementById('valor').value;
  
    try {
      const respuesta = await fetch(`http://localhost:3000/api/stats/filter?atributo=${atributo}&valor=${valor}`);
      const datos = await respuesta.json();
      mostrarResultados(datos);
    } catch (error) {
      console.error('Error al realizar la solicitud:', error);
    }
  });
  
  function mostrarResultados(resultados) {
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.innerHTML = '<h2>Resultados:</h2>';
    if (resultados.length === 0) {
      resultadosDiv.innerHTML += '<p>No se encontraron resultados.</p>';
    } else {
      resultados.forEach(resultado => {
        resultadosDiv.innerHTML += `<p>${JSON.stringify(resultado)}</p>`;
      });
    }
  }
  