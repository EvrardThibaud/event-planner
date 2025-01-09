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
    } catch (err) {
        console.error('Error while sending the email:', err.statusCode, err.response?.text);
    }
});

app.listen(PORT, () => {
    console.log(`server working on http://localhost:${PORT}`);
});
