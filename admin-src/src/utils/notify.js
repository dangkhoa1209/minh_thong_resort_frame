let messageApi = null;

function setNotifyApi(api) {
  messageApi = api;
}

function notifySuccess(text) {
  if (messageApi) {
    messageApi.success(text);
  }
}

function notifyError(text) {
  if (messageApi) {
    messageApi.error(text);
  }
}

export { notifySuccess, notifyError, setNotifyApi };
