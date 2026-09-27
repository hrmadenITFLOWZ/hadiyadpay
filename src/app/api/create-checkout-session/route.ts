// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

function formatWaafiPhone(phone: string): string {
  if (!phone) return '';
  // Verwijder alle spaties, streepjes en plusjes
  let cleaned = phone.replace(/\D/g, ''); 
  
  // Als het begint met een 0 (bijv. 063...), haal de 0 eraf
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
  
  // Als het nog geen 252 bevat, voeg het toe
  if (!cleaned.startsWith('252')) {
    cleaned = '252' + cleaned;
  }
  
  return cleaned;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardTitle, cardPrice, transferAmount, senderPhone } = body;

    const totalAmount = Number(transferAmount || 0) + Number(cardPrice || 0);
    const waafiUrl = 'https://sandbox.waafipay.com/asm';
    
    // Hier passen we het nummer aan
    const formattedSenderPhone = formatWaafiPhone(senderPhone);
    console.log('--- TELEFOONNUMMER CHECK ---');
    console.log('Origineel:', senderPhone);
    console.log('Geformatteerd:', formattedSenderPhone);

    const payload = {
      schemaVersion: '1.0',
      requestId: 'REQ_' + Date.now(),
      timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''),
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid: process.env.WAAFIPAY_MERCHANT_UID || 'merchant_test_id',
        apiUserId: process.env.WAAFIPAY_API_USER_ID || 'user_test_id',
        apiKey: process.env.WAAFIPAY_API_KEY || 'key_test',
        paymentMethod: 'MWALLET_ACCOUNT',
        payerInfo: {
          accountNo: formattedSenderPhone // Hier wordt het meegestuurd
        },
        transactionInfo: {
          referenceId: 'REF_' + Date.now(),
          invoiceId: 'INV_' + Date.now(),
          amount: totalAmount.toFixed(2),
          currency: 'USD',
          description: `Hadiyad: ${cardTitle}`
        }
      }
    };

    console.log('Te verzenden Payload:', JSON.stringify(payload, null, 2));

    const response = await fetch(waafiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('WAAFiPay Response:', data);

    if (data.responseCode === '2001') {
      return NextResponse.json({ success: true, message: 'Betaling gestart!' });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: data.responseMsg || data.params?.description || 'Betaling mislukt door provider',
          fullResponse: data 
        }, 
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Interne serverfout' }, { status: 500 });
  }
}