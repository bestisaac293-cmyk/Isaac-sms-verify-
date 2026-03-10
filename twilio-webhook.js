const admin = require('firebase-admin');

// Initialize Firebase Admin with your service account
// Ensure your 'serviceAccountKey.json' is in the root directory
const serviceAccount = require('../serviceAccountKey.json');

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://isaacs-sms-verify-default-rtdb.firebaseio.com"
    });
}

export default async function handler(req, res) {
    // Only allow POST requests (how Twilio sends data)
    if (req.method !== 'POST') {
        return res.status(405).send('Method Not Allowed');
    }

    const { From, Body } = req.body;

    try {
        // Save the SMS data to Firebase
        await admin.database().ref('incomingSMS/').push({
            sender: From,
            message: Body,
            receivedAt: new Date().toISOString()
        });

        // Twilio expects an empty XML response to confirm receipt
        res.setHeader('Content-Type', 'text/xml');
        res.status(200).send('<Response></Response>');
    } catch (error) {
        console.error("Database Error:", error);
        res.status(500).send('Error saving message');
    }
}