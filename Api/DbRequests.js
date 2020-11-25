import { db_auth, db_store } from "./Db";
import firebase from "firebase";

const requestResult = (hasError, dataReceived) => {
  const status = { error: hasError, data: dataReceived };
  return status;
};

export const getChargers = async () => {
  try {
    console.log("request to chargers");
    const collection = [];
    const result = await db_store.collection("veho").get();
    result.docs.map((doc) => {
      collection.push(doc.data());
    });

    return requestResult(false, collection);
  } catch (error) {
    return requestResult(true, "error getting data");
  }
};

export const getCharger = async (chargerId) => {
  try {
    console.log("request to a charger");
    const result = await db_store.collection("veho").get(chargerId);
    result.docs.map((doc) => {
      return requestResult(false, doc.data());
    });
  } catch (error) {
    return requestResult(true, "error getting data");
  }
};

export const createQueue = async (userId, userName, chargerId) => {
  try {
    console.log("request to queue");
    const data = await db_store
      .collection("veho")
      .doc(chargerId)
      .update({
        queue: firebase.firestore.FieldValue.arrayUnion({
          userId: userId,
          userName: userName,
        }),
      });
    return requestResult(false, "updated");
  } catch (error) {
    console.log("error while queue", error.message);
    return requestResult(true, "unable to create a queue");
  }
};

export const cancelQueue = async (chargerId, queue) => {
  try {
    console.log("request to cancel queue");
    const data = await db_store
      .collection("veho")
      .doc(chargerId)
      .update({
        queue: firebase.firestore.FieldValue.arrayRemove(queue),
      });
    return requestResult(false, "removed");
  } catch (error) {
    console.log("error while removing", error.message);
    return requestResult(true, "unable to remove a queue");
  }
};

export const updateUsername = async (userInfo, userId) => {
  try {
    console.log("request to update user info");
    const update = await db_store.collection("users").doc(userId).update({
      userName: userInfo,
    });
    const data = await db_store.collection("users").doc(userId).get();
    return requestResult(false, data.data());
  } catch (error) {
    console.log("error while updating", error.message);
    return requestResult(true, "unable to update");
  }
};

export const updatePhoneNumber = async (userInfo, userId) => {
  try {
    console.log("request to update user info");
    const update = await db_store.collection("users").doc(userId).update({
      phoneNumber: userInfo,
    });
    const data = await db_store.collection("users").doc(userId).get();
    return requestResult(false, data.data());
  } catch (error) {
    console.log("error while updating", error.message);
    return requestResult(true, "unable to update");
  }
};

export const updatePassword = async (userInfo) => {
  try {
    console.log("request to change password info");
    const update = await db_auth.currentUser.updatePassword(userInfo);
    // const data = await db_store.collection("users").doc(userId).get();
    return requestResult(false, update);
  } catch (error) {
    console.log("error while updating", error.message);
    return requestResult(true, error.message);
  }
};
