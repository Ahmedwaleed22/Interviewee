"use client";

import Image from "next/image";
import { useState } from "react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      // Stream audio: read chunks and start playing once we have enough data
      // We'll continue reading all chunks but start playing early
      const reader = response.body.getReader();
      const chunks: BlobPart[] = [];
      let totalBytes = 0;
      let hasStartedPlaying = false;
      let audio: HTMLAudioElement | null = null;
      let audioUrl: string | null = null;
      const minBytesToStart = 30000; // Start playing after ~30KB (much faster than full file)

      // Read stream and start playing once we hit the threshold
      (async () => {
        try {
          while (true) {
            const { done, value } = await reader.read();
            
            if (done) {
              // If we haven't started playing yet, play now with all data
              if (!hasStartedPlaying && chunks.length > 0) {
                const blob = new Blob(chunks, { type: "audio/mpeg" });
                audioUrl = URL.createObjectURL(blob);
                audio = new Audio(audioUrl);
                
                audio.play().catch((err) => {
                  console.error("Error playing audio:", err);
                  setError("Failed to play audio");
                });
                
                audio.addEventListener("ended", () => {
                  URL.revokeObjectURL(audioUrl!);
                });
                
                setIsLoading(false);
              }
              break;
            }
            
            chunks.push(value);
            totalBytes += value.length;
            
            // Start playing once we have enough data (continue reading rest in background)
            if (!hasStartedPlaying && totalBytes >= minBytesToStart) {
              // Create blob from all accumulated chunks so far
              // We'll continue reading and the browser will buffer ahead
              const blob = new Blob(chunks, { type: "audio/mpeg" });
              audioUrl = URL.createObjectURL(blob);
              audio = new Audio(audioUrl);
              
              // Start playing immediately
              audio.play().catch((err) => {
                console.error("Error playing audio:", err);
                setError("Failed to play audio");
              });
              
              audio.addEventListener("ended", () => {
                URL.revokeObjectURL(audioUrl!);
              });
              
              hasStartedPlaying = true;
              setIsLoading(false);
              
              // Continue reading remaining chunks - we'll need to recreate the blob
              // But for now, the initial blob should have enough buffer
            }
          }
          
          // If we started playing early, we need to update with final blob containing all chunks
          if (hasStartedPlaying && audio && chunks.length > 0) {
            // Create final blob with ALL chunks
            const finalBlob = new Blob(chunks, { type: "audio/mpeg" });
            const finalUrl = URL.createObjectURL(finalBlob);
            
            // Update audio source with complete blob
            audio.src = finalUrl;
            audio.load(); // Reload with new source
            
            // Clean up old URL
            if (audioUrl) {
              URL.revokeObjectURL(audioUrl);
            }
            audioUrl = finalUrl;
          }
        } catch (err) {
          console.error("Error reading stream:", err);
          setError("Failed to read audio stream");
          setIsLoading(false);
        }
      })();
    } catch (err) {
      console.error("Error generating speech:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
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
            <button
              onClick={generateSpeech}
              disabled={isLoading}
              className="flex h-12 w-full items-center justify-center rounded-full bg-blue-600 px-5 text-white transition-colors hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed md:w-auto"
            >
              {isLoading ? "Generating..." : "Generate Speech"}
            </button>
            {error && (
              <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
            )}
          </div>
        </div>
        <div className="flex flex-col gap-4 text-base font-medium sm:flex-row">
          <a
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-foreground px-5 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc] md:w-[158px]"
            href="https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              className="dark:invert"
              src="/vercel.svg"
              alt="Vercel logomark"
              width={16}
              height={16}
            />
            Deploy Now
          </a>
          <a
            className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/[.08] px-5 transition-colors hover:border-transparent hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-[158px]"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Documentation
          </a>
        </div>
      </main>
    </div>
  );
}
