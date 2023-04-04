import { showToast } from "./components/ui-lib";
import Locale from "./locales";

export function trimTopic(topic: string) {
  return topic.replace(/[，。！？、,.!?]*$/, "");
}

export async function copyToClipboard(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  } finally {
    showToast(Locale.Copy.Success);
  }
}

export function downloadAs(text: string, filename: string) {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

export function isIOS() {
  const userAgent = navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent);
}

export function isMobileScreen() {
  return window.innerWidth <= 600;
}

export function selectOrCopy(el: HTMLElement, content: string) {
  const currentSelection = window.getSelection();

  if (currentSelection?.type === "Range") {
    return false;
  }

  copyToClipboard(content);

  return true;
}

export function queryMeta(key: string, defaultValue?: string): string {
  let ret: string;
  if (document) {
    const meta = document.head.querySelector(
      `meta[name='${key}']`,
    ) as HTMLMetaElement;
    ret = meta?.content ?? "";
  } else {
    ret = defaultValue ?? "";
  }

  return ret;
}

let currentId: string;
export function getCurrentVersion() {
  if (currentId) {
    return currentId;
  }

  currentId = queryMeta("version");

  return currentId;
}

//设置缓存
export function localStorageSet(name: string, data: any) {
  const obj = {
    data,
    expire: new Date().getTime() + 24 * 60 * 60 * 1000, //一天过期时间
  };
  localStorage.setItem(name, JSON.stringify(obj));
}

//读取缓存且比较时间戳是否过期
export function localStorageGet(name: string) {
  const storage = localStorage.getItem(name);
  const time = new Date().getTime();
  let result = null;
  if (storage) {
    const obj = JSON.parse(storage);
    if (time < obj.expire) {
      result = obj.data;
    } else {
      localStorage.removeItem(name);
    }
  }
  return result;
}
