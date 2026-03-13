import { useState, useEffect } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageSquare, Send, Hash, Users } from "lucide-react";
import { api } from "@/services/api";
import { toast } from "sonner";

interface Message {
  id: string;
  user: string;
  content: string;
  timestamp: string;
  avatar: string;
}

const Chat = () => {
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; members: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannels = async () => {
      try {
        const { channels: fetchedChannels } = await api.getChannels();
        const transformedChannels = fetchedChannels.map((ch: any) => ({
          id: ch.id,
          name: ch.name,
          members: ch.memberCount || 0,
        }));
        setChannels(transformedChannels);
        if (transformedChannels.length > 0 && !selectedChannel) {
          setSelectedChannel(transformedChannels[0].id);
        }
      } catch (error: any) {
        console.error('Error fetching channels:', error);
        toast.error('Failed to load channels');
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannels();
  }, []);

  useEffect(() => {
    if (!selectedChannel) return;

    const fetchMessages = async () => {
      try {
        const { messages: fetchedMessages } = await api.getChannelMessages(selectedChannel, 50);
        const transformedMessages = fetchedMessages.map((msg: any) => ({
          id: msg.id,
          user: msg.user?.profile?.fullName || msg.user?.email?.split('@')[0] || "User",
          content: msg.content,
          timestamp: new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: (msg.user?.profile?.fullName || msg.user?.email || "U").substring(0, 2).toUpperCase(),
        }));
        setMessages(transformedMessages);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        toast.error('Failed to load messages');
      }
    };

    fetchMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [selectedChannel]);

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChannel) return;
    const content = messageInput.trim();
    setMessageInput("");

    try {
      const { message: newMessage } = await api.sendMessage(selectedChannel, content);
      setMessages((prev) => [
        ...prev,
        {
          id: newMessage.id,
          user: "You",
          content: newMessage.content,
          timestamp: new Date(newMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          avatar: "YO",
        },
      ]);
    } catch (error: any) {
      toast.error(error.message || "Failed to send message");
      setMessageInput(content);
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
                    {channels.find((c) => c.id === selectedChannel)?.name || "Select a channel"}
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{channels.find((c) => c.id === selectedChannel)?.members || 0} members</span>
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
                    placeholder={`Message #${channels.find((c) => c.id === selectedChannel)?.name || "channel"}...`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                    disabled={!selectedChannel}
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
