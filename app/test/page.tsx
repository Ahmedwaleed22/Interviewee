"use client";

import Image from "next/image";
import { useState, useRef } from "react";

export default function TestPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [isRecognizing, setIsRecognizing] = useState(false);
  
  // Refs to store audio and stream state for interruption
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaSourceRef = useRef<MediaSource | null>(null);
  const readerRef = useRef<ReadableStreamDefaultReader<Uint8Array> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const finalTranscriptRef = useRef<string>("");
  const recognitionRef = useRef<any>(null);

  // Function to interrupt/stop the speech playback
  const interruptSpeech = () => {
    console.log("Interrupting speech...");
    
    // Stop audio playback
    if (audioElementRef.current) {
      audioElementRef.current.pause();
      audioElementRef.current.currentTime = 0;
      console.log("Audio paused and reset");
    }
    
    // Cancel the reader stream
    if (readerRef.current) {
      readerRef.current.cancel().catch((err) => {
        console.error("Error canceling reader:", err);
      });
      console.log("Reader stream canceled");
    }
    
    // End the media source
    if (mediaSourceRef.current && mediaSourceRef.current.readyState === "open") {
      try {
        mediaSourceRef.current.endOfStream();
        console.log("MediaSource ended");
      } catch (err) {
        console.error("Error ending media source:", err);
      }
    }
    
    // Reset UI state
    setIsPlaying(false);
    setIsLoading(false);
    setError(null);
  };

  const generateSpeech = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: "Before you can begin to determine what the composition of a particular paragraph will be, you must first decide on an argument and a working thesis statement for your paper. What is the most important idea that you are trying to convey to your reader? The information in each paragraph must be related to that idea. In other words, your paragraphs should remind your reader that there is a recurrent relationship between your thesis and the information in each paragraph. A working thesis functions like a seed from which your paper, and your ideas, will grow. The whole process is an organic one—a natural progression from a seed to a full-blown paper where there are direct, familial relationships between all of the ideas in the paper. The decision about what to put into your paragraphs begins with the germination of a seed of ideas; this “germination process” is better known as brainstorming. There are many techniques for brainstorming; whichever one you choose, this stage of paragraph development cannot be skipped. Building paragraphs can be like building a skyscraper: there must be a well-planned foundation that supports what you are building. Any cracks, inconsistencies, or other corruptions of the foundation can cause your whole paper to crumble.",
          voice: "coral",
          instructions: "Speak in a cheerful and positive tone.",
          response_format: "mp3",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate speech");
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      // Use MediaSource for seamless streaming without interruption
      const reader = response.body.getReader();
      readerRef.current = reader; // Store for interruption
      const chunks: Uint8Array[] = [];
      let totalSize = 0;
      let sourceBuffer: SourceBuffer | null = null;
      let hasStartedPlayback = false;
      
      // Get content type from response headers
      const contentType = response.headers.get("content-type") || "audio/mpeg";
      console.log("Content-Type:", contentType);
      
      // Setup MediaSource
      const mediaSource = new MediaSource();
      mediaSourceRef.current = mediaSource; // Store for interruption
      const audioElement = new Audio();
      audioElementRef.current = audioElement; // Store for interruption
      const audioUrl = URL.createObjectURL(mediaSource);
      audioElement.src = audioUrl;
      
      console.log("MediaSource created");
      
      mediaSource.addEventListener("sourceopen", async () => {
        console.log("MediaSource opened");
        
        try {
          // Create source buffer with proper codec
          sourceBuffer = mediaSource.addSourceBuffer(contentType);
          console.log("SourceBuffer created");
          
          // Helper to wait for source buffer to finish updating
          const waitForSourceBuffer = async () => {
            return new Promise<void>((resolve) => {
              if (!sourceBuffer!.updating) {
                resolve();
              } else {
                const onUpdateEnd = () => {
                  sourceBuffer!.removeEventListener("updateend", onUpdateEnd);
                  resolve();
                };
                sourceBuffer!.addEventListener("updateend", onUpdateEnd);
              }
            });
          };
          
          // Start appending chunks as they arrive
          let chunkCount = 0;
          let lastChunkTime = Date.now();
          
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // Wait for last buffer to be appended
              await waitForSourceBuffer();
              const totalTime = Date.now() - lastChunkTime;
              console.log(`Stream complete after ${totalTime}ms. Total chunks: ${chunks.length}, Total size: ${totalSize} bytes`);
              mediaSource!.endOfStream();
              break;
            }
            
            if (!value || value.byteLength === 0) {
              console.warn("Received empty chunk, skipping");
              continue;
            }
            
            chunks.push(value);
            totalSize += value.byteLength;
            chunkCount++;
            
            const timeSinceLastChunk = Date.now() - lastChunkTime;
            lastChunkTime = Date.now();
            
            if (chunkCount % 10 === 0 || value.byteLength > 100000) {
              console.log(`Chunk ${chunkCount}: ${value.byteLength} bytes. Total: ${totalSize} bytes. Time since last: ${timeSinceLastChunk}ms`);
            }
            
            // Wait for previous buffer to finish updating before appending new one
            await waitForSourceBuffer();
            
            try {
              sourceBuffer!.appendBuffer(value);
              
              // Start playing once we have enough buffered
              if (!hasStartedPlayback && totalSize > 150 * 1024) {
                console.log(`Threshold reached at chunk ${chunkCount}, starting playback with ${totalSize} bytes`);
                audioElement!.play().catch((err) => {
                  console.error("Play error:", err);
                  setError("Failed to start playback: " + err.message);
                });
                hasStartedPlayback = true;
              }
            } catch (e) {
              console.error("Error appending buffer:", e);
              // If append fails, try again next iteration
              chunks.pop();
              totalSize -= value.byteLength;
            }
          }
        } catch (err) {
          console.error("MediaSource error:", err);
          setError("Failed to stream audio: " + (err instanceof Error ? err.message : "Unknown error"));
          try {
            mediaSource!.endOfStream("network");
          } catch (e) {
            console.error("Error ending stream:", e);
          }
        }
      });
      
      audioElement.addEventListener("play", () => {
        console.log("Audio started playing");
        setIsPlaying(true);
      });
      
      audioElement.addEventListener("pause", () => {
        console.log("Audio paused");
        setIsPlaying(false);
      });
      
      audioElement.addEventListener("loadstart", () => {
        console.log("Audio loading started");
      });
      
      audioElement.addEventListener("canplay", () => {
        console.log("Audio can play");
      });
      
      audioElement.addEventListener("ended", () => {
        console.log("Audio playback ended");
        setIsPlaying(false);
        URL.revokeObjectURL(audioUrl);
        setIsLoading(false);
      });
      
      audioElement.addEventListener("error", (e) => {
        console.error("Audio error:", e, audioElement?.error);
        setError(`Audio error: ${audioElement?.error?.message || "Unknown error"}`);
        setIsPlaying(false);
        setIsLoading(false);
        URL.revokeObjectURL(audioUrl);
      });
    } catch (err) {
      console.error("Error generating speech:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  const startRecognition = () => {
    // Check if speech recognition is supported
    if (typeof (window as any).webkitSpeechRecognition === "undefined") {
      setError("Speech recognition not supported in this browser");
      return;
    }

    // Stop any existing recognition first
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log("Error stopping previous recognition:", e);
      }
    }

    // Create new recognition instance
    const recognition = new (window as any).webkitSpeechRecognition();
    recognitionRef.current = recognition;

    // Reset transcript for new session
    finalTranscriptRef.current = "";
    setTranscript("");
    setIsRecognizing(true);

    // Configure for continuous recognition
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event: any) => {
      let interimTranscript = "";
      let newFinalTranscript = "";

      // Process all results
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          newFinalTranscript += transcript + " ";
        } else {
          interimTranscript += transcript;
        }
      }

      // Update the final transcript ref with new final results
      if (newFinalTranscript) {
        finalTranscriptRef.current += newFinalTranscript;
      }

      // Update transcript with accumulated final results + current interim results
      setTranscript(finalTranscriptRef.current + (interimTranscript ? ` [${interimTranscript}]` : ""));
    };

    recognition.onerror = (event: any) => {
      console.error("Recognition error:", event.error);
      if (event.error === "no-speech") {
        // This is normal when user stops talking, don't show error
        return;
      }
      if (event.error === "aborted") {
        // User stopped recognition, this is expected
        setIsRecognizing(false);
        return;
      }
      setError(`Recognition error: ${event.error}`);
      setIsRecognizing(false);
    };

    recognition.onend = () => {
      console.log("Recognition ended");
      setIsRecognizing(false);
      // Optionally restart if it ended unexpectedly
      // This can happen if there's a long pause
    };

    try {
      recognition.start();
    } catch (e) {
      console.error("Error starting recognition:", e);
      setError("Failed to start recognition. It may already be running.");
      setIsRecognizing(false);
    }
  };

  const stopRecognition = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        setIsRecognizing(false);
        console.log("Recognition stopped");
      } catch (e) {
        console.error("Error stopping recognition:", e);
        setError("Failed to stop recognition");
      }
    } else {
      console.log("No recognition instance to stop");
      setIsRecognizing(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            To get started, edit the page.tsx file.
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Looking for a starting point or more instructions? Head over to{" "}
            <a
              href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Templates
            </a>{" "}
            or the{" "}
            <a
              href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
              className="font-medium text-zinc-950 dark:text-zinc-50"
            >
              Learning
            </a>{" "}
            center.
          </p>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                onClick={generateSpeech}
                disabled={isLoading || isPlaying}
                className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed md:w-auto"
              >
                {isLoading ? "Generating..." : "Generate Speech"}
              </button>
              {isPlaying && (
                <button
                  onClick={interruptSpeech}
                  className="flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 md:w-auto"
                >
                  Stop Speech
                </button>
              )}
            </div>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 w-full">
            <textarea 
              className="w-full h-40 p-2 border border-gray-300 rounded-md dark:bg-zinc-900 dark:border-zinc-700 dark:text-zinc-50" 
              value={transcript} 
              onChange={(e) => setTranscript(e.target.value)} 
              placeholder="Transcript will appear here..."
            />
            <div className="flex flex-col gap-2 sm:flex-row">
              <button 
                onClick={startRecognition}
                disabled={isRecognizing}
                className="flex h-12 w-full items-center justify-center rounded-full bg-green-600 px-5 text-white transition-colors hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed md:w-auto"
              >
                {isRecognizing ? "Recognizing..." : "Start Recognition"}
              </button>
              <button 
                onClick={stopRecognition}
                disabled={!isRecognizing}
                className="flex h-12 w-full items-center justify-center rounded-full bg-red-600 px-5 text-white transition-colors hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed md:w-auto"
              >
                Stop Recognition
              </button>
            </div>
        </div>
      </main>
    </div>
  );
}
