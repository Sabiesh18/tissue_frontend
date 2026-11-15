import React from 'react';

/**
 * Animated Toilet Paper Roll Full-Page Loader
 * Inspired by Dribbble creative loading concepts:
 * - A 3D isometric/cylindrical toilet paper roll with inner brown cardboard core
 * - An animated unrolling tissue paper ribbon with perforation cut-lines
 * - Smooth wave animation and gentle rolling rotation
 * - Clean white card backdrop with curved edges matching the theme
 */
export const ToiletPaperLoader: React.FC<{ message?: string }> = ({
  message = 'Loading Tissue Manufacturing System...',
}) => {
  return (
    <div className="fixed inset-0 z-50 bg-[#FFF0F5]/90 backdrop-blur-md flex flex-col items-center justify-center p-4 select-none font-roboto">
      <div className="bg-white p-8 rounded-3xl shadow-2xl border border-[#F8B4D0] flex flex-col items-center max-w-sm w-full relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-[#FFF0F5] rounded-full filter blur-xl opacity-70"></div>

        {/* Animated Toilet Roll Illustration */}
        <div className="relative w-40 h-32 flex items-center justify-center my-4">
          {/* Toilet Roll Body */}
          <div className="relative flex items-center">
            {/* The Roll Cylinder */}
            <div className="w-20 h-24 bg-white rounded-3xl border-4 border-gray-200 shadow-xl relative z-20 flex flex-col justify-between p-1.5 animate-bounce-subtle">
              {/* Paper Layers Top Cap */}
              <div className="w-full h-8 rounded-full bg-gray-50 border-2 border-gray-300 flex items-center justify-center shadow-inner relative">
                {/* Spiral Lines representing wrapped tissue sheets */}
                <div className="w-12 h-6 rounded-full border border-gray-200 flex items-center justify-center">
                  {/* Cardboard Core Hole */}
                  <div className="w-6 h-3 rounded-full bg-[#8D6E63] border border-[#5D4037] shadow-inner flex items-center justify-center">
                    <div className="w-3 h-1.5 rounded-full bg-[#4E342E]"></div>
                  </div>
                </div>
              </div>

              {/* Embossed Paper Texture dots on the roll body */}
              <div className="flex justify-around px-1 py-1 opacity-25">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span>
              </div>

              {/* Perforation detail on the roll */}
              <div className="w-full border-b-2 border-dashed border-gray-300"></div>

              {/* Bottom shadow of cylinder */}
              <div className="w-full h-2 rounded-full bg-gray-100"></div>
            </div>

            {/* Unrolling Paper Strip */}
            <div className="relative -ml-2 z-10">
              <svg
                className="w-28 h-20 text-white drop-shadow-md overflow-visible animate-unroll"
                viewBox="0 0 120 70"
                fill="none"
              >
                {/* Paper Strip Curve */}
                <path
                  d="M0 15 C 30 15, 45 45, 80 45 C 95 45, 110 55, 115 65"
                  stroke="#E5E7EB"
                  strokeWidth="24"
                  strokeLinecap="round"
                />
                <path
                  d="M0 15 C 30 15, 45 45, 80 45 C 95 45, 110 55, 115 65"
                  stroke="#FFFFFF"
                  strokeWidth="20"
                  strokeLinecap="round"
                />
                {/* Perforation Line on the hanging sheet */}
                <path
                  d="M75 35 L 75 55"
                  stroke="#D8276D"
                  strokeWidth="2"
                  strokeDasharray="3 3"
                />
              </svg>
            </div>
          </div>

          {/* Floor Shadow */}
          <div className="absolute -bottom-1 w-28 h-3 bg-black/10 rounded-full filter blur-[2px] animate-pulse"></div>
        </div>

        {/* Loading Text & Pulsing Brand */}
        <div className="text-center mt-2 space-y-1.5">
          <h3 className="font-black text-base text-black tracking-tight">{message}</h3>
          <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[#D8276D]">
            <span className="w-2 h-2 rounded-full bg-[#D8276D] animate-ping"></span>
            <span>Initializing Plant Engine</span>
          </div>
        </div>

        {/* Progress bar line */}
        <div className="w-full bg-[#FFF0F5] h-1.5 rounded-full mt-5 overflow-hidden border border-[#F8B4D0]/50">
          <div className="h-full bg-gradient-to-r from-[#DF538B] to-[#D8276D] rounded-full animate-progress"></div>
        </div>
      </div>
    </div>
  );
};
