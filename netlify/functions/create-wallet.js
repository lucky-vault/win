const admin = require("firebase-admin");

const headers = {
  "Content-Type": "application/json",
  "Cache-Control": "no-store"
};

// Initialize Firebase Admin securely.
if (!admin.apps.length) {
  const serviceAccountJson =
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!serviceAccountJson) {
    throw new Error("Firebase credentials are not configured.");
  }

  const serviceAccount = JSON.parse(serviceAccountJson);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({
        error: "Method not allowed"
      })
    };
  }

  try {
    const authorization =
      event.headers.authorization ||
      event.headers.Authorization ||
      "";

    if (!authorization.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({
          error: "Authentication required"
        })
      };
    }

    const idToken = authorization.substring(7);

    const decoded = await admin.auth().verifyIdToken(idToken);

    const uid = decoded.uid;

    const walletRef = db.collection("wallets").doc(uid);

    const result = await db.runTransaction(async (transaction) => {
      const existing = await transaction.get(walletRef);

      if (existing.exists) {
        return {
          created: false,
          wallet: existing.data()
        };
      }

      const wallet = {
        uid: uid,
        balanceMinor: 0,
        currency: "NGN",
        environment: "sandbox",
        createdAt:
          admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.create(walletRef, wallet);

      return {
        created: true,
        wallet: wallet
      };
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        created: result.created,
        wallet: {
          uid: result.wallet.uid,
          balanceMinor: result.wallet.balanceMinor,
          currency: result.wallet.currency,
          environment: result.wallet.environment
        }
      })
    };

  } catch (error) {
    console.error("Wallet function error:", error);

    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: "Unable to create wallet"
      })
    };
  }
};
