// src/app/api/create-checkout-session/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { cardTitle, cardPrice, transferAmount, recipientPhone, senderPhone, provider } = body;

    const totalAmount = Number(transferAmount || 0) + Number(cardPrice || 0);
    const waafiUrl = 'https://sandbox.waafipay.com/asm';

    const cleanSenderPhone = senderPhone ? senderPhone.replace('+', '') : '';

    const payload = {
      schemaVersion: '1.0',
      requestId: 'REQ_' + Date.now(),
      timestamp: new Date().toISOString(),
      channelName: 'WEB',
      serviceName: 'API_PURCHASE',
      serviceParams: {
        merchantUid: process.of?.WAAFIPAY_MERCHANT_UID || 'merchant_test_id',
        apiUserId: process.env.WAAFIPAY_API_USER_ID || 'user_test_id',
        apiKey: process.env.WAAFIPAY_API_KEY || 'key_test',
        paymentMethod: provider || 'MW_ZAAD',
        payerInfo: {
          accountNo: cleanSenderPhone,
        },
        transactionInfo: {
          referenceId: 'REF_' + Date.now(),
          invoiceId: 'INV_' + Date.now(),
          amount: totalAmount.toFixed(2),
          currency: 'USD',
          description: `Hadiyad: ${cardTitle} + $${transferAmount} gift`,
        }
      }
    };

    const response = await fetch(waafiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const data = await response.json();
    console.log('WAAFiPay Response Full:', data);

    // Stuur de exacte responseMessage of errorCode mee terug naar de frontend
    if (data.responseCode === '2001') {
      return NextResponse.json({ 
        success: true, 
        message: 'Betaling gestart!' 
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: data.responseMessage || data.error || 'Onbekende fout van WAAFiPay',
          fullResponse: data 
        }, 
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('WAAFiPay API Error:', error);
    return NextResponse.json({ success: false, error: error.message || 'Interne serverfout' }, { status: 500 });
  }
}