export default async function handler(req, res) {
  const from = (req.query.from || 'BRL').toUpperCase();
  const to = from === 'BRL' ? 'EUR' : 'BRL';
  const amount = parseFloat(req.query.amount) || 1;

  try {
    const response = await fetch(`https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`);
    if (!response.ok) throw new Error(`API responded with status ${response.status}`);
    
    const data = await response.json();

    // Ergebnis prüfen
    if (!data.result) {
      console.error("Fehlerhafte API-Antwort:", data);
      return res.status(500).send("Fehler: Kein Ergebnis erhalten.");
    }

    const result = Number(data.result).toFixed(2);
    
    res.setHeader('Content-Type', 'text/plain');
    res.status(200).send(`💱 ${amount} ${from} = ${result} ${to}`);
  } catch (error) {
    res.status(500).send(`Fehler: ${error.message}`);
  }
}
