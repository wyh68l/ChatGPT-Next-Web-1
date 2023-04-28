"use client";

require("../polyfill");

import { useState, useEffect } from "react";

import { IconButton } from "./button";
import styles from "./home.module.scss";

import SettingsIcon from "../icons/settings.svg";
import GithubIcon from "../icons/github.svg";
import ChatGptIcon from "../icons/chatgpt.svg";

import BotIcon from "../icons/bot.svg";
import AddIcon from "../icons/add.svg";
import LoadingIcon from "../icons/three-dots.svg";
import CloseIcon from "../icons/close.svg";

import { useChatStore } from "../store";
import { isMobileScreen } from "../utils";
import Locale from "../locales";
import { ChatList } from "./chat-list";
import { Chat } from "./chat";

import dynamic from "next/dynamic";
import { REPO_URL } from "../constant";
import { ErrorBoundary } from "./error";

export function Loading(props: { noLogo?: boolean }) {
  return (
    <div className={styles["loading-content"]}>
      {!props.noLogo && <BotIcon />}
      <LoadingIcon />
    </div>
  );
}

const Settings = dynamic(async () => (await import("./settings")).Settings, {
  loading: () => <Loading noLogo />,
});

function useSwitchTheme() {
  const config = useChatStore((state) => state.config);

  useEffect(() => {
    document.body.classList.remove("light");
    document.body.classList.remove("dark");

    if (config.theme === "dark") {
      document.body.classList.add("dark");
    } else if (config.theme === "light") {
      document.body.classList.add("light");
    }

    const themeColor = getComputedStyle(document.body)
      .getPropertyValue("--theme-color")
      .trim();
    const metaDescription = document.querySelector('meta[name="theme-color"]');
    metaDescription?.setAttribute("content", themeColor);
  }, [config.theme]);
}

const useHasHydrated = () => {
  const [hasHydrated, setHasHydrated] = useState<boolean>(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  return hasHydrated;
};

function _Home() {
  const [createNewSession, currentIndex, removeSession] = useChatStore(
    (state) => [
      state.newSession,
      state.currentSessionIndex,
      state.removeSession,
    ],
  );
  const loading = !useHasHydrated();
  const [showSideBar, setShowSideBar] = useState(true);

  // setting
  const [openSettings, setOpenSettings] = useState(false);
  const config = useChatStore((state) => state.config);
  const [advFlag1, setAdvFlag1] = useState(true);
  const [advFlag2, setAdvFlag2] = useState(true);
  useSwitchTheme();

  if (loading) {
    return <Loading />;
  }

  return (
    <div
      className={`${
        config.tightBorder && !isMobileScreen()
          ? styles["tight-container"]
          : styles.container
      }`}
    >
      <div
        className={styles.sidebar + ` ${showSideBar && styles["sidebar-show"]}`}
      >
        <div className={styles["sidebar-header"]}>
          <div className={styles["sidebar-title"]}>简桔ChatGPT</div>
          <div className={styles["sidebar-sub-title"]}>
            欢迎关注我公众号“简桔A智能”
          </div>
          <div className={styles["sidebar-sub-title"]}>
            公众号提供免费的密钥可供体验聊天~
          </div>
          <div className={styles["sidebar-sub-title2"]}>
            <a href="https://shop441460054.m.taobao.com/?directUrl=https%3A%2F%2Fshop441460054.m.taobao.com&from=qianniuAndroid&version=9.8.100&ttid=700145%40tbsellerworkbench_android_9.8.100">
              点击购买任意商品免费送ChatGPT账号
            </a>
          </div>
          <div
            className={`${
              isMobileScreen()
                ? styles["sidebar-logo"]
                : styles["sidebar-logo-none"]
            }`}
          >
            {/*<ChatGptIcon />*/}
            <img src="../../static/gzh.jpg" alt="" />
            <div>关注公众号</div>
          </div>
        </div>

        <div
          className={styles["sidebar-body"]}
          onClick={() => {
            setOpenSettings(false);
            setShowSideBar(false);
          }}
        >
          <ChatList />
        </div>

        <div className={styles["sidebar-tail"]}>
          <div className={styles["sidebar-actions"]}>
            <div className={styles["sidebar-action"] + " " + styles.mobile}>
              <IconButton
                icon={<CloseIcon />}
                onClick={() => {
                  if (confirm(Locale.Home.DeleteChat)) {
                    removeSession(currentIndex);
                  }
                }}
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <IconButton
                icon={<SettingsIcon />}
                onClick={() => {
                  setOpenSettings(true);
                  setShowSideBar(false);
                }}
                shadow
              />
            </div>
            <div className={styles["sidebar-action"]}>
              <a href={REPO_URL} target="_blank">
                {/*<IconButton icon={<GithubIcon />} />*/}
              </a>
            </div>
          </div>
          <div>
            <IconButton
              icon={<AddIcon />}
              text={Locale.Home.NewChat}
              onClick={() => {
                createNewSession();
                setShowSideBar(false);
              }}
              shadow
            />
          </div>
        </div>
      </div>

      <div className={styles["window-content"]}>
        {openSettings ? (
          <Settings
            closeSettings={() => {
              setOpenSettings(false);
              setShowSideBar(true);
            }}
          />
        ) : (
          <Chat
            key="chat"
            showSideBar={() => setShowSideBar(true)}
            sideBarShowing={showSideBar}
          />
        )}
      </div>

      <div
        className={`${
          advFlag1
            ? !isMobileScreen()
              ? config.tightBorder
                ? styles["container-adv-none"]
                : styles["container-adv"]
              : styles["container-adv-none"]
            : styles["container-adv-none"]
        }`}
      >
        <div className={styles["container-adv-title"]}>
          公告
          <IconButton
            icon={<CloseIcon />}
            onClick={() => {
              setAdvFlag1(false);
            }}
          />
        </div>
        <div className={styles["container-adv-content"]}>
          1.购买ChatGPT账号密钥 <br />
          2.建立相同ChatGPT国内网站 <br />
          3.推广免费送ChatGPT账号和返现 <br />
          <div className={styles["container-adv-contents"]}>
            微信扫描二维码
            <img
              src="../../static/wechat.jpg"
              alt=""
              className={styles["container-adv-img1"]}
            />
          </div>
          扫描下面二维码送福利
          <br />
          1.免费送ChatGPT账号密钥
          <br />
          2.免费魔法上网
          <br />
          3.送论文查重、降重功能
          <br />
          <div className={styles["container-adv-contents"]}>
            微信扫描二维码
            <img
              src="../../static/xq.jpg"
              alt=""
              className={styles["container-adv-img2"]}
            />
          </div>
        </div>
      </div>

      <div
        className={`${
          advFlag2
            ? !isMobileScreen()
              ? config.tightBorder
                ? styles["container-adv-none"]
                : styles["container-adv2"]
              : styles["container-adv-none"]
            : styles["container-adv-none"]
        }`}
      >
        <div className={styles["container-adv-title"]}>
          关注公众号
          <IconButton
            icon={<CloseIcon />}
            onClick={() => {
              setAdvFlag2(false);
            }}
          />
        </div>
        <div className={styles["container-adv-content"]}>
          1.获取免费ChatGPT密钥 <br />
          2.获取网站最新更新动态 <br />
          <div className={styles["container-adv-contents"]}>
            微信扫描二维码
            <img
              src="../../static/gzh.jpg"
              alt=""
              className={styles["container-adv-img1"]}
            />
          </div>
          我新开了家淘宝服装店！
          <br />
          日系欧美风，绝对的高颜值哦~
          <br />
          只要购买任意商品再加我微信！
          <br />
          直接免费送你ChatGPT账号！
          <br />
          点击下面网址进入店铺吧！
          <br />
          <a
            className={styles["container-adv-tb"]}
            href="https://shop441460054.taobao.com/index.htm"
            target="_blank"
          >
            简桔潮牌工作室
          </a>
        </div>
      </div>
    </div>
  );
}

export function Home() {
  return (
    <ErrorBoundary>
      <_Home></_Home>
    </ErrorBoundary>
  );
}
