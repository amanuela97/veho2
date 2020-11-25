import { log } from "react-native-reanimated";

const { db_auth, db_store } = require("./Db");

export const registerUser = async (userInfo) => {
  const requestStatus = { error: true, data: "" };
  console.log(userInfo);

  try {
    const result = await db_auth.createUserWithEmailAndPassword(
      userInfo.email,
      userInfo.password
    );

    if (result.user) {
      const user = result.user;

      try {
        const userDoc = db_store.collection("users").doc(user.uid);
        userDoc.set({
          userName: userInfo.name,
          userId: user.uid,
          company: userInfo.company,
          email: userInfo.email,
          phoneNumber: userInfo.phoneNumber
            ? userInfo.phoneNumber
            : "not given",
          type: "user",
        });
      } catch (error) {
        console.log("create user error", error);
        requestStatus.data = error[0] ? error[0] : "error to create the user";
        return requestStatus;
      }
    }
    requestStatus.error = false;
    requestStatus.data = result.user;
    return requestStatus;
  } catch (error) {
    console.log("error on auth", error);
    console.log("error on auth", error.message);
    requestStatus.data = error.message
      ? error.message
      : "error to create the user";
    return requestStatus;
  }
};

export const loginUser = async (userInfo) => {
  const requestStatus = { error: true, data: "" };

  try {
    const result = await db_auth.signInWithEmailAndPassword(
      userInfo.email,
      userInfo.password
    );
    requestStatus.error = false;
    requestStatus.data = result.user;
    return requestStatus;
  } catch (error) {
    requestStatus.error = true;
    requestStatus.data = "Invalid login credential";
    return requestStatus;
  }
};

/* const getData = async () => {


      const docu = await db_store.collection("veho").doc();
      const docuQ = await db_store
        .collection("queue")
        .doc(docu.id)
        .set({
          type:'charger',
          id:docu.id,
          name:'charger three',
          comment:{userId:[{'comment':'am waiting','time':'12:30','userName':'beselam'}]},
          queue: [
            { userName: "lom", userId: "34123455" },
            { userName: "chaa", userId: "23123455" },
            { userName: "moam", userId: "1223233455" },
          ],
          })
     
    }; */
