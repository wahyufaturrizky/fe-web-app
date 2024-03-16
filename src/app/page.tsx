"use client";

import Input from "@/components/Input";
import Text from "@/components/Text";
import { SearchIcon, MenuIcon } from "@/style/icon";
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

  const [messages, setMessages] = useState([
    {
      message: "Hello, I'm ChatGPT! Ask me anything!",
      sentTime: "just now",
      sender: "ChatGPT",
      direction: "incoming",
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);

  const handleSendRequest = async (message) => {
    const newMessage = {
      message,
      direction: "outgoing",
      sender: "user",
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setIsTyping(true);

    try {
      const response = await processMessageToChatGPT([...messages, newMessage]);
      const content = response.choices[0]?.message?.content;
      if (content) {
        const chatGPTResponse = {
          message: content,
          sender: "ChatGPT",
          direction: "incoming",
        };
        setMessages((prevMessages) => [...prevMessages, chatGPTResponse]);
      }
    } catch (error) {
      console.error("Error processing message:", error);
    } finally {
      setIsTyping(false);
    }
  };

  async function processMessageToChatGPT(chatMessages) {
    const apiMessages = chatMessages.map((messageObject) => {
      const role = messageObject.sender === "ChatGPT" ? "assistant" : "user";
      return { role, content: messageObject.message };
    });

    const apiRequestBody = {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "I'm a Student using ChatGPT for learning" },
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

              <div>api list</div>

              <div>history</div>

              <div>settings profile</div>
            </div>
          </Sider>
          <Layout>
            <Content style={{ margin: "24px 16px 0" }}>
              <div className="App">
                <div style={{ position: "relative", height: "800px", width: "700px" }}>
                  <MainContainer>
                    <ChatContainer>
                      <MessageList
                        scrollBehavior="smooth"
                        typingIndicator={
                          isTyping ? <TypingIndicator content="ChatGPT is typing" /> : null
                        }
                      >
                        {messages.map((message, i) => {
                          console.log(message);
                          return (
                            <Message key={i} model={message}>
                              {message.sender === "ChatGPT" && (
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
              </div>
            </Content>
          </Layout>

          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={(broken) => {
              console.log(broken);
            }}
            onCollapse={(collapsed, type) => {
              console.log(collapsed, type);
            }}
          >
            <div>search</div>

            <div>api list</div>

            <div>history</div>

            <div>settings profile</div>
          </Sider>
        </Layout>
      </Layout>
    </ConfigProvider>
  );
}
