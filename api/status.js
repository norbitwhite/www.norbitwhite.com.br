export default async function handler(req, res) {

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido. Use GET." });
  }

  const { id } = req.query;

  if (!id) {
    return res.status(400).json({
      error: "ID do pagamento não informado",
      exemplo: "/api/status?id=123456789"
    });
  }

  try {
    const response = await fetch(
      `https://api.mercadopago.com/v1/payments/${id}`,
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${process.env.MP_ACCESS_TOKEN}`
        }
      }
    );

    const data = await response.json();

    if (!data || data.error) {
      return res.status(400).json({
        error: "Pagamento não encontrado",
        detalhes: data
      });
    }

    return res.status(200).json({
      id: data.id,
      status: data.status,               // pending | approved | rejected
      valor: data.transaction_amount,
      metodo: data.payment_method_id,
      descricao: data.description
    });

  } catch (error) {
    return res.status(500).json({
      error: "Erro ao consultar pagamento",
      detalhes: error.message
    });
  }
}
