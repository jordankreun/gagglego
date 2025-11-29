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
      {/* Bottom Panel - Collapsed State */}
      {!isOpen && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-primary text-primary-foreground shadow-lg border-t-4 border-primary">
          <Button
            onClick={() => setIsOpen(true)}
            variant="ghost"
            className="w-full h-16 rounded-none hover:bg-primary-foreground/20 flex items-center justify-center gap-3"
          >
            <AnimatedGoose size="md" state="idle" />
            <div className="flex flex-col items-start">
              <span className="font-display font-bold text-lg">Chat with GaggleGO Assistant</span>
              <span className="text-xs opacity-90">Click to open AI-powered itinerary editor</span>
            </div>
            <MessageSquare className="w-6 h-6 ml-auto" />
          </Button>
        </div>
      )}

      {/* Bottom Panel - Expanded State */}
      {isOpen && (
        <Card className="fixed bottom-0 left-0 right-0 z-40 h-[500px] shadow-2xl flex flex-col border-t-4 border-primary rounded-t-2xl">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-4 rounded-t-2xl">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <AnimatedGoose 
                  size="md" 
                  state={isLoading ? "thinking" : isSpeaking ? "talking" : "idle"} 
                />
                <div>
                  <h3 className="font-display font-bold text-lg">GaggleGO Assistant</h3>
                  <p className="text-sm opacity-90">
                    {isLoading ? "Thinking..." : isSpeaking ? "Speaking..." : "Your AI-powered itinerary editor"}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleVoiceOutput}
                  className="h-9 w-9 hover:bg-primary-foreground/20"
                  title={voiceEnabled ? "Disable voice" : "Enable voice"}
                >
                  {voiceEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="h-9 w-9 hover:bg-primary-foreground/20"
                >
                  <X className="w-5 h-5" />
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
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-background/50">
            <div className="max-w-4xl mx-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
                >
                  <div
                    className={`max-w-[75%] rounded-2xl px-5 py-3 flex items-start gap-3 ${
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
                    <span className="text-base whitespace-pre-wrap">{message.content}</span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-muted rounded-2xl px-5 py-3 flex items-center gap-3">
                    <AnimatedGoose size="sm" state="thinking" />
                    <span className="text-base">Thinking...</span>
                  </div>
                </div>
              )}
              {isListening && interimTranscript && (
                <div className="flex justify-end mb-4">
                  <div className="bg-primary/20 rounded-2xl px-5 py-3 border-2 border-primary/40">
                    <span className="text-base italic text-muted-foreground">{interimTranscript}</span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Smart Suggestions */}
          <div className="px-6">
            <SmartSuggestions onSuggestionClick={handleSuggestionClick} disabled={isLoading} />
          </div>

          {/* Input */}
          <div className="p-6 border-t bg-background">
            <div className="max-w-4xl mx-auto">
              {isListening && (
                <div className="mb-3 text-center">
                  <Badge variant="secondary" className="animate-pulse text-sm px-3 py-1">
                    <Mic className="w-4 h-4 mr-2" />
                    Listening...
                  </Badge>
                </div>
              )}
              <div className="flex gap-3">
                {voiceRecognitionRef.current?.isSupported() && (
                  <Button
                    onClick={toggleVoiceInput}
                    variant={isListening ? "default" : "outline"}
                    size="lg"
                    className="flex-shrink-0 h-12"
                    disabled={isLoading}
                    title={isListening ? "Stop listening" : "Start voice input"}
                  >
                    {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                  </Button>
                )}
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isListening ? "Speak now..." : "Ask to change your schedule..."}
                  disabled={isLoading}
                  className="flex-1 h-12 text-base"
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || isLoading}
                  size="lg"
                  className="flex-shrink-0 h-12 px-6"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}
    </>
  );
};