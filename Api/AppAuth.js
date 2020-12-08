import { log } from "react-native-reanimated";

const { db_auth, db_store } = require("./Db");
const requestResult = (hasError, dataReceived) => {
  const status = { error: hasError, data: dataReceived };
  return status;
};
export const registerUser = async (userInfo) => {
  const requestStatus = { error: true, data: "" };
  console.log(userInfo);

  try {
    await db_auth
      .createUserWithEmailAndPassword(userInfo.email, userInfo.password)
      .then(async (data) => {
        const user = data.user;
        await db_store
          .collection("users")
          .doc(user.uid)
          .set({
            avatar: '',
            userName: userInfo.name,
            expoToken:'null',
            userId: user.uid,
            company: userInfo.company,
            email: userInfo.email,
            phoneNumber: userInfo.phoneNumber
              ? userInfo.phoneNumber
              : "not given",
            type: "user",
          });
      });
    return requestResult(false, "user");
  } catch (error) {
    console.log("create user error", error);
    return requestResult(true, error.message);
  }
};

export const loginUser = async (userInfo) => {
  const requestStatus = { error: true, data: "" };

  try {
    const result = await db_auth.signInWithEmailAndPassword(
      userInfo.email,
      userInfo.password
    );

    return requestResult(false, "user");
  } catch (error) {
    return requestResult(true, error.message);
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
