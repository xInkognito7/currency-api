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

    // Antwort komplett zurückgeben (für Debug-Zwecke)
    return new Response(
      JSON.stringify({ success: !!data.result, raw: data }, null, 2),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }, null, 2),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
