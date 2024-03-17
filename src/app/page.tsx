"use client";

import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { CommentIcon, SearchIcon, SettingIcon, UserIcon } from "@/style/icon";
import { Modal } from "antd";

import { CheckCircleOutlined } from "@ant-design/icons";
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
import { ConfigProvider, Layout } from "antd";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useCreateUniversa } from "@/services/universa/useUniversa";
import SyntaxHighlighter from "react-syntax-highlighter";
import { docco } from "react-syntax-highlighter/dist/esm/styles/hljs";

const { Header, Content, Sider } = Layout;

export default function Home() {
  const { control: controlFilter } = useForm({
    defaultValues: {
      search: "",
    },
  });

  const [chatAgentResponse, setChatAgentResponse] = useState<any>();
  const [chatAgentResponseFunc, setChatAgentResponseFunc] = useState<any>();
  const [openModal, setOpenModal] = useState<any>(false);

  const handleSyntaxHighlighter = (code: any) => {
    return (
      <SyntaxHighlighter language="python" style={docco}>
        {code}
      </SyntaxHighlighter>
    );
  };

  const { mutate: createOpenApi } = useCreateUniversa({
    options: {
      onSuccess: (res: any) => {
        if (chatAgentResponse) {
          setChatAgentResponseFunc(res);

          if (res.data) {
            const chatAgentResponseRaw = {
              message: res?.data?.func,
              sender: res.data.api.name,
              direction: "incoming",
            };
            setMessages((prevMessages: any) => [...prevMessages, chatAgentResponseRaw]);
          }
        } else {
          setChatAgentResponse(res);

          const questionList = res.data.secret
            .replaceAll(" ", "")
            .split(",")
            .map((item: any, index: any) => `\n${index + 1}. What's your ${item}`);

          const contentMessage = res.data.api.description + `\n ${questionList}`;

          if (res.data) {
            const chatAgentResponseRaw = {
              message: contentMessage,
              sender: res.data.api.name,
              direction: "incoming",
            };
            setMessages((prevMessages: any) => [...prevMessages, chatAgentResponseRaw]);
          }
        }
      },
      onError: (error: any) => {
        console.error("Error processing message:", error);
      },
      onSettled: () => {
        setIsTyping(false);
      },
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

    const rawDataSecretProvided = {
      secret_provided: {
        "YOUR-API-KEY": "59a38afb45msh997d3e62cae8de4p15522djsn13a589fdd1aa",
      },

      api: {
        description:
          "Access flight information for various airlines. Real-time updates on flight status, schedules, and more. Easy integration with comprehensive documentation.\n",
        name: "FlightMaster",
        request: {
          headers: {
            "Api-Key": "YOUR-API-KEY",
            "X-RapidAPI-Host": "flightmaster-api.p.rapidapi.com",
          },
          method: "GET",
          params: {
            departure_date: "DEPARTURE_DATE",
            destination: "DESTINATION_CITY",
            origin: "DEPARTURE_CITY",
          },
          url: "https://flightmaster-api.p.rapidapi.com/flights",
        },
        response: {
          data: {
            flights: [
              {
                arrival_time: "2024-03-16T13:00:00",
                departure_time: "2024-03-16T08:00:00",
                destination: "London",
                flight_number: "AB123",
                origin: "New York",
                status: "On Time",
              },
              {
                arrival_time: "2024-03-16T19:00:00",
                departure_time: "2024-03-16T14:00:00",
                destination: "New York",
                flight_number: "CD456",
                origin: "London",
                status: "Delayed",
              },
            ],
          },
        },
      },
      secret: "YOUR-API-KEY, DEPARTURE_CITY, DESTINATION_CITY, DEPARTURE_DATE",
      task: "fly",
    };

    if (chatAgentResponse) {
      createOpenApi(rawDataSecretProvided);
    } else {
      createOpenApi({ task: message });
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            siderBg: "#F3F3F3",
            headerBg: "#323232",
            headerPadding: "0px 16px",
          },
        },
      }}
    >
      <Layout>
        <Header className="flex items-center">
          <Text label="APEX" className="font-bold text-white text-3xl" />
        </Header>

        <Layout>
          <Sider
            trigger={null}
            breakpoint="lg"
            collapsedWidth="0"
            width={250}
            onBreakpoint={(broken) => {}}
            onCollapse={(collapsed, type) => {}}
          >
            <div className="p-4">
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

              {chatAgentResponse && (
                <div className="mt-4 mb-6 space-y-2">
                  <Text label="Found API’s (1)" className="font-bold text-black text-base" />

                  <div className="flex items-center gap-2 border-t-[0.5px] py-2 border-black">
                    <ImageNext
                      src={"/placeholder.png"}
                      width={70}
                      height={70}
                      alt="thumb-api"
                      className="h-[70px] w-[70px] object-cover rounded-full"
                    />

                    <div>
                      <Text
                        label={chatAgentResponse?.data?.api?.name}
                        className="font-bold text-black text-base"
                      />
                      <Text
                        label={chatAgentResponse?.data?.api?.description.substring(0, 10) + "..."}
                        className="font-normal text-black text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="hidden">
                <Text label="History" className="font-bold text-white text-base" />

                <div className="mt-4 overflow-y-auto h-32 space-y-2">
                  {Array.from({ length: 100 }, (_, index) => index + 1).map((item) => (
                    <div key={item} className="flex items-center gap-2">
                      <CommentIcon />
                      <Text label="Translator API" className="font-bold text-white text-sm" />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4 mt-20">
                <UserIcon
                  style={{
                    color: "black",
                  }}
                />
                <Text label="Settings" className="font-bold text-black text-sm" />
              </div>
              <div className="flex items-center gap-2">
                <SettingIcon
                  style={{
                    color: "black",
                  }}
                />
                <Text label="Profile" className="font-bold text-black text-sm" />
              </div>
            </div>
          </Sider>
          <Layout>
            <Content className="h-lvh">
              <div className="w-full">
                <MainContainer
                  responsive
                  style={{
                    height: "75vh",
                  }}
                >
                  <ChatContainer>
                    <MessageList
                      scrollBehavior="smooth"
                      typingIndicator={
                        isTyping ? <TypingIndicator content="Emily is typing" /> : null
                      }
                    >
                      {messages.map((message: any) => {
                        return (
                          <Message key={message.sender} model={message}>
                            {message.direction === "incoming" && (
                              <Avatar src={"/emily.png"} name={message.sender} />
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
            style={{
              background: "#FFFFFF",
            }}
            collapsedWidth="0"
            width={250}
            onBreakpoint={() => {}}
            onCollapse={() => {}}
          >
            <div className="p-4">
              {chatAgentResponse?.data?.secret.replaceAll(" ", "").split(",").length && (
                <div>
                  <Text label="Api Name" className="font-bold text-black-soft text-xl mb-8" />

                  <div className="overflow-y-auto h-64">
                    {chatAgentResponse?.data?.secret
                      .replaceAll(" ", "")
                      .split(",")
                      .map((item: any) => (
                        <div
                          key={item}
                          className="flex flex-col border-b-[0.5px] py-2 border-black-soft"
                        >
                          <div className="flex items-center justify-between">
                            <Text label={item} className="font-bold text-black-soft text-base" />

                            <CheckCircleOutlined />
                          </div>

                          <Text label="N/A" className="font-normal text-black-soft text-base" />
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {chatAgentResponseFunc?.data?.func && (
                <div className="mt-8 space-y-4">
                  {handleSyntaxHighlighter(chatAgentResponseFunc?.data?.func)}

                  <Button
                    type="button"
                    onClick={() => setOpenModal(true)}
                    label="SHOW THE CODE"
                    className="flex w-full justify-center items-center rounded-md bg-black px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-black/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  />
                </div>
              )}
            </div>
          </Sider>
        </Layout>
      </Layout>

      <Modal
        title="THE FULL CODE"
        centered
        open={openModal}
        onOk={() => setOpenModal(false)}
        onCancel={() => setOpenModal(false)}
        width={1000}
      >
        {handleSyntaxHighlighter(chatAgentResponseFunc?.data?.func)}
      </Modal>
    </ConfigProvider>
  );
}
