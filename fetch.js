const API_URL = '__URL__';

async function post(data) {
  const url = new URL(API_URL);

  Object.entries(data).forEach(([name, value]) =>
    url.searchParams.append(name, value)
  );

  const resp = await fetch(url.toString());
  const json = await resp.json();

  return json;
}

post({
  FIELD_COUNT: '5',
  TYPE: 'NEW_TOPIC', // 'NEW_TOPIC' | 'REPLY'
  FORM_TITLE: 'Exemplo de Testes',
  TIMESTAMP: Date.now().toString()
})
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
