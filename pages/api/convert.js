export default async function handler(req, res) {
  const from = (req.query.from || 'BRL').toUpperCase();
  const to = from === 'BRL' ? 'EUR' : 'BRL';
  const amount = parseFloat(req.query.amount) || 1;

  try {
    const r = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    if (!r.ok) throw new Error(`API-Fehler: ${r.status}`);
    const data = await r.json();

    if (!data.result || !data.info || !data.info.rate) {
      console.error("Ungültige API-Antwort:", data);
      return res.status(500).send("Fehler: Ungültige Antwort von der API.");
    }

    const result = Number(data.result).toFixed(2);
    const rate = Number(data.info.rate).toFixed(4);

    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`💱 ${amount} ${from} = ${result} ${to} (Kurs: ${rate})`);
  } catch (err) {
    res.status(500).send(`Fehler: ${err.message}`);
  }
}
