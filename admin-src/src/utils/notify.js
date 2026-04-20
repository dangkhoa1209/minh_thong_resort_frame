import { message } from "antd";

function notifySuccess(text) {
  message.success(text);
}

function notifyError(text) {
  message.error(text);
}

export { notifySuccess, notifyError };
