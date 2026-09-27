// src/app/api/webhook/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const event = await req.json();

    // 1. Controleer of de webhook van WAAFiPay aangeeft dat de betaling succesvol is
    // (WAAFiPay gebruikt vaak '2001' of een specifieke statuscode voor geslaagde transacties)
    const isSuccess = event.responseCode === '2001' || event.status === 'COMPLETED';

    if (isSuccess) {
      const { recipientPhone, transferAmount, description } = event.params || {};

      // 2. Genereer een unieke ID voor de e-card (in productie sla je dit op in je database, bijv. Supabase of Prisma)
      const cardId = 'card_' + Math.random().toString(36).substring(2, 9);
      const uniqueCardLink = `https://hadiyadpay.com/card/${cardId}`;

      // 3. SMS SERVICE KOPPELING (Nog in te stellen)
      // Omdat je Vonage of Telnyx later gaat koppelen, vangen we dit nu zo op:
      const smsMessage = `Haye! Waxaa laguugu soo diray Hadiyad ($${transferAmount}) iyo kaar gaar ah. Riix halkan: ${uniqueCardLink}`;
      
      console.log('--- SIMULATIE SMS VERSTUREN ---');
      console.log(`Naar ontvanger: ${recipientPhone}`);
      console.log(`Bericht: ${smsMessage}`);
      console.log('-------------------------------');

      /* 
        WANNEER JE VONAGE / TELNYX KOPPELT, KOMT HIER STRAKS DIT TE STAAN:
        await fetch('https://rest.nexmo.com/sms/json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: process.env.VONAGE_API_KEY,
            api_secret: process.env.VONAGE_API_SECRET,
            to: recipientPhone,
            from: 'HadiyadPay',
            text: smsMessage
          })
        });
      */

      return NextResponse.json({ success: true, message: 'Webhook succesvol verwerkt en SMS gesimuleerd.' });
    }

    return NextResponse.json({ success: false, message: 'Transactie niet geslaagd of niet erkend.' }, { status: 400 });

  } catch (error: any) {
    console.error('Webhook Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}