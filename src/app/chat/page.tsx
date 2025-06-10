
"use client";

import { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MessagesSquare, Phone, Video, Send, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface ChatUser {
  id: string;
  name: string;
  avatar: string;
  avatarHint: string;
  lastMessage?: string;
  lastMessageTime?: string;
  online?: boolean;
}

interface ChatMessage {
  id: string;
  senderId: string; 
  text: string;
  timestamp: string;
  isCurrentUser: boolean;
}

const mockUsers: ChatUser[] = [
  { id: 'user1', name: 'Eleanor Vance', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman portrait', lastMessage: 'See you then!', lastMessageTime: '10:30 AM', online: true },
  { id: 'user2', name: 'Dr. Arthur Green', avatar: 'https://placehold.co/40x40.png', avatarHint: 'doctor smiling', lastMessage: 'Yes, that works.', lastMessageTime: 'Yesterday', online: false },
  { id: 'user3', name: 'Samuel Page', avatar: 'https://placehold.co/40x40.png', avatarHint: 'man glasses', lastMessage: 'Okay, sounds good.', lastMessageTime: 'Mon', online: true },
  { id: 'user4', name: 'Alice Smith', avatar: 'https://placehold.co/40x40.png', avatarHint: 'woman smiling', lastMessage: 'Can you send the report?', lastMessageTime: 'Sun', online: false },
  { id: 'user5', name: 'CareConnect Support', avatar: 'https://placehold.co/40x40.png', avatarHint: 'customer service', lastMessage: 'How can I help you today?', lastMessageTime: '11:15 AM', online: true },
];

// Extended mockMessages to ensure all users have some initial data or an empty array
const mockMessages: Record<string, ChatMessage[]> = {
  user1: [
    { id: 'msg1', senderId: 'user1', text: "Hey, how's the patient doing?", timestamp: '10:25 AM', isCurrentUser: false },
    { id: 'msg2', senderId: 'currentUser', text: "Much better today, thanks for asking!", timestamp: '10:26 AM', isCurrentUser: true },
    { id: 'msg3', senderId: 'user1', text: "Great to hear! I'll be stopping by around 3 PM.", timestamp: '10:28 AM', isCurrentUser: false },
    { id: 'msg4', senderId: 'currentUser', text: "Perfect. See you then!", timestamp: '10:29 AM', isCurrentUser: true },
  ],
  user2: [
    { id: 'msg5', senderId: 'currentUser', text: "Doctor, can we reschedule the appointment?", timestamp: 'Yesterday', isCurrentUser: true },
    { id: 'msg6', senderId: 'user2', text: "Yes, that works.", timestamp: 'Yesterday', isCurrentUser: false },
  ],
  user3: [
     { id: 'msg7', senderId: 'user3', text: "Just confirming our meeting for tomorrow.", timestamp: 'Mon', isCurrentUser: false },
  ],
  user4: [], // No messages yet for Alice
  user5: [
    { id: 'msg8', senderId: 'user5', text: 'Welcome to CareConnect support! How can I help you today?', timestamp: '11:15 AM', isCurrentUser: false },
  ]
};


export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<ChatUser | null>(mockUsers[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(selectedUser ? mockMessages[selectedUser.id] || [] : []);
  const [newMessage, setNewMessage] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (selectedUser) {
      setMessages(mockMessages[selectedUser.id] || []);
    } else {
      setMessages([]);
    }
  }, [selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSelectUser = (user: ChatUser) => {
    setSelectedUser(user);
  };

  const handleSendMessage = () => {
    if (newMessage.trim() === '' || !selectedUser) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: 'currentUser',
      text: newMessage,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isCurrentUser: true,
    };
    
    setMessages(prevMessages => [...prevMessages, newMsg]);
    
    // Update mockMessages (simulating backend update)
    if (!mockMessages[selectedUser.id]) {
        mockMessages[selectedUser.id] = [];
    }
    mockMessages[selectedUser.id].push(newMsg);
    
    // Update last message for the selected user in mockUsers (simulating real-time update in contact list)
    const userIndex = mockUsers.findIndex(u => u.id === selectedUser.id);
    if (userIndex !== -1) {
        mockUsers[userIndex].lastMessage = newMessage;
        mockUsers[userIndex].lastMessageTime = newMsg.timestamp;
    }

    setNewMessage('');
  };

  const handleCall = (type: 'audio' | 'video') => {
    if (!selectedUser) return;
    toast({
      title: `${type === 'audio' ? 'Audio' : 'Video'} Call`,
      description: `Starting ${type} call with ${selectedUser.name}... (Feature not implemented)`,
    });
  };

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto py-8 h-[calc(100vh-8rem)] flex flex-col"> {/* Adjusted height for better fit */}
      <div className="flex items-center gap-4 mb-6">
        <MessagesSquare className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Chat & Calls</h1>
      </div>

      <div className="flex-grow grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 min-h-0">
        {/* Contacts Sidebar */}
        <Card className="md:col-span-1 lg:col-span-1 flex flex-col shadow-lg overflow-hidden">
          <CardHeader className="pb-3 pt-4 px-4">
            <CardTitle className="text-xl font-semibold">Contacts</CardTitle>
             <div className="relative mt-3">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search contacts..."
                    className="w-full rounded-lg bg-muted pl-8 h-9 text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </CardHeader>
          <ScrollArea className="flex-grow">
            <CardContent className="p-2 space-y-1">
              {filteredUsers.length > 0 ? filteredUsers.map(user => (
                <Button
                  key={user.id}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start h-auto py-2.5 px-3 text-left rounded-md",
                    selectedUser?.id === user.id && "bg-accent text-accent-foreground"
                  )}
                  onClick={() => handleSelectUser(user)}
                >
                  <Avatar className="h-9 w-9 mr-3 shrink-0">
                    <AvatarImage src={user.avatar} alt={user.name} data-ai-hint={user.avatarHint} />
                    <AvatarFallback>{user.name.substring(0, 1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div className="flex-grow overflow-hidden min-w-0">
                    <div className="flex justify-between items-center">
                        <p className="font-medium truncate text-sm">{user.name}</p>
                        {user.online && <span className="h-2 w-2 rounded-full bg-green-500 shrink-0 ml-2"></span>}
                    </div>
                    {user.lastMessage && <p className="text-xs text-muted-foreground truncate">{user.lastMessage}</p>}
                  </div>
                  {user.lastMessageTime && !user.lastMessage && <div className="flex-grow"></div>} 
                  {user.lastMessageTime && <p className="text-xs text-muted-foreground ml-2 shrink-0 self-start pt-0.5">{user.lastMessageTime}</p>}
                </Button>
              )) : (
                <p className="text-sm text-muted-foreground p-4 text-center">No contacts found.</p>
              )}
            </CardContent>
          </ScrollArea>
        </Card>

        {/* Chat Area */}
        <Card className="md:col-span-2 lg:col-span-3 flex flex-col shadow-lg overflow-hidden">
          {selectedUser ? (
            <>
              <CardHeader className="flex flex-row items-center justify-between border-b p-3 bg-muted/30">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} data-ai-hint={selectedUser.avatarHint} />
                    <AvatarFallback>{selectedUser.name.substring(0,1).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{selectedUser.name}</p>
                    <p className="text-xs text-muted-foreground">{selectedUser.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleCall('audio')} aria-label="Audio Call">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleCall('video')} aria-label="Video Call">
                    <Video className="h-5 w-5" />
                  </Button>
                </div>
              </CardHeader>

              <ScrollArea className="flex-grow p-4 space-y-4 bg-background">
                {messages.map(msg => (
                  <div
                    key={msg.id}
                    className={cn(
                      "flex items-end gap-2 max-w-[80%] sm:max-w-[70%]",
                      msg.isCurrentUser ? "ml-auto flex-row-reverse" : "mr-auto"
                    )}
                  >
                    {!msg.isCurrentUser && selectedUser && (
                       <Avatar className="h-7 w-7 shrink-0">
                         <AvatarImage src={selectedUser.avatar} alt={selectedUser.name} data-ai-hint={selectedUser.avatarHint} />
                         <AvatarFallback>{selectedUser.name.substring(0,1).toUpperCase()}</AvatarFallback>
                       </Avatar>
                    )}
                     {msg.isCurrentUser && (
                       <Avatar className="h-7 w-7 shrink-0">
                         <AvatarImage src="https://placehold.co/40x40.png" alt="Current User" data-ai-hint="person placeholder" />
                         <AvatarFallback>ME</AvatarFallback>
                       </Avatar>
                    )}
                    <div
                      className={cn(
                        "p-2.5 rounded-xl text-sm shadow-sm min-w-[80px]",
                        msg.isCurrentUser
                          ? "bg-primary text-primary-foreground rounded-br-none"
                          : "bg-muted text-foreground rounded-bl-none"
                      )}
                    >
                      <p className="whitespace-pre-wrap font-code leading-relaxed">{msg.text}</p>
                      <p className={cn(
                        "text-xs mt-1.5",
                        msg.isCurrentUser ? "text-primary-foreground/70 text-right" : "text-muted-foreground/80 text-left"
                      )}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </ScrollArea>

              <div className="border-t p-3 flex items-center gap-2 bg-muted/30">
                <Input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-grow h-10 bg-background"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSendMessage(); } }}
                />
                <Button onClick={handleSendMessage} disabled={!newMessage.trim()} size="icon" className="h-10 w-10 shrink-0">
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <MessagesSquare className="h-20 w-20 text-muted-foreground/30 mb-4" />
              <p className="text-xl text-muted-foreground font-semibold">Welcome to Chat</p>
              <p className="text-sm text-muted-foreground">Select a contact from the list to start a conversation.</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
