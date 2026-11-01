const admin = require("firebase-admin");

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault()
  });
}

const db = admin.firestore();

exports.handler = async (event) => {
  const headers = {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
  };

  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Method not allowed" })
    };
  }

  try {
    const token = event.headers.authorization || "";

    if (!token.startsWith("Bearer ")) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: "Authentication required" })
      };
    }

    const decoded = await admin.auth().verifyIdToken(
      token.substring(7)
    );

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
        uid,
        balanceMinor: 0,
        currency: "NGN",
        environment: "sandbox",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      };

      transaction.create(walletRef, wallet);

      return {
        created: true,
        wallet
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
    console.error("Wallet creation error:", error);

    return {
      statusCode: 401,
      headers,
      body: JSON.stringify({
        error: "Unable to create wallet"
      })
    };
  }
};

