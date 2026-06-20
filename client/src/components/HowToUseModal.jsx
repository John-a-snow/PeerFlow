import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight, User, Key, MessageSquare, Share2, HelpCircle, AlertCircle } from "lucide-react";

export default function HowToUseModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Choose Profile",
      icon: <User className="w-6 h-6 text-white" />,
      color: "bg-crimson",
      headline: "1. CHOOSE YOUR AVATAR & NAME",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed">
            Choose an emoji and type in a name. This is how other people in the room will see you.
          </p>
          <div className="p-4 border-2 border-black rounded-2xl bg-white dark:bg-[#1a1a20] space-y-3 shadow-flatHover">
            <div className="flex items-center gap-3">
              <span className="text-3xl p-1 bg-cream border-2 border-black rounded-xl">🦊</span>
              <div>
                <p className="text-xs text-zinc-400 font-mono">YOUR NICKNAME</p>
                <p className="text-sm font-extrabold font-mono">PixelCoder</p>
              </div>
            </div>
            <div className="w-full bg-cyberGreen/10 border border-cyberGreen text-cyberGreen p-2 rounded-xl text-[10px] font-mono font-bold text-center">
              SAVED LOCALLY — NO SIGNUP REQUIRED
            </div>
          </div>
          <ul className="text-xs space-y-2 font-mono text-zinc-650 dark:text-zinc-400 list-disc pl-4">
            <li>Click any emoji to select your avatar badge.</li>
            <li>Type in a nickname (letters and numbers only, up to 16 characters).</li>
            <li>Your details are saved on this browser for the next time you visit.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Rooms",
      icon: <Key className="w-6 h-6 text-zinc-955" />,
      color: "bg-cyberGold",
      headline: "2. HANG OUT IN ROOMS",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed">
            To share files or chat, you and your friends need to join the same room. You can start a new room or join an existing one in seconds.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 border-2 border-black rounded-2xl bg-white dark:bg-[#1a1a20] text-center shadow-flatHover">
              <span className="text-xs font-bold font-mono block mb-1">ROOM CODE</span>
              <span className="text-lg font-extrabold font-mono text-crimson tracking-wider">X9Y2A1</span>
            </div>
            <div className="p-3 border-2 border-black rounded-2xl bg-white dark:bg-[#1a1a20] flex flex-col items-center justify-center shadow-flatHover">
              <span className="text-xs font-bold font-mono block mb-1">QR CODE</span>
              <span className="w-6 h-6 border border-black bg-zinc-950 flex items-center justify-center text-[10px] text-white font-bold rounded">QR</span>
            </div>
          </div>
          <ul className="text-xs space-y-2 font-mono text-zinc-650 dark:text-zinc-400 list-disc pl-4">
            <li>Create Room: Type a name to start a new space.</li>
            <li>Join Room: Enter the 6-character room code shared by your friend.</li>
            <li>Scan QR: Use your phone or camera to scan the room QR code and join instantly.</li>
          </ul>
        </div>
      )
    },
    {
      title: "Chat & Hub",
      icon: <MessageSquare className="w-6 h-6 text-zinc-955" />,
      color: "bg-cyberGreen",
      headline: "3. TALK & SHARE LINKS",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed">
            Send quick text messages to anyone in the room, or pin website links and notes in the Resource Hub for everyone to see.
          </p>
          <div className="p-3 border-2 border-black rounded-2xl bg-[#eae0d0] dark:bg-charcoal space-y-2 shadow-flatHover">
            <div className="flex gap-2 text-xs">
              <span className="font-extrabold">Chat:</span>
              <span className="font-mono text-zinc-650 dark:text-zinc-350">"Just uploaded the design doc!"</span>
            </div>
            <div className="border-t border-black/20 pt-2 flex gap-2 text-xs">
              <span className="font-extrabold">Resource Hub:</span>
              <span className="font-mono text-crimson underline truncate">https://github.com/project</span>
            </div>
          </div>
          <ul className="text-xs space-y-2 font-mono text-zinc-650 dark:text-zinc-400 list-disc pl-4">
            <li>Chat: Talk with other members currently in the room.</li>
            <li>Resource Hub: Post links or text notes. They stay saved in the room for later.</li>
          </ul>
        </div>
      )
    },
    {
      title: "File Share",
      icon: <Share2 className="w-6 h-6 text-white" />,
      color: "bg-crimson",
      headline: "4. SEND FILES DIRECTLY",
      content: (
        <div className="space-y-4">
          <p className="text-sm font-medium leading-relaxed">
            Send photos, videos, documents, or folder zip files of any size directly from your browser to your friends.
          </p>
          <div className="p-3 border-2 border-black rounded-2xl bg-white dark:bg-[#1a1a20] space-y-2 shadow-flatHover text-xs">
            <div className="flex justify-between font-mono font-bold">
              <span>design_final.zip</span>
              <span className="text-cyberGreen">Direct Browser Sync</span>
            </div>
            <div className="w-full bg-zinc-200 dark:bg-zinc-800 h-2 border border-black rounded-full overflow-hidden">
              <div className="bg-cyberGreen h-full w-[75%]" />
            </div>
          </div>
          <div className="flex gap-2 p-2 border border-yellow-500 bg-yellow-500/10 text-yellow-600 rounded-xl items-start">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-[10px] font-mono">
              If network firewalls block a direct browser connection, we automatically route files through secure WebSockets so they still arrive.
            </p>
          </div>
          <ul className="text-xs space-y-2 font-mono text-zinc-650 dark:text-zinc-400 list-disc pl-4">
            <li>Select or drag your files into the "Share Files" tab, then click Send.</li>
            <li>The receiver must click Accept to start the download.</li>
            <li>Keep the browser tab open until the transfer reaches 100%.</li>
          </ul>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div className="w-full max-w-2xl brutal-card bg-cream dark:bg-darkBg relative flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200 border-4 border-black shadow-[8px_8px_0px_#000000]">
        
        <header className="flex items-center justify-between p-6 border-b-4 border-black bg-white dark:bg-[#1a1a20]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 border-2 border-black bg-cyberGold flex items-center justify-center shadow-flat rounded-xl shrink-0">
              <HelpCircle className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-extrabold text-lg uppercase tracking-wider text-zinc-950 dark:text-white leading-none">HOW TO USE</h3>
              <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-mono uppercase tracking-wider font-bold">PEERFLOW WORKSPACE GUIDE</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 border-2 border-black bg-white dark:bg-[#1a1a20] shadow-flat hover:shadow-flatHover hover:translate-x-[1px] hover:translate-y-[1px] rounded-lg text-zinc-650 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-all"
          >
            <X className="w-4.5 h-4.5" />
          </button>
        </header>

        <div className="px-6 pt-4">
          <div className="w-full h-3 border-2 border-black bg-white dark:bg-[#1a1a20] rounded-full overflow-hidden shadow-[2px_2px_0px_#000000]">
            <div 
              className="bg-crimson h-full transition-all duration-300"
              style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-6 pt-4 flex gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {steps.map((step, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              className={`px-3 py-1.5 border-2 border-black rounded-xl text-xs font-mono font-bold uppercase transition-all shadow-[2px_2px_0px_#000000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_#000000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none shrink-0 ${
                currentStep === idx
                  ? "bg-cyberGold text-zinc-950"
                  : "bg-white dark:bg-[#1a1a20] text-zinc-650 dark:text-zinc-400"
              }`}
            >
              {idx + 1}. {step.title}
            </button>
          ))}
        </div>

        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl border-2 border-black ${steps[currentStep].color} flex items-center justify-center shadow-flat shrink-0`}>
              {steps[currentStep].icon}
            </div>
            <h4 className="font-extrabold text-base uppercase tracking-wider text-zinc-950 dark:text-white">
              {steps[currentStep].headline}
            </h4>
          </div>

          <div className="text-zinc-800 dark:text-zinc-200">
            {steps[currentStep].content}
          </div>
        </div>

        <footer className="flex items-center justify-between p-6 border-t-4 border-black bg-white dark:bg-[#1a1a20]">
          <button
            onClick={handlePrev}
            disabled={currentStep === 0}
            className="flex items-center gap-1.5 py-2.5 px-4 brutal-btn-secondary text-xs disabled:opacity-50 disabled:pointer-events-none"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <span className="font-mono text-xs font-bold text-zinc-500">
            {currentStep + 1} / {steps.length}
          </span>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 py-2.5 px-5 brutal-btn text-xs"
          >
            {currentStep === steps.length - 1 ? "Get Started" : "Next"} <ChevronRight className="w-4 h-4" />
          </button>
        </footer>

      </div>
    </div>
  );
}
