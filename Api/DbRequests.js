import { db_auth, db_store } from "./Db";
import firebase, { firestore } from "firebase";
import { fetchToken, fetchCarDetails, fetchVin } from "../Api/CarApi";
import * as SecureStore from "expo-secure-store";

const requestResult = (hasError, dataReceived) => {
  const status = { error: hasError, data: dataReceived };
  return status;
};

export const getChargers = async () => {
  try {
    const user = await db_store
      .collection("users")
      .doc(db_auth.currentUser.uid)
      .get();
    const company = await user.data().company;
    const collection = [];
    const result = await db_store
      .collection("veho")
      .where("company", "==", company)
      .get();
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
    const result = await db_store.collection("veho").get(chargerId);
    result.docs.map((doc) => {
      return requestResult(false, doc.data());
    });
  } catch (error) {
    return requestResult(true, "error getting data");
  }
};

export const getCompanyList = async () => {
  try {
    const collection = [];
    const result = await db_store.collection("company").get();
    result.docs.map((doc) => {
      collection.push(doc.data());
    });

    return requestResult(false, collection);
  } catch (error) {
    return requestResult(true, "error getting company data");
  }
};

export const getUserData = async () => {
  try {
    const result = await db_store
      .collection("users")
      .doc(db_auth.currentUser.uid)
      .get();
    const user = await result.data();
    return requestResult(false, user);
  } catch (error) {
    return requestResult(true, "error getting data");
  }
};

export const createQueue = async (userId, userName, chargerId) => {
  try {
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
    return requestResult(true, "unable to create a queue");
  }
};

export const updateUsername = async (userInfo, userId) => {
  try {
    const update = await db_store.collection("users").doc(userId).update({
      userName: userInfo,
    });
    const data = await db_store.collection("users").doc(userId).get();
    return requestResult(false, data.data());
  } catch (error) {
    return requestResult(true, "unable to update");
  }
};

export const updatePhoneNumber = async (userInfo, userId) => {
  try {
    const update = await db_store.collection("users").doc(userId).update({
      phoneNumber: userInfo,
    });
    const data = await db_store.collection("users").doc(userId).get();
    return requestResult(false, data.data());
  } catch (error) {
    return requestResult(true, "unable to update");
  }
};
export const setUserToken = async (userInfo, userId) => {
  try {
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
    const update = await db_auth.currentUser.updatePassword(userInfo);
    return requestResult(false, update);
  } catch (error) {
    return requestResult(true, error.message);
  }
};

export const handleAddCar = async (vehicleInfo, picker) => {
  try {
    // check if token has expired
    var expires_in = await SecureStore.getItemAsync("expires_in");
    if (parseInt(Date.now()) >= parseInt(expires_in) || !expires_in) {
      console.log(
        "token has expired or hasnt been generated, refreshing token"
      );
      await fetchToken();
    }
    var token = await SecureStore.getItemAsync("token");

    //fetch vin if liecensePlate was provided
    var vin = vehicleInfo.vin;
    if (picker === "licensePlate") {
      vin = await fetchVin(vehicleInfo.licensePlate, token);
    }
    var carInfo = await fetchCarDetails(token, vin);

    var user = db_auth.currentUser;
    const data = { carInfo: carInfo, vin: vin };
    return requestResult(false, data);
  } catch (e) {
    return requestResult(true, "unable to add the vehicle");
  }
};

export const addVehicle = async (
  vehicleInfo,
  vin,
  carInfo,
  user,
  connected
) => {
  try {
    const vehicle = await db_store.collection("vehicle").doc();

    const vehicleData = await vehicle.set({
      vin: vin ? vin : vehicleInfo.licensePlate,
      name: vehicleInfo.vehicle,
      vehicleId: vehicle.id,
      ownerId: user,
      connected: connected,
      otherInfo: "null",
      assigned: false,
      batteryState: carInfo ? carInfo.batteryState : "null",
      chargerId: "null",
      chargerName: "null",
      chargingActive: false,
      chargingStatus: carInfo ? carInfo.chargingStatus : "null",
      endOfChargeTime: carInfo ? carInfo.endofchargetime : "null",
      position: "0",
      queue: false,
      soc: carInfo ? carInfo.soc : "null",
      plateNumber: vehicleInfo.licensePlate ? vehicleInfo.licensePlate : "null",
      waitingConfirmation: false,
      timestamp: firestore.FieldValue.serverTimestamp(),
    });
    return requestResult(false, vehicleData);
  } catch (error) {
    return requestResult(true, "unable to add the vehicle");
  }
};

export const getVehicles = async () => {
  try {
    var userId = db_auth.currentUser.uid;
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
      .where("company", "==", user.company)
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
        .doc(user.company)
        .update({
          queue: firebase.firestore.FieldValue.arrayUnion(vehicle.vehicleId),
        });

      return requestResult(false, "updated");
    }
  } catch (error) {
    return requestResult(true, "unable to create a queue");
  }
};

export const getQueueList = async () => {
  try {
    const user = await db_store
      .collection("users")
      .doc(db_auth.currentUser.uid)
      .get();
    const company = await user.data().company;
    const vehicle = await db_store.collection("queue").doc(company).get();
    const queue = await vehicle.data().queue;

    return requestResult(false, queue);
  } catch (error) {
    return requestResult(true, error.message);
  }
};

export const cancelQueue = async (vehicle, user) => {
  try {
    if (vehicle.queue && !vehicle.assigned) {
      const data = await db_store
        .collection("queue")
        .doc(user.company)
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

export const addCharger = async (
  chargerInfo,
  vin,
  carInfo,
  user,
  connected
) => {
  try {
    console.log("request to add Vehicle");
    const vehicle = await db_store.collection("veho airport").doc();

    const vehicleData = await vehicle.set({});
    console.log("adeddd");
    return requestResult(false, vehicleData);
  } catch (error) {
    console.log("unable to add vehicle", error.message);
    return requestResult(true, "unable to add the vehicle");
  }
};
