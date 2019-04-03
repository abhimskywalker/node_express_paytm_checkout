// Below keys from https://dashboard.paytm.com/next/apikeys
// Staging configs:
const MERCHANT_ID = "cqxpFk55774655560618";
const MERCHANT_KEY = "4a%G!gRDQrao6eC1";
const WEBSITE_NAME = "WEBSTAGING";
const INDUSTRY_TYPE_ID = "Retail";
const BASE_URL = "https://securegw-stage.paytm.in";
// Production:
// const MERCHANT_ID = "<MERCHANT_ID>";
// const MERCHANT_KEY = "<MERCHANT_KEY>";
// const WEBSITE_NAME = "<WEBSITE_NAME>";
// const INDUSTRY_TYPE_ID = "<INDUSTRY_TYPE_ID>";
// const BASE_URL = "https://securegw.paytm.in";

const app = require("express")();
const port = 3000;
const paytm_checksum = require('./paytm_checksum');
const Request = require("request");

app.set("view engine", "pug");
app.use(require("body-parser").urlencoded({extended: false}));

app.get('/', (req, res) => {
    let amount = 11.01;
    let transactionData = {
        MID: MERCHANT_ID,
        WEBSITE: WEBSITE_NAME,
        INDUSTRY_TYPE_ID: INDUSTRY_TYPE_ID,
        ORDER_ID: `007${Date.now()}`,
        CUST_ID: '007',
        TXN_AMOUNT: amount.toString(),
        CHANNEL_ID: 'WEB',
        MOBILE_NO: '7777777777',
        EMAIL: 'example@paytm.com',
        CALLBACK_URL: `http://127.0.0.1:${port}/callback`
    };
    let url = BASE_URL + '/theia/processTransaction';
    // Generate checksum hash and render template in callback
    paytm_checksum.genchecksum(transactionData, MERCHANT_KEY, (error, encryptedParams) => {
        console.log(`Request params:`, encryptedParams);
        res.render("index.pug", {data: encryptedParams, url: url});
    });
});

app.post('/callback', (req, res) => {
    // log the callback response payload returned:
    let callbackResponse = req.body;
    console.log('Transaction response: ', callbackResponse);

    // verify callback response checksum:
    let checksumVerification = paytm_checksum.verifychecksum(callbackResponse, MERCHANT_KEY);
    console.log('checksum_verification_status: ', checksumVerification);

    // verify transaction status:
    let transactionVerifyPayload = {
        MID: callbackResponse.MID,
        ORDERID: callbackResponse.ORDERID,
        CHECKSUMHASH: callbackResponse.CHECKSUMHASH
    };
    let url = BASE_URL + '/order/status';
    Request.post({url: url, body: JSON.stringify(transactionVerifyPayload)}, (error, resp, body) => {
        let verificationResponse = JSON.parse(body);
        console.log('Verification response: ', verificationResponse);
        res.render('callback.pug', {
            callbackResponse: callbackResponse,
            checksumVerification: checksumVerification,
            verificationResponse: verificationResponse
        });
    });
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
