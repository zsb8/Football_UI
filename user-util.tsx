import { prepareGetRequest, preparePostRequest } from "@/util/request-helper";

export async function signIn(username: string, password: string) {
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

export async function listUsers() {
  const list_users_url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/listusers`);
  const requestParams = prepareGetRequest();
  const response = await fetch(list_users_url, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function listTenants() {
  const list_tenants_url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/list`);
  const requestParams = prepareGetRequest();
  const response = await fetch(list_tenants_url, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function getTenantInfo() {
  const list_tenants_url = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/info`);
  const requestParams = prepareGetRequest();
  const response = await fetch(list_tenants_url, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function updateUserAttribute(userName: string, attributeName: string, attributeValue: string) {
  const updateAttributeUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/updateUserAttribute`);
  const attributUpdate = {
    userName,
    attributeName,
    attributeValue,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributUpdate));
  const response = await fetch(updateAttributeUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function updateTenant(data: any) {
  const updateAttributeUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/updateTenant`);
  const requestParams = preparePostRequest(JSON.stringify(data));
  const response = await fetch(updateAttributeUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function resetPassword(userName: string) {
  const resetPasswordUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/tenant/resetpassword`);
  const attributUpdate = {
    userName,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributUpdate));
  const response = await fetch(resetPasswordUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function createUserForTenant(tenantId: string, email: string, password: string, firstname: string, lastname: string) {
  const createUserUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/admin/user`);
  const attributCreate = {
    user: { email, password, firstname, lastname },
    tenantId,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(createUserUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function changePassword(accessToken: string, previousPassword: string, proposedPassword: string) {
  const changePasswordUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/changepassword`);
  const attributCreate = {
    accessToken,
    previousPassword,
    proposedPassword,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(changePasswordUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function signUpConfirm(username: string, confirmationcode: string) {
  const signUpConfirmUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/signUp/confirm`);
  const attributCreate = {
    username,
    confirmationcode,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(signUpConfirmUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function confirmForgotPassword(confirmationcode: string, password: string, username: string) {
  const confirmForgotPasswordUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/confirmforgotpassword`);
  const attributCreate = {
    confirmationcode,
    password,
    username,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(confirmForgotPasswordUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function updateUserDisable(username: string) {
  const confirmForgotPasswordUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/disableUser`);
  const attributCreate = {
    userName: username,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(confirmForgotPasswordUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

export async function updateUserEnable(username: string) {
  const confirmForgotPasswordUrl = new URL(`${process.env.NEXT_PUBLIC_BASE_URL_USER}/${process.env.NEXT_PUBLIC_STAGE}/enableUser`);
  const attributCreate = {
    userName: username,
  };
  const requestParams = preparePostRequest(JSON.stringify(attributCreate));
  const response = await fetch(confirmForgotPasswordUrl, requestParams);
  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message);
  }
  if (result.error) {
    throw new Error(result.message);
  }
  return result;
}

module.exports = {
  signIn,
  isAuthorized,
  listUsers,
  listTenants,
  getTenantInfo,
  updateUserAttribute,
  updateTenant,
  resetPassword,
  createUserForTenant,
  changePassword,
  signUpConfirm,
  confirmForgotPassword,
  updateUserDisable,
  updateUserEnable,
};
