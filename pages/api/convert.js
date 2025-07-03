export default async function handler(req, res) {
  const from = (req.query.from || 'BRL').toUpperCase();
  const to = from === 'BRL' ? 'EUR' : 'BRL';
  const amount = parseFloat(req.query.amount) || 1;

  try {
    const url = `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`;
    const response = await fetch(url);
    const data = await response.json();

    // Debug-Ausgabe:
    console.log("API Response:", data);

    if (!data.result) {
      return res.status(500).send(`Fehler: Kein Ergebnis von der API erhalten.\n\nRaw API Response:\n${JSON.stringify(data, null, 2)}`);
    }

    const result = Number(data.result).toFixed(2);
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`💱 ${amount} ${from} = ${result} ${to}`);
  } catch (error) {
    res.status(500).send(`Fehler: ${error.message}`);
  }
}
