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
  )
    .then((response) => response.json())
    .then((result) => result.access_token.toString())
    .catch((error) => console.log("error", error));

  return token;
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
