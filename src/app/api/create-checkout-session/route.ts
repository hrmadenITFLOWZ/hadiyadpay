// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

function formatWaafiPhone(phone: string): string {
  if (!phone) return '';
  let cleaned = phone.replace(/\D/g, ''); // Verwijder alle niet-cijfers
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }
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
    const formattedSenderPhone = formatWaafiPhone(senderPhone);

    // Officiële WAAFiPay API_PURCHASE payload structuur
    const payload = {
      schemaVersion: '1.0',
      requestId: 'REQ_' + Date.now(),
      timestamp: new Date().toISOString().replace(/T/, ' ').replace(/\..+/, ''), // YYYY-MM-DD HH:mm:ss formaat
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid: process.env.WAAFIPAY_MERCHANT_UID || 'merchant_test_id',
        apiUserId: process.env.WAAFIPAY_API_USER_ID || 'user_test_id',
        apiKey: process.env.WAAFIPAY_API_KEY || 'key_test',
        paymentMethod: 'MWALLET_ACCOUNT',
        payerInfo: {
          accountNo: formattedSenderPhone
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

    console.log('Final WAAFiPay Payload:', JSON.stringify(payload, null, 2));

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