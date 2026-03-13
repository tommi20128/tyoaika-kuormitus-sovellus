const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.createEmployee = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "User must be logged in"
    );
  }

  const { email, password, firstName, lastName, title, manager } = data;

  try {

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password
    });

    await admin.firestore().collection("users").doc(userRecord.uid).set({
      uid: userRecord.uid,
      firstName: firstName,
      lastName: lastName,
      email: email,
      title: title,
      manager: manager,
      role: "employee",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { success: true };

  } catch (error) {
    throw new functions.https.HttpsError("internal", error.message);
  }

});