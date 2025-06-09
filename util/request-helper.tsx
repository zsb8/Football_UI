export function preparePostRequest(bodyParams: BodyInit) {
  const request_params = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("id_token"),
    },
    referrerPolicy: "no-referrer",
  } as RequestInit;
  request_params.body = bodyParams;
  return request_params;
}

export function preparePutRequest(bodyParams: BodyInit) {
  const request_params = {
    method: "PUT",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      Authorization: localStorage.getItem("id_token"),
    },
    referrerPolicy: "no-referrer",
  } as RequestInit;
  request_params.body = bodyParams;
  return request_params;
}

export function prepareUploadRequest(uploadFields: any, file: File) {
  const request_params = {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    referrerPolicy: "no-referrer",
  } as RequestInit;

  let formData = new FormData();
  for (const name in uploadFields) {
    formData.append(name, uploadFields[name]);
  }
  formData.append("file", file);

  request_params.body = formData;
  return request_params;
}

export function prepareGetRequest() {
  const request_params = {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: localStorage.getItem("id_token"),
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  } as RequestInit;
  return request_params;
}

export function prepareDeleteRequest() {
  const request_params = {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      Authorization: localStorage.getItem("id_token"),
      "Content-Type": "application/json",
    },
    referrerPolicy: "no-referrer",
  } as RequestInit;
  return request_params;
}
