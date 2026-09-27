// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardTitle, cardPrice, transferAmount, recipientPhone, senderPhone, provider } = body;

    // Bereken het totale bedrag (kaart + transfer) in USD
    const totalAmount = Number(transferAmount) + Number(cardPrice);

    // WAAFiPay Sandbox API Endpoint
    const waafiUrl = 'https://sandbox.waafipay.com/asm';

    const payload = {
      schemaVersion: '1.0',
      requestId: 'REQ_' + Date.now(),
      timestamp: new Date().toISOString(),
      channel: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid: process.env.WAAFIPAY_MERCHANT_UID || 'merchant_test_id',
        apiUserId: process.env.WAAFIPAY_API_USER_ID || 'user_test_id',
        apiKey: process.env.WAAFIPAY_API_KEY || 'key_test',
        paymentMethod: provider || 'MW_ZAAD', // Bepaalt de provider (bijv. ZAAD of EVC Plus)
        payerPhone: senderPhone, // Het nummer van de afzender die de betaling goedkeurt
        amount: totalAmount.toString(),
        currency: 'USD',
        description: `Hadiyad: ${cardTitle} + $${transferAmount} gift`,
      }
    };

    const response = await fetch(waafiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // WAAFiPay geeft 2001 terug als de USSD push naar de telefoon is gestuurd
    if (data.responseCode === '2001') {
      return NextResponse.json({ 
        success: true, 
        message: 'Controleer je telefoonscherm om de betaling te bevestigen.' 
      });
    } else {
      return NextResponse.json(
        { success: false, error: data.responseMessage || 'Betaling mislukt' }, 
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('WAAFiPay Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Server fout opgetreden' }, { status: 500 });
  }
}