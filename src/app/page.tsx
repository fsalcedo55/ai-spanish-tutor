import ChatInterface from "../components/ChatInterface"

export default function Home() {
  return (
    <div
      className="flex flex-col items-center justify-start sm:justify-center min-h-screen bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('/grass-city.svg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <ChatInterface />
    </div>
  )
}
