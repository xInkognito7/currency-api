export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const searchParams = new URL(req.url).searchParams;

  const from = (searchParams.get('from') || 'BRL').toUpperCase();
  const to = from === 'BRL' ? 'EUR' : 'BRL';
  const amount = parseFloat(searchParams.get('amount') || '1');

  const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data || !data.result) {
      return new Response(
        JSON.stringify({
          error: 'API-Antwort unvollständig oder ungültig.',
          response: data,
        }),
        {
          status: 500,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const converted = data.result.toFixed(2);

    return new Response(`${amount} ${from} ≈ ${converted} ${to}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    return new Response(`Fehler: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' },
    });
  }
}
