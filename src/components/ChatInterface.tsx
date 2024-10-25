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

const nunito = Nunito({ subsets: ["latin"] })

export default function ChatInterface() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "¡Hola amigo! I'm Taco, your Spanish buddy. What shall we learn today? 🌮",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollAreaRef = useRef<HTMLDivElement>(null)

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
      const newMessage = { role: "user", content: input }
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
    <div className={`flex ${nunito.className}`}>
      <Card className="w-full max-w-2xl mx-auto bg-white rounded-3xl shadow-lg overflow-hidden border-8 border-yellow-400">
        <CardHeader className="bg-blue-500 py-6">
          <CardTitle className="text-3xl font-black text-center text-white drop-shadow-md">
            Spanish Adventure with Taco 🌮
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <ScrollArea className="h-[400px] w-full pr-4" ref={scrollAreaRef}>
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start mb-4 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <Avatar className="mr-2 w-12 h-12 border-2 border-red-400">
                    <AvatarImage
                      src="/placeholder.svg?height=48&width=48"
                      alt="Taco"
                    />
                    <AvatarFallback>🌮</AvatarFallback>
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
                      {message.content}
                    </ReactMarkdown>
                  ) : (
                    message.content
                  )}
                </div>
                {message.role === "user" && (
                  <Avatar className="ml-2 w-12 h-12 border-2 border-blue-400">
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
                <Avatar className="mr-2 w-12 h-12 border-2 border-red-400">
                  <AvatarImage
                    src="/placeholder.svg?height=48&width=48"
                    alt="Taco"
                  />
                  <AvatarFallback>🌮</AvatarFallback>
                </Avatar>
                <div className="inline-block p-4 rounded-2xl bg-yellow-200 text-gray-800 shadow-md">
                  <LoadingDots />
                </div>
              </div>
            )}
            <ScrollBar />
          </ScrollArea>
        </CardContent>
        <CardFooter className="bg-green-100 p-4">
          <div className="flex w-full items-center space-x-2">
            <Input
              type="text"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-grow rounded-full text-lg py-6 border-2 border-green-300 focus:border-green-500 focus:ring focus:ring-green-200 focus:ring-opacity-50"
            />
            <Button
              onClick={handleSend}
              className="rounded-full bg-red-500 hover:bg-red-600 text-white text-lg py-6 px-8"
            >
              Send 🚀
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
