"use client";

import SendbirdApp from "@sendbird/uikit-react/App";
import { ChatAiWidget } from "@sendbird/chat-ai-widget";

import "@sendbird/uikit-react/dist/index.css";

const APP_ID = process.env.NEXT_PUBLIC_YOUR_APP_ID;
const USER_ID = process.env.NEXT_PUBLIC_YOUR_USER_ID;

export default function Home() {
  function isIOS() {
    const userAgent = window.navigator.userAgent;
    const platform = window.navigator?.userAgentData?.platform || window.navigator.platform;
    const iosPlatforms = ["iPhone", "iPad", "iPod"];
    if (iosPlatforms.indexOf(platform) !== -1) {
      return true;
    }
    return false;
  }
  const isMobile = isIOS();

  return (
    <div className="App">
      <SendbirdApp
        // Add the two lines below.
        // You can find your Sendbird application ID on the Sendbird dashboard.
        appId={APP_ID}
        // Specify the user ID you've created on the dashboard.
        // Or you can create a user by specifying a unique userId.
        userId={USER_ID}
        breakpoint={isMobile || "567px"}
      />

      {/* <ChatAiWidget
            applicationId={APP_ID} // Your Sendbird Application ID
            botId="khan-academy-bot" // Your Bot ID
        /> */}
    </div>
  );
}
