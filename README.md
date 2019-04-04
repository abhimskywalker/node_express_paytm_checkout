# node_express_paytm_checkout
Integrate Paytm Checkout to your Node.js Express based website to provide a secure, PCI-compliant way to accept Debit/Credit card, Net-Banking, UPI and Paytm wallet payments from your customers.

# Setup steps
You’ll need to have the following prerequisites before we go any further:
- A [Paytm Business](https://business.paytm.com/) account
- A [Node](https://nodejs.org) environment

### 1. Basic app setup
```bash
# clone this repo from github
git clone https://github.com/abhimskywalker/node_express_paytm_checkout.git
# navigative into the folder
cd node_express_paytm_checkout
# install the requirements
npm install
```

### 2. Get merchant credentials
- Go to https://dashboard.paytm.com/next/apikeys to get your API keys
> These API keys consists of:
> - MID (Merchant ID): Unique identifier issued to every merchant.
> - Merchant Key: This is a unique secret key used for secure encryption of every request. This needs to be kept on server side and should never be shared with anyone.
> - Industry Type ID: This is part of bank and paymode configuration done wrt to an account.
> - Website: This parameter is used to support multiple callback URLs to post the transaction response. Each URL needs to be mapped to a website parameter.
- Copy the test MERCHANT_ID and test MERCHANT_KEY for testing mode in the Staging configs section. (While production configs are commented out)
- To do actual payments you can copy the MERCHANT_ID, MERCHANT_KEY, WEBSITE_NAME and INDUSTRY_TYPE_ID from Production API details tab. (Please comment out staging configs for this) 
- Replace the variables in `app.js`

### 3. Run the app
```bash
# run the express app
node app.js
```
- Navigate to http://127.0.0.1:3000
- It will show the params that will be sent to Paytm server to initiate checkout flow including callback url (More detailed understanding available at: https://developer.paytm.com/docs/v1/payment-gateway )
- Once the transaction is done you will be redirected to http://127.0.0.1:3000/callback with checkout response params and then transaction verification API response params.
- Please note order id is auto generated based on timestamp for now. You can supply your own order details here later. Right now sample customer details (only recommended for testing) being sent as below:
```js
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
```

### 4. Monitor the transactions on merchant dashboard
- Once a transaction is done in the above flow, you can check the details at: https://dashboard.paytm.com/next/transactions
