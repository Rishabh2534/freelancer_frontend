import { useState } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Hash, Users } from "lucide-react";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  avatar: string;
}

const Chat = () => {
  const [selectedChannel, setSelectedChannel] = useState("react");
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      user: "Sarah J",
      content: "Hey everyone! Just finished a great project using React and TypeScript. Anyone have experience with state management patterns?",
      timestamp: "10:23 AM",
      avatar: "SJ",
    },
    {
      id: "2",
      user: "Mike C",
      content: "Congrats! I'd recommend checking out Zustand for lightweight state management. It's been a game-changer for me.",
      timestamp: "10:25 AM",
      avatar: "MC",
    },
    {
      id: "3",
      user: "Emma W",
      content: "I second Zustand! Also, Context API works great for smaller apps. What's the scale of your project?",
      timestamp: "10:27 AM",
      avatar: "EW",
    },
  ]);

  const channels = [
    { id: "react", name: "React", members: 1234 },
    { id: "nodejs", name: "Node.js", members: 892 },
    { id: "python", name: "Python", members: 1567 },
    { id: "design", name: "UI/UX Design", members: 743 },
    { id: "general", name: "General", members: 2341 },
  ];

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      setMessages([
        ...messages,
        {
          id: Date.now().toString(),
          user: "You",
          content: messageInput,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: "JD",
        },
      ]);
      setMessageInput("");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {/* Channels Sidebar */}
          <Card className="lg:col-span-1 shadow-lg border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Channels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {channels.map((channel) => (
                <button
                  key={channel.id}
                  onClick={() => setSelectedChannel(channel.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-all ${
                    selectedChannel === channel.id
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-muted"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Hash className="h-4 w-4" />
                    <span className="font-medium">{channel.name}</span>
                  </div>
                  <Badge variant={selectedChannel === channel.id ? "secondary" : "outline"} className="text-xs">
                    {channel.members}
                  </Badge>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Chat Area */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="shadow-lg border-border">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5" />
                    {channels.find((c) => c.id === selectedChannel)?.name}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{channels.find((c) => c.id === selectedChannel)?.members} members</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <ScrollArea className="h-[500px] p-6">
                  <div className="space-y-6">
                    {messages.map((message) => (
                      <div key={message.id} className="flex gap-3 animate-fade-in">
                        <Avatar className="h-10 w-10 shrink-0">
                          <AvatarFallback className="bg-gradient-primary text-white text-sm">
                            {message.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm">{message.user}</span>
                            <span className="text-xs text-muted-foreground">{message.timestamp}</span>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>

            {/* Message Input */}
            <Card className="shadow-lg border-border">
              <CardContent className="p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={`Message #${channels.find((c) => c.id === selectedChannel)?.name}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} variant="gradient" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat;
