import * as SecureStore from 'expo-secure-store';

export const fetchToken = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append(
    "Authorization",
    "Basic cGFydG5lci1hcGktMUQwMzFCRTM3ODNCNDkwM0JBRDYwRDgxNzJFRDYyNUU6VEJRUTcyNUlVRlJQVk5VS0FNUTg="
  );

  let params = {
    grant_type: "password",
    username: "vehogo@veho.fi",
    password: "Vehogoshare1234!",
  };

  let query = Object.keys(params)
    .map((k) => encodeURIComponent(k) + "=" + encodeURIComponent(params[k]))
    .join("&");

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: query,
    redirect: "follow",
  };

  var token = await fetch(
    "https://api.connect-business.net/fleet/v1/oauth/token",
    requestOptions
  ).then((response) => response.json())
    .then((result) => result)
    .catch((error) => console.log("error", error));

    try{
      var expires_in = parseInt(Date.now()) + (parseInt(token.expires_in) * 1000);
      await SecureStore.setItemAsync(
        'token',
        token.access_token.toString()
      );
      await SecureStore.setItemAsync(
        'expires_in',
        expires_in.toString()
      );
    }catch(e){
      console.log(e);
    }
};

export const fetchCarDetails = async (token, vin) => {
  var myHeaders = new Headers();
  myHeaders.append("Authorization", `Bearer ${token}`);

  var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
  };

  var info = await fetch(
    `https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.dynamic/${vin}`,
    requestOptions
  )
    .then((response) => response.json())
    .then((result) => result.items)
    .catch((error) => undefined);

  return info;
};

export const fetchVin = async (plate, token) => {
  const headers = {
    "Cache-Control": "no-cache",
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
  };

  const requestOptions = {
    method: "GET",
    withCredentials: true,
    headers,
  };

  const res = await fetch(
    `https://api.connect-business.net/fleet/v1/fleets/1A3D13CCC6694F03ADBC1BC6CFADCB4B/vehicles.snapshots?_filter=licensePlate=eq=${plate}`,
    requestOptions
  ) 
  .then(response => response.json())
  .then(result => result.items[0].vin)
  .catch(error =>  undefined);

  return res
};