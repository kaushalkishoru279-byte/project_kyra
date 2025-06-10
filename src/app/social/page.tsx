
"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users2, ImagePlus, Send, ThumbsUp, MessageCircle } from "lucide-react";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

interface FeedItem {
  id: string;
  userName: string;
  userAvatar: string;
  userAvatarHint: string;
  timestamp: string;
  text: string;
  image?: string | null;
  imageHint?: string;
  likes: number;
  comments: number;
}

const initialFeedItems: FeedItem[] = [
  { 
    id: "1", 
    userName: "Alice Smith", 
    userAvatar: "https://placehold.co/40x40.png",
    userAvatarHint: "woman smiling",
    timestamp: "2 hours ago", 
    text: "Enjoying a lovely walk in the park today! The weather is perfect. ☀️",
    image: "https://placehold.co/600x400.png",
    imageHint: "park sunny",
    likes: 15, 
    comments: 3 
  },
  { 
    id: "2", 
    userName: "Bob Johnson", 
    userAvatar: "https://placehold.co/40x40.png", 
    userAvatarHint: "man portrait",
    timestamp: "5 hours ago", 
    text: "Just finished reading a great book. Highly recommend 'The Midnight Library'!",
    image: null,
    likes: 8, 
    comments: 1 
  },
];

export default function SocialFeedPage() {
  const [feedItems, setFeedItems] = useState<FeedItem[]>(initialFeedItems);
  const [newPostText, setNewPostText] = useState("");
  const { toast } = useToast();

  const handleCreatePost = () => {
    if (!newPostText.trim()) {
      toast({
        title: "Empty Post",
        description: "Please write something before posting.",
        variant: "destructive",
      });
      return;
    }

    const newPost: FeedItem = {
      id: Date.now().toString(),
      userName: "Current User", // Placeholder for logged-in user
      userAvatar: "https://placehold.co/40x40.png",
      userAvatarHint: "person placeholder",
      timestamp: "Just now",
      text: newPostText,
      image: null, // Photo functionality not implemented
      likes: 0,
      comments: 0,
    };

    setFeedItems(prevItems => [newPost, ...prevItems]);
    setNewPostText("");
    toast({
      title: "Post Created!",
      description: "Your post has been added to the feed.",
    });
  };

  const handleLikePost = (postId: string) => {
    setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === postId ? { ...item, likes: item.likes + 1 } : item
      )
    );
    toast({
      title: "Post Liked!",
      description: "You liked a post.",
    });
  };

  const handleCommentOnPost = (postId: string) => {
     setFeedItems(prevItems =>
      prevItems.map(item =>
        item.id === postId ? { ...item, comments: item.comments + 1 } : item
      )
    );
    toast({
      title: "Comment Added (Simulated)",
      description: "Your comment has been added to the post.",
    });
    // In a real app, this would open a comment input or navigate to a comment section
  };

  const handleAddPhoto = () => {
    toast({
      title: "Feature Not Implemented",
      description: "Adding photos/videos will be available in a future update.",
    });
  };

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="flex items-center gap-4">
        <MessageSquare className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline tracking-tight">Social Feed</h1>
      </div>
      <p className="text-lg text-muted-foreground">
        Connect with family, share updates, and stay in touch.
      </p>

      {/* New Post Card */}
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline">Create New Post</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea 
            placeholder="What's on your mind?" 
            className="min-h-[100px] mb-2 font-code" 
            value={newPostText}
            onChange={(e) => setNewPostText(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <Button variant="outline" size="sm" onClick={handleAddPhoto}>
              <ImagePlus className="h-4 w-4 mr-2" /> Add Photo/Video
            </Button>
            <Button size="sm" onClick={handleCreatePost}>
              <Send className="h-4 w-4 mr-2" /> Post
            </Button>
          </div>
        </CardContent>
      </Card>
      
      {/* Feed Items */}
      <div className="space-y-6">
        {feedItems.map(item => (
          <Card key={item.id} className="shadow-lg">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <Avatar>
                <AvatarImage src={item.userAvatar} alt={item.userName} data-ai-hint={item.userAvatarHint}/>
                <AvatarFallback>{item.userName.substring(0,1).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{item.userName}</p>
                <p className="text-xs text-muted-foreground">{item.timestamp}</p>
              </div>
            </CardHeader>
            <CardContent>
              <p className="mb-3 whitespace-pre-wrap font-code">{item.text}</p>
              {item.image && (
                <Image 
                  src={item.image} 
                  alt="Post image" 
                  data-ai-hint={item.imageHint || "social post"}
                  width={600} 
                  height={400} 
                  className="rounded-md object-cover w-full max-h-[400px] mb-3" 
                />
              )}
              <div className="flex items-center gap-4 pt-2 border-t mt-3">
                <Button variant="ghost" size="sm" onClick={() => handleLikePost(item.id)} className="text-muted-foreground hover:text-primary p-1">
                  <ThumbsUp className="h-4 w-4 mr-1.5" />
                  {item.likes} Likes
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleCommentOnPost(item.id)} className="text-muted-foreground hover:text-primary p-1">
                  <MessageCircle className="h-4 w-4 mr-1.5" />
                  {item.comments} Comments
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {feedItems.length === 0 && (
         <Card>
            <CardContent className="py-10 text-center">
                <Users2 className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">The social feed is quiet right now.</p>
                <p className="text-sm text-muted-foreground">Be the first to share something!</p>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
