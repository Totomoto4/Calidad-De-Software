// searchGoogle.test.js

const nock = require('nock');
const { searchGoogle } = require('./search');  // Asegúrate de que la función esté exportada correctamente

beforeEach(() => {
  nock.cleanAll();
});

test('Debería devolver los primeros 5 resultados orgánicos', async () => {
  const mockResults = {
    organic_results: [
      { title: 'Resultado 1' },
      { title: 'Resultado 2' },
      { title: 'Resultado 3' },
      { title: 'Resultado 4' },
      { title: 'Resultado 5' },
      { title: 'Resultado 6' }
    ]
  };

  // Mockeamos la respuesta de la API
  nock('https://www.searchapi.io')
    .get('/api/v1/search')
    .query(true)
    .reply(200, mockResults);

  const consoleLogSpy = jest.spyOn(console, 'log');  // Para espiar console.log

  await searchGoogle('query', 'fake-api-key');  // Llamamos a la función

  // Verificamos que se impriman los primeros 5 resultados
  expect(consoleLogSpy).toHaveBeenCalledWith([
    { title: 'Resultado 1' },
    { title: 'Resultado 2' },
    { title: 'Resultado 3' },
    { title: 'Resultado 4' },
    { title: 'Resultado 5' }
  ]);
});

test('Debería imprimir mensaje cuando no hay resultados orgánicos', async () => {
  const mockResults = {
    organic_results: []
  };

  nock('https://www.searchapi.io')
    .get('/api/v1/search')
    .query(true)
    .reply(200, mockResults);

  const consoleLogSpy = jest.spyOn(console, 'log');

  await searchGoogle('query', 'fake-api-key');

  // Verificamos que se haya impreso el mensaje de "No hay resultados orgánicos disponibles."
  expect(consoleLogSpy).toHaveBeenCalledWith("No hay resultados orgánicos disponibles.");
});

test('Debería manejar errores correctamente', async () => {
  nock('https://www.searchapi.io')
    .get('/api/v1/search')
    .query(true)
    .replyWithError('Error de conexión');

  const consoleErrorSpy = jest.spyOn(console, 'error');
node
  await searchGoogle('query', 'fake-api-key');

  // Verificamos que se haya impreso el mensaje de error
  expect(consoleErrorSpy).toHaveBeenCalledWith(
    "❌ Error en la consulta:", 'Error de conexión'
  );
});