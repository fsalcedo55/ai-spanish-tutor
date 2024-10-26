"use client"

import React, { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Nunito } from "next/font/google"
import LoadingDots from "@/components/ui/loadingDots"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"
import Image from "next/image"

const greetings = [
  "¡Hola! I'm Pico, your Spanish buddy. What shall we learn today? ✏️",
  "¡Hola! Excited to start our Spanish adventure. What would you like to know? 🚀",
  "¡Saludos! I'm here to help you with Spanish. What topic interests you today? 🌈",
  "¡Qué tal! Let's dive into Spanish together. What are you curious about? 🐠",
  "¡Hola! I'm Pico, your friendly Spanish tutor from Spanish For Us. Are you excited to learn some Spanish today? 😄",
  "Hi there! I'm Pico, and I'm here to help you explore the fun world of Spanish. Do you know any Spanish words already?",
  "Hello! My name is Pico, your Spanish buddy. Let's start our adventure in learning Spanish! What's something you'd like to learn in Spanish? ✨",
  "¡Hola! I'm Pico from Spanish For Us. Ready to have some fun learning Spanish words and phrases? Let's begin! 🚀",
  "Greetings! I'm Pico, your guide to learning Spanish. How about we start with some basic words? Do you have a favorite animal? Let's learn how to say it in Spanish! 🐾",
]

const nunito = Nunito({ subsets: ["latin"] })

type Message = {
  role: "assistant" | "user"
  content: string | JSX.Element
}

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: <LoadingDots />,
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set a random greeting after the initial render
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)]
    setMessages([{ role: "assistant", content: randomGreeting }])
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      )
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }

  const handleSend = async () => {
    if (input.trim()) {
      const newMessage: Message = { role: "user", content: input }
      setMessages((prev) => [...prev, newMessage])
      setInput("")
      setIsLoading(true)

      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ messages: [...messages, newMessage] }),
        })

        if (!response.ok) {
          throw new Error("Failed to get response from API")
        }

        const data = await response.json()
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      } catch (error) {
        console.error("Error:", error)
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Lo siento, I encountered an error. Can you try again?",
          },
        ])
      } finally {
        setIsLoading(false)
      }
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend()
    }
  }

  return (
    <div
      className={`flex flex-col sm:h-screen overflow-hidden p-0 sm:p-4 md:p-6 lg:p-8 ${nunito.className}`}
    >
      <Card className="flex flex-col h-full w-full sm:w-[400px] md:w-[600px] lg:w-[800px] mx-auto bg-white rounded-none sm:rounded-3xl shadow-lg overflow-hidden sm:border-8 sm:border-yellow-400">
        <CardHeader className="bg-blue-500 py-4 sticky top-0 z-10">
          <CardTitle className="text-2xl sm:text-3xl font-black text-center text-white drop-shadow-md flex justify-between items-center">
            <div className="flex gap-2">
              <Image
                src="/Untitled-12.png"
                alt="Pico"
                width={40}
                height={40}
                className="inline-block"
              />
              <span>Pico</span>
            </div>
            <Image
              src="/Spanish-For-Us-White-Logo.webp"
              alt="Spanish For Us Logo"
              width={110}
              height={110}
              className="inline-block"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-hidden p-4 relative">
          <ScrollArea
            className="h-[calc(100vh-200px)] sm:h-[500px] w-full pr-4"
            ref={scrollAreaRef}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="mr-2 w-12 h-12 flex-shrink-0">
                    <AvatarImage src="/Untitled-12.png" alt="Pico" />
                    <AvatarFallback>PC</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`inline-block p-4 rounded-2xl ${
                    message.role === "user"
                      ? "bg-blue-500 text-white"
                      : "bg-yellow-200 text-gray-800"
                  } shadow-md max-w-[70%]`}
                >
                  {message.role === "assistant" ? (
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        p: ({ ...props }) => <p className="mb-2" {...props} />,
                        ul: ({ ...props }) => (
                          <ul
                            className="list-disc list-inside my-2"
                            {...props}
                          />
                        ),
                        ol: ({ ...props }) => (
                          <ol
                            className="list-decimal list-inside my-2"
                            {...props}
                          />
                        ),
                        li: ({ ...props }) => (
                          <li className="mb-1" {...props} />
                        ),
                        strong: ({ ...props }) => (
                          <strong className="font-bold" {...props} />
                        ),
                      }}
                    >
                      {typeof message.content === "string"
                        ? message.content
                        : null}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="ml-2 w-12 h-12 border-2 border-blue-400 flex-shrink-0">
                    <AvatarImage
                      src="/placeholder.svg?height=48&width=48"
                      alt="User"
                    />

                    <AvatarFallback>😊</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start mb-4">
                <Avatar className="mr-2 w-12 h-12 flex-shrink-0">
                  <AvatarImage src="/Untitled-12.png" alt="Pico" />
                  <AvatarFallback>PC</AvatarFallback>
                </Avatar>
                <div className="inline-block p-4 rounded-2xl bg-yellow-200 text-gray-800 shadow-md">
                  <LoadingDots />
                </div>
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </CardContent>
        <CardFooter className="bg-green-100 p-4 sticky bottom-0 z-10">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow rounded-full text-lg py-4 border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <Button
              onClick={handleSend}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white text-lg py-4 px-6"
            >
              Send 🚀
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
