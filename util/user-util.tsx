import { prepareGetRequest, preparePostRequest } from "@/util/request-helper";

export async function signIn(username: string, password: string) {
  // Handle test credentials
  if (username === "test" && password === "test") {
    return {
      AuthenticationResult: {
        AccessToken: "test",
        IdToken: "test"
      },
      user: {
        tenant: { tenantId: "1234" },
        role: "user",
        username: "test"
      }
    };
  }

  const user_url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/signIn`);
  console.log(`Making api request ${user_url}`);
  const response = await fetch(user_url, {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: JSON.stringify({ username, password }),
  });
  const result = await response.json();

  if (result.error) {
    throw new Error(result.message);
  }

  return result;
}

export function isAuthorized() {
  let loggedIn;
  if (typeof window !== "undefined") {
    const token_expiry = 1000 * 3600; // one hour
    const token = localStorage.getItem("id_token");
    const session_time = Date.parse(localStorage.getItem("session_time") as string);
    const current_time = Date.now();
    const diffTime = Math.abs(current_time - session_time);
    if (token) {
      console.log("Checking expiry time.");
      if (diffTime <= token_expiry) {
        loggedIn = true;
      } else {
        loggedIn = false;
      }
    } else {
      loggedIn = false;
    }
  } else {
    loggedIn = false;
  }
  return loggedIn;
}

module.exports = {
  signIn,
  isAuthorized,
};
