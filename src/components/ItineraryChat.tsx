import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Send, X, Loader2, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { SmartSuggestions } from "./SmartSuggestions";
import { VoiceRecognition, VoiceSynthesis } from "@/utils/voiceInterface";
import { AnimatedGoose } from "./AnimatedGoose";
import { GooseStatusCard } from "./GooseStatusCard";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ItineraryChatProps {
  location: string;
  currentItinerary: any[];
  tripId?: string | null;
  onItineraryUpdate?: (newItinerary: any[]) => void;
}

export const ItineraryChat = ({ location, currentItinerary, tripId, onItineraryUpdate }: ItineraryChatProps) => {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Honk honk! 🦆 I'm your GaggleGO guide! Need to adjust your schedule? Want to swap activities or change timing? Just tell me what you'd like to change!"
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const voiceRecognitionRef = useRef<VoiceRecognition | null>(null);
  const voiceSynthesisRef = useRef<VoiceSynthesis | null>(null);
  const [interimTranscript, setInterimTranscript] = useState("");

  // Initialize voice interfaces
  useEffect(() => {
    voiceRecognitionRef.current = new VoiceRecognition(
      (transcript, isFinal) => {
        if (isFinal) {
          setInput(prev => prev + ' ' + transcript);
          setInterimTranscript("");
        } else {
          setInterimTranscript(transcript);
        }
      },
      (error) => {
        toast({
          title: "Voice error",
          description: error,
          variant: "destructive"
        });
        setIsListening(false);
      }
    );

    voiceSynthesisRef.current = new VoiceSynthesis();

    return () => {
      voiceRecognitionRef.current?.stop();
      voiceSynthesisRef.current?.stop();
    };
  }, []);

  // Load chat history from database
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!tripId) return;

      try {
        const { data, error } = await supabase
          .from('chat_messages')
          .select('*')
          .eq('trip_id', tripId)
          .order('created_at', { ascending: true });

        if (error) throw error;

        if (data && data.length > 0) {
          setMessages([
            {
              role: "assistant",
              content: "Welcome back! 🦆 I remember our conversation. What would you like to adjust?"
            },
            ...data.map(msg => ({
              role: msg.role as "user" | "assistant",
              content: msg.content
            }))
          ]);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
      }
    };

    loadChatHistory();
  }, [tripId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const toggleVoiceInput = () => {
    if (isListening) {
      voiceRecognitionRef.current?.stop();
      setIsListening(false);
    } else {
      voiceRecognitionRef.current?.start();
      setIsListening(true);
    }
  };

  const toggleVoiceOutput = () => {
    setVoiceEnabled(!voiceEnabled);
    if (isSpeaking) {
      voiceSynthesisRef.current?.stop();
      setIsSpeaking(false);
    }
  };

  const speakMessage = async (text: string) => {
    if (!voiceEnabled || !voiceSynthesisRef.current) return;
    
    setIsSpeaking(true);
    try {
      await voiceSynthesisRef.current.speak(text, {
        rate: 1.1,
        pitch: 1.1
      });
    } finally {
      setIsSpeaking(false);
    }
  };

  const saveChatMessage = async (role: "user" | "assistant", content: string) => {
    if (!tripId || !user) return;

    try {
      await supabase
        .from('chat_messages')
        .insert([{
          trip_id: tripId,
          user_id: user.id,
          role,
          content
        }]);
    } catch (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const handleSend = async (messageText?: string) => {
    const textToSend = messageText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: Message = { role: "user", content: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setInterimTranscript("");
    setIsLoading(true);

    // Save user message
    await saveChatMessage("user", textToSend);

    // Stop listening when sending
    if (isListening) {
      voiceRecognitionRef.current?.stop();
      setIsListening(false);
    }

    try {
      const { data, error } = await supabase.functions.invoke('itinerary-chat', {
        body: {
          message: textToSend,
          location,
          currentItinerary,
          conversationHistory: messages,
          tripId
        }
      });

      if (error) throw error;

      const assistantMessage: Message = {
        role: "assistant",
        content: data.response
      };
      setMessages(prev => [...prev, assistantMessage]);

      // Save assistant message
      await saveChatMessage("assistant", data.response);

      // Speak response if voice is enabled
      if (voiceEnabled) {
        await speakMessage(data.response);
      }

      // If the AI suggests a new itinerary, update it
      if (data.updatedItinerary && onItineraryUpdate) {
        onItineraryUpdate(data.updatedItinerary);
        toast({
          title: "Schedule Updated! 🦆",
          description: "Your itinerary has been updated based on your request.",
        });
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Oops!",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
      
      const errorMsg = {
        role: "assistant" as const,
        content: "Sorry, I had trouble with that request. Could you try rephrasing it?"
      };
      setMessages(prev => [...prev, errorMsg]);
      await saveChatMessage("assistant", errorMsg.content);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-primary hover:bg-primary/90 z-50"
        size="icon"
      >
        {isOpen ? <X className="w-6 h-6" /> : <MessageSquare className="w-6 h-6" />}
      </Button>

      {/* Chat Window */}
      {isOpen && (
        <Card className="fixed bottom-24 right-6 w-[90vw] sm:w-96 h-[600px] shadow-2xl flex flex-col z-50 border-2 border-primary/20">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-lg">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <AnimatedGoose 
                  size="md" 
                  state={isLoading ? "thinking" : isSpeaking ? "talking" : "idle"} 
                />
                <div>
                  <h3 className="font-display font-bold">GaggleGO Guide</h3>
                  <p className="text-xs opacity-90">
                    {isLoading ? "Thinking..." : isSpeaking ? "Speaking..." : "Your friendly travel assistant"}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceOutput}
                  className="h-8 w-8 hover:bg-primary-foreground/20"
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
            </div>
            {isSpeaking && (
              <Badge variant="secondary" className="text-xs animate-pulse">
                🦆 Speaking...
              </Badge>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-background/50">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 flex items-start gap-2 ${
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground'
                  }`}
                >
                  {message.role === 'assistant' && (
                    <AnimatedGoose 
                      size="sm" 
                      state="idle" 
                      className="flex-shrink-0 mt-1"
                    />
                  )}
                  <span className="text-sm whitespace-pre-wrap">{message.content}</span>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl px-4 py-2 flex items-center gap-2">
                  <AnimatedGoose size="sm" state="thinking" />
                  <span className="text-sm">Thinking...</span>
                </div>
              </div>
            )}
            {isListening && interimTranscript && (
              <div className="flex justify-end">
                <div className="bg-primary/20 rounded-2xl px-4 py-2 border-2 border-primary/40">
                  <span className="text-sm italic text-muted-foreground">{interimTranscript}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Smart Suggestions */}
          <SmartSuggestions onSuggestionClick={handleSuggestionClick} disabled={isLoading} />

          {/* Input */}
          <div className="p-4 border-t bg-background">
            {isListening && (
              <div className="mb-2 text-center">
                <Badge variant="secondary" className="animate-pulse">
                  <Mic className="w-3 h-3 mr-1" />
                  Listening...
                </Badge>
              </div>
            )}
            <div className="flex gap-2">
              {voiceRecognitionRef.current?.isSupported() && (
                <Button
                  onClick={toggleVoiceInput}
                  variant={isListening ? "default" : "outline"}
                  size="icon"
                  className="flex-shrink-0"
                  disabled={isLoading}
                  title={isListening ? "Stop listening" : "Start voice input"}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </Button>
              )}
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={isListening ? "Speak now..." : "Ask to change your schedule..."}
                disabled={isLoading}
                className="flex-1"
              />
              <Button
                onClick={() => handleSend()}
                disabled={!input.trim() || isLoading}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};