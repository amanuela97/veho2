const functions = require('firebase-functions');
const admin = require('firebase-admin');
const fetch = require('node-fetch');
admin.initializeApp();
const db = admin.firestore();

var expires_in = null;
var token = null;

exports.scheduledBatteryChecker = functions.pubsub
  .schedule("every 15 minutes")
  .onRun(async (context) => {
    try {
      const update = await db
        .collection("vehicle")
        .where("soc", "==", "100")
        .get();
      if (update[0] && update !== undefined) {
        const lema = update.forEach(async (vehicle) => {
          const vehicleD = vehicle.data();
          if (vehicleD.assigned === true) {
            const vh = vehicleD.ownerId;
            const user = await db.collection("users").doc(vh).get();
            const token = user.data().expoToken;
            if (token.length > 20) {
              const message = {
                to: token,
                title: "vehoGO charger",
                body: "your vehicle is fully charged",
                sound: "default",
              };
 
              fetch("https://exp.host/--/api/v2/push/send", {
                method: "POST",
                headers: {
                  Accept: "application/json",
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(message),
              });
            }
          }
        });
      }
    } catch (e) {
      console.log(e);
    }
  });


exports.chargerListener = functions.firestore
  .document("veho/{id}")
  .onWrite(async (change, context) => {
    try {
      const vehicle = await db
        .collection("queue")
        .doc("vehoAirportQueue")
        .get();
      const queue = await vehicle.data().queue;
      console.log("the queue", queue);
      const charger = await db
        .collection("veho")
        .where("status", "==", "free")
        .limit(1)
        .get();
      if (charger.docs[0] && queue.length > 0) {
        const chargerData = charger.docs[0].data();
        const vehicleId = queue[0];
        console.log("vid", vehicleId);
        const data = await db
          .collection("queue")
          .doc("vehoAirportQueue")
          .update({
            queue: admin.firestore.FieldValue.arrayRemove(vehicleId),
          });

        const vehicle = await db.collection("vehicle").doc(vehicleId).update({
          queue: false,
          assigned: false,
          waitingConfirmation: true,
          chargerName: chargerData.name,
          chargerId: chargerData.id,
          position: 0,
          time: admin.firestore.Timestamp.now().seconds,
        });
        const updateCharger = await db
          .collection("veho")
          .doc(chargerData.id)
          .update({
            status: "busy",
            currentUserId: "null",

            currentUsername: "null",
            chargingVehicleId: vehicleId,
            chargingVehicleName: "null",
          });

        const vehicleD = await db.collection("vehicle").doc(vehicleId).get();
        const vh = vehicleD.data().ownerId;
        console.log(vh);
        const user = await db.collection("users").doc(vh).get();
        const usr = user.data().expoToken;
        const message = {
          to: usr,
          title: "vehoGO charger",
          body: "you have been assigned to a charger, please accept it",
          sound: "default",
        };

        fetch("https://exp.host/--/api/v2/push/send", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(message),
        });
        console.log("tokeeeeeeen", usr);
      }
    } catch (error) {
      console.log(error);
    }
});

exports.queueListener = functions.firestore
  .document("queue/vehoAirportQueue")
  .onWrite(async (change, context) => {
    console.log("queue,updated");
    try {
      const vehicle = await db
        .collection("queue")
        .doc("vehoAirportQueue")
        .get();
      const queue = await vehicle.data().queue;
      if (queue.length > 0) {
        queue.forEach(async (vehicleId) => {
          const index = queue.indexOf(vehicleId) + 1;
          const vehicle = await db.collection("vehicle").doc(vehicleId).update({
            queue: true,
            assigned: false,
            waitingConfirmation: false,
            chargerName: "null",
            chargerId: "null",
            position: index,
            time: "null",
          });
        });
      }
    } catch (e) {
      console.log(e);
    }
  });

  

exports.scheduledFunction = functions.pubsub
  .schedule("*/5 * * * *")
  .onRun( async (context) => {
   
  
  console.log("caledddddd");
  try {
    await fetchUpdatedValues();
    const now = await admin.firestore.Timestamp.now().seconds;
    const vehicle = await db
      .collection("vehicle")
      .where("waitingConfirmation", "==", true)
      .get();

    if (vehicle.docs[0]) {
      vehicle.forEach(async (element) => {
        const vehicleData = element.data();
        const vehTime = vehicleData.time;
        const timeDiff = (now - vehTime) / 60;
        console.log("timeee", timeDiff);
        if (timeDiff > 5) {
          const vehicle = await db
            .collection("vehicle")
            .doc(vehicleData.vehicleId)
            .update({
              queue: false,
              assigned: false,
              waitingConfirmation: false,
              chargerName: "null",
              chargerId: "null",
              position: 0,
              time: "null",
            });

          const updateCharger = await db
            .collection("veho")
            .doc(vehicleData.chargerId)
            .update({
              status: "free",
              currentUserId: "null",

              currentUsername: "null",
              chargingVehicleId: "null",
              chargingVehicleName: "null",
            });
        }
      });
    }
  } catch (e) {
    console.log(e);
  } 


    return null;
  }); 



const fetchUpdatedValues = async () =>{
    await db.collection('vehicle').get().then( async (querySnapshot) => {
        querySnapshot.forEach(async (doc) => {
            if(doc.data().connected){

                // check if token has expired
                if(parseInt(Date.now()) >= parseInt(expires_in) || expires_in == null ){
                  console.log('token has expired or hasnt been generated, refreshing token');
                  await fetchToken();
                }
                var info = await fetchCarDetails(token,doc.id);
                // update vehicle info
                doc.ref.update({
                    batteryState: info.batteryState,
                    chargingStatus: info.chargingStatus,
                    endOfChargeTime: info.endofchargetime,
                    chargingActive: info.chargingActive,
                    soc: info.soc,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                });
            }
        });
    });
};

const fetchCarDetails = async (token, vin) =>{
    
    var requestOptions = {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`,
      },
      redirect: 'follow'
    };
    
    var info = await fetch(`https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/${vin}`, requestOptions)
      .then(response => response.json())
      .then(result => result.items)
      .catch(error =>  undefined);

    return info
};

const fetchToken = async () =>{
    
    let params = {
        "grant_type": "password",
        "username": "vehogo@veho.fi",
        "password": "Vehogoshare1234!",
    };

    let query = Object.keys(params)
                   .map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k]))
                   .join('&');
    
    var requestOptions = {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Authorization": "Basic cGFydG5lci1hcGktMUQwMzFCRTM3ODNCNDkwM0JBRDYwRDgxNzJFRDYyNUU6VEJRUTcyNUlVRlJQVk5VS0FNUTg="
      },
      body: query,
      redirect: 'follow'
    };

   
    
    var tokenn = await fetch("https://api.connect-business.net/fleet/v1/oauth/token", requestOptions)
      .then(response => response.json())
      .then(result =>  result)
      .catch(error => console.log('error', error));
    
    try{
      var expires_inn = parseInt(Date.now()) + (parseInt(tokenn.expires_in) * 1000);
      expires_in = expires_inn.toString()
      token = tokenn.access_token.toString()
    }catch(e){
      console.log(e);
    }
};
