// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mailjet = require('node-mailjet').apiConnect(
    '5a1e5a4e5a8c32c044fd53f7b095f1ea', // API Key
    '1052cd416041d3ddb900bb0939cbadd7'  // Secret Key
);

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/send-email', (req, res) => {
    const { title, email, content } = req.body;

    mailjet.post('send', { version: 'v3.1' }).request({
        Messages: [
            {
                From: {
                    Email: 'webprojecteventplanner@gmail.com',
                    Name: 'Event Planner'
                },
                To: [
                    {
                        Email: email,
                        Name: 'Recipient'
                    }
                ],
                Subject: title,
                TextPart: content,
                HTMLPart: `<h3>${content}</h3>`
            }
        ]
    })
    .then(result => {
        res.status(200).send({ success: true, data: result.body });
    })
    .catch(err => {
        res.status(500).send({ success: false, error: err });
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
