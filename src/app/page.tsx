import ChatInterface from "../components/ChatInterface"

export default function Home() {
  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center bg-no-repeat"
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
