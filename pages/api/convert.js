export const config = {
  runtime: 'edge',
};

export default async function handler(req) {
  const { searchParams } = new URL(req.url);

  const from = (searchParams.get('from') || 'BRL').toUpperCase();
  const to = from === 'BRL' ? 'EUR' : 'BRL';
  const amount = parseFloat(searchParams.get('amount') || '1');

  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      // Rückgabe der vollständigen API-Antwort bei fehlendem Ergebnis
      return new Response(
        JSON.stringify({
          error: 'Kein gültiges Ergebnis von der API erhalten.',
          rawResponse: data,
          usedUrl: url
        }, null, 2),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const converted = data.result.toFixed(2);
    return new Response(`${amount} ${from} = ${converted} ${to}`, {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  } catch (error) {
    return new Response(`Fehler: ${error.message}`, {
      status: 500,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}
