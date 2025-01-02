const express = require('express');
const cors = require('cors');
const Mailjet = require('node-mailjet');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const mailjet = Mailjet.apiConnect(
    '5a1e5a4e5a8c32c044fd53f7b095f1ea', // API Key
    '1052cd416041d3ddb900bb0939cbadd7'  // Secret Key
);

app.post('/send-email', async (req, res) => {
    const { from, to, subject, HTMLPart } = req.body; 
    console.log(from);

    try {
        const request = mailjet.post('send', { version: 'v3.1' }).request({
            Messages: [
                {
                    From: {
                        Email: from.email,
                        Name: from.name,
                    },
                    To: [
                        {
                            Email: to.email,
                            Name: to.name,
                        },
                    ],
                    Subject: subject,
                    HTMLPart: HTMLPart,
                },
            ],
        });

        const result = await request;
        console.log('Email envoyé avec succès:', result.body);
        res.status(200).json({ message: 'Email sent successfully', data: result.body });
    } catch (err) {
        console.error('Erreur lors de l\'envoi de l\'e-mail:', err.statusCode, err.response?.text);
        res.status(500).json({ message: 'Failed to send email', error: err.response?.text || err.message });
    }
});

app.listen(PORT, () => {
    console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
