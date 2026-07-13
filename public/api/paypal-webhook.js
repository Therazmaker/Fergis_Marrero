export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const payload = req.body;

    // We only care about completed payments
    if (payload.event_type === 'PAYMENT.CAPTURE.COMPLETED') {
      const resource = payload.resource;
      const orderId = resource.id;
      
      // In custom_id we expect something like "buyer@email.com|product-id"
      const customId = resource.custom_id;

      if (!customId) {
        return res.status(400).json({ error: 'No custom_id provided in the webhook payload' });
      }

      const [email, productId] = customId.split('|');

      if (!email || !productId) {
        return res.status(400).json({ error: 'Invalid custom_id format. Expected email|productId' });
      }

      // Ensure Supabase environment variables are set in Vercel
      const supabaseUrl = process.env.SUPABASE_URL;
      const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (!supabaseUrl || !supabaseKey) {
        console.error('Missing Supabase credentials');
        return res.status(500).json({ error: 'Server configuration error' });
      }

      // Insert the purchase into Supabase using the REST API
      const response = await fetch(`${supabaseUrl}/rest/v1/purchases`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          email: email,
          product_id: productId,
          paypal_order_id: orderId,
          status: 'COMPLETED'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error inserting into Supabase:', errorText);
        // Sometimes PayPal sends duplicates. If it's a unique constraint violation on paypal_order_id, we can safely ignore it.
        if (errorText.includes('duplicate key value violates unique constraint')) {
          return res.status(200).json({ message: 'Purchase already processed' });
        }
        return res.status(500).json({ error: 'Failed to save purchase' });
      }

      return res.status(200).json({ message: 'Purchase registered successfully' });
    }

    // For other event types, just return 200 to acknowledge receipt
    return res.status(200).json({ message: 'Event ignored' });

  } catch (error) {
    console.error('Webhook error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
