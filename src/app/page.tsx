"use client";

import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { SearchIcon, MenuIcon, CommentIcon, UserIcon, SettingIcon } from "@/style/icon";
import {
  Avatar,
  ChatContainer,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  TypingIndicator,
} from "@chatscope/chat-ui-kit-react";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import { Layout, ConfigProvider } from "antd";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";

const { Header, Content, Footer, Sider } = Layout;

const API_KEY = process.env.NEXT_PUBLIC_YOUR_API_KEY;

export default function Home() {
  const { control: controlFilter } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [messages, setMessages] = useState<any>([
    {
      message: "Hello, I'm Emily! Ask me anything!",
      sentTime: "just now",
      sender: "Emily",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message: any) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages: any) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "Emily",
          direction: "incoming",
        };
        setMessages((prevMessages: any) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages: any) {
    const apiMessages = chatMessages.map((messageObject: any) => {
      const role = messageObject.sender === "Emily" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I'm a Student using Emily for learning" },
        ...apiMessages,
      ],
    };

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiRequestBody),
    });

    return response.json();
  }

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: "#3C88C0",
            headerBg: "#0E77C3",
            headerPadding: "0px 16px",
          },
        },
      }}
    >
      <Layout>
        <Header className="flex items-center">
          <MenuIcon />
          <Text label="APEX" className="font-bold text-white text-3xl ml-4" />
        </Header>

        <Layout>
          <Sider
            trigger={null}
            breakpoint="lg"
            collapsedWidth="0"
            width={250}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="p-4">
              <div className="space-y-2">
                <Controller
                  control={controlFilter}
                  name="search"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      onChange={onChange}
                      error={error}
                      onBlur={onBlur}
                      value={value}
                      name="search"
                      type="text"
                      required
                      placeholder="Search"
                      prefixIcon={<SearchIcon />}
                      classNameInput="rounded-full border-0 p-3 ps-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                    />
                  )}
                />

                <Text label="Found API’s (35)" className="font-bold text-white text-base" />
              </div>

              <div className="mt-4 overflow-y-auto h-64 mb-6">
                {Array.from({ length: 100 }, (_, index) => index + 1).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 border-t-[0.5px] py-2 border-white"
                  >
                    <ImageNext
                      src={"/placeholder.png"}
                      width={70}
                      height={70}
                      alt="thumb-api"
                      className="h-[70px] w-[70px] object-cover rounded-lg"
                    />

                    <div>
                      <Text label="Translator API" className="font-bold text-white text-base" />
                      <Text
                        label="Installs: 1400 (star)"
                        className="font-normal text-white text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Text label="History" className="font-bold text-white text-base" />

              <div className="mt-4 overflow-y-auto h-32 space-y-2 mb-6">
                {Array.from({ length: 100 }, (_, index) => index + 1).map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CommentIcon />
                    <Text label="Translator API" className="font-bold text-white text-sm" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <UserIcon />
                <Text label="Settings" className="font-bold text-white text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <SettingIcon />
                <Text label="Profile" className="font-bold text-white text-sm" />
              </div>
            </div>
          </Sider>
          <Layout>
            <Content className="h-lvh">
              <div className="w-full">
                <MainContainer
                  responsive
                  style={{
                    height: 600,
                  }}
                >
                  <ChatContainer>
                    <MessageList
                      scrollBehavior="smooth"
                      typingIndicator={
                        isTyping ? <TypingIndicator content="Emily is typing" /> : null
                      }
                    >
                      {messages.map((message: any, i: any) => {
                        console.log(message);
                        return (
                          <Message key={i} model={message}>
                            {message.sender === "Emily" && (
                              <Avatar src={"emily.png"} name={"Emily"} />
                            )}
                          </Message>
                        );
                      })}
                    </MessageList>
                    <MessageInput placeholder="Send a Message" onSend={handleSendRequest} />
                  </ChatContainer>
                </MainContainer>
              </div>
            </Content>
          </Layout>

          <Sider
            trigger={null}
            breakpoint="lg"
            collapsedWidth="0"
            width={250}
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div className="p-4">
              <div className="space-y-2">
                <Controller
                  control={controlFilter}
                  name="search"
                  render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                    <Input
                      onChange={onChange}
                      error={error}
                      onBlur={onBlur}
                      value={value}
                      name="search"
                      type="text"
                      required
                      placeholder="Search"
                      prefixIcon={<SearchIcon />}
                      classNameInput="rounded-full border-0 p-3 ps-12 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm"
                    />
                  )}
                />

                <Text label="Found API’s (35)" className="font-bold text-white text-base" />
              </div>

              <div className="mt-4 overflow-y-auto h-64 mb-6">
                {Array.from({ length: 100 }, (_, index) => index + 1).map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 border-t-[0.5px] py-2 border-white"
                  >
                    <ImageNext
                      src={"/placeholder.png"}
                      width={70}
                      height={70}
                      alt="thumb-api"
                      className="h-[70px] w-[70px] object-cover rounded-lg"
                    />

                    <div>
                      <Text label="Translator API" className="font-bold text-white text-base" />
                      <Text
                        label="Installs: 1400 (star)"
                        className="font-normal text-white text-base"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <Text label="History" className="font-bold text-white text-base" />

              <div className="mt-4 overflow-y-auto h-32 space-y-2 mb-6">
                {Array.from({ length: 100 }, (_, index) => index + 1).map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CommentIcon />
                    <Text label="Translator API" className="font-bold text-white text-sm" />
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 mb-4">
                <UserIcon />
                <Text label="Settings" className="font-bold text-white text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <SettingIcon />
                <Text label="Profile" className="font-bold text-white text-sm" />
              </div>
            </div>
          </Sider>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
