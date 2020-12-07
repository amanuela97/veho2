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

export const getUserData = async () => {
  try {
    console.log("request to a charger", db_auth.currentUser.uid);
    const result = await db_store
      .collection("users")
      .doc(db_auth.currentUser.uid)
      .get();
    return requestResult(false, result.data());
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

/* export const cancelQueue = async (chargerId, queue) => {
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
 */
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
export const setUserToken = async (userInfo, userId) => {
  try {
    console.log("request to update user info");
    const token = await db_store.collection("users").doc(userId).update({
      expoToken: userInfo,
    });

    return requestResult(false, token);
  } catch (error) {
    console.log("error while saving token", error.message);
    return requestResult(true, "unable save token");
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

export const addVehicle = async (vehicleInfo) => {
  try {
    console.log("request to add Vehicle");
    const vehicle = await db_store.collection("vehicle").doc();

    const vehicleData = await vehicle.set({
      vin: vehicleInfo.vin,
      name: vehicleInfo.vehicleName,
      vehicleId: vehicle.id,
      ownerId: vehicleInfo.ownerId,
      connected: false,
      otherInfo: "null",
      assigned: false,
      batteryState: "null",
      chargerId: "null",
      chargerName: "null",
      chargingActive: false,
      chargingStatus: "null",
      endOfChargeTime: "null",
      position: "0",
      queue: false,
      soc: "null",
      plateNumber: "null",
      waitingConfirmation: false,
    });
    return requestResult(false, vehicleData);
  } catch (error) {
    console.log("unable to add vehicle", error.message);
    return requestResult(true, "unable to add the vehicle");
  }
};

export const getVehicles = async () => {
  try {
    userId = db_auth.currentUser.uid;
    const vehicles = [];
    const vehicle = await db_store
      .collection("vehicle")
      .where("ownerId", "==", userId)
      .get();
    await vehicle.forEach((doc) => {
      const data = doc.data();
      vehicles.push(data);
    });

    return requestResult(false, vehicles);
  } catch (error) {
    console.log("error while getting vehicles", error.message);
    return requestResult(true, error.message);
  }
};

export const deleteVehicle = async (item) => {
  try {
    const vehicle = await db_store
      .collection("vehicle")
      .doc(item.vehicleId)
      .delete();
    const data = await getVehicles();
    return requestResult(false, data.data);
  } catch (error) {
    console.log("error while deleting", error.message);
    return requestResult(true, "error deleting vehicle");
  }
};

export const createChargingQueue = async (vehicle, user) => {
  try {
    console.log("request to queue");
    const freeCharger = await db_store
      .collection("veho")
      .where("status", "==", "free")
      .limit(1)
      .get();
    if (freeCharger.docs[0]) {
      const charger = freeCharger.docs[0].data();
      const data = await db_store.collection("veho").doc(charger.id).update({
        status: "busy",
        currentUserId: user.userId,

        currentUsername: user.userName,
        chargingVehicleId: vehicle.vehicleId,
        chargingVehicleName: vehicle.name,
      });
      const request = await updateVehicleSingleInfo(
        vehicle.vehicleId,
        false,
        true,
        false,
        charger.name,
        charger.id,
        0
      );
      return requestResult(false, request);
    } else {
      const data = await db_store
        .collection("queue")
        .doc("vehoAirportQueue")
        .update({
          queue: firebase.firestore.FieldValue.arrayUnion(vehicle.vehicleId),
        });

      return requestResult(false, "updated");
    }
  } catch (error) {
    console.log("error while queue", error.message);
    return requestResult(true, "unable to create a queue");
  }
};

export const getQueueList = async () => {
  try {
    const vehicle = await db_store
      .collection("queue")
      .doc("vehoAirportQueue")
      .get();
    const queue = await vehicle.data().queue;

    return requestResult(false, queue);
  } catch (error) {
    console.log("error while getting vehicles", error.message);
    return requestResult(true, error.message);
  }
};

export const cancelQueue = async (vehicle) => {
  try {
    if (vehicle.queue && !vehicle.assigned) {
      const data = await db_store
        .collection("queue")
        .doc("vehoAirportQueue")
        .update({
          queue: firebase.firestore.FieldValue.arrayRemove(vehicle.vehicleId),
        });
      const update = await updateVehicleSingleInfo(
        vehicle.vehicleId,
        false,
        false,
        false,
        "null",
        "null",
        0
      );
      return requestResult(false, "removed");
    } else if (
      (vehicle.assigned || vehicle.waitingConfirmation) &&
      !vehicle.queue
    ) {
      const update = await updateVehicleSingleInfo(
        vehicle.vehicleId,
        false,
        false,
        false,
        "null",
        "null",
        0
      );
      const clearCharger = await db_store
        .collection("veho")
        .doc(vehicle.chargerId)
        .update({
          status: "free",
          currentUserId: "null",

          currentUsername: "null",
          chargingVehicleId: "null",
          chargingVehicleName: "null",
        });

      return requestResult(false, "removed");
    }
  } catch (error) {
    console.log("error while removing", error.message);
    return requestResult(true, "unable to remove a queue");
  }
};
export const updateVehicle = async (vehicleId, vehicleInfo) => {
  try {
    const vehicle = await db_store
      .collection("vehicle")
      .doc(vehicleId)
      .update(vehicleInfo);
    return requestResult(false, vehicle);
  } catch (error) {
    console.log("error while getting vehicles", error.message);
    return requestResult(true, error.message);
  }
};

export const updateVehicleSingleInfo = async (
  vehicleId,
  onQueue,
  isAssigned,
  confirmation,
  chargerAssigned,
  id,
  pos
) => {
  try {
    const vehicle = await db_store.collection("vehicle").doc(vehicleId).update({
      queue: onQueue,
      assigned: isAssigned,
      waitingConfirmation: confirmation,
      chargerName: chargerAssigned,
      chargerId: id,
      position: pos,
    });

    return requestResult(false, vehicle);
  } catch (error) {
    console.log("error while updating vehicles", error.message);
    return requestResult(true, error.message);
  }
};

export const chargerListener = async (list) => {
  try {
    const vehicle = await db_store
      .collection("queue")
      .doc("vehoAirportQueue")
      .get();
    const queue = await vehicle.data().queue;
    const charger = await db_store
      .collection("veho")
      .where("status", "==", "free")
      .limit(1)
      .get();
    if (charger.docs[0] && queue.length > 0) {
      const chargerData = charger.docs[0].data();
      const vehicleId = queue[0];
      const data = await db_store
        .collection("queue")
        .doc("vehoAirportQueue")
        .update({
          queue: firebase.firestore.FieldValue.arrayRemove(vehicleId),
        });

      const updateVehicleData = await updateVehicleSingleInfo(
        vehicleId,
        false,
        false,
        true,
        chargerData.name,
        chargerData.id,
        0
      );
      const updateCharger = await db_store
        .collection("veho")
        .doc(chargerData.id)
        .update({
          status: "busy",
          currentUserId: "null",

          currentUsername: "null",
          chargingVehicleId: vehicleId,
          chargingVehicleName: "null",
        });
    }
  } catch (error) {
    console.log(error);
  }
};
