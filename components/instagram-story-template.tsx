import { Badge } from "@/components/ui/badge"
import { BookOpen } from "lucide-react"

export default function InstagramStoryTemplate() {
  return (
    <div className="w-[375px] h-[667px] bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Grid lines */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)] opacity-20"></div>
      <div className="absolute inset-0 bg-[linear-gradient(to_right,transparent,transparent_40px,rgba(255,255,255,0.05)_40px,rgba(255,255,255,0.05)_41px)] opacity-20"></div>

      {/* Animated elements */}
      <div className="absolute w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle_at_center,#333_0%,#111_100%)] top-[20%] left-[20%] opacity-30 blur-sm animate-float-slow"></div>
      <div className="absolute w-[160px] h-[160px] rounded-full border border-white/30 top-[30%] left-[50%] opacity-30 animate-float-medium"></div>

      {/* Stars */}
      <div className="absolute w-[4px] h-[4px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[5%] right-[25%]"></div>
      <div className="absolute w-[6px] h-[6px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[15%] right-[15%]"></div>
      <div className="absolute w-[5px] h-[5px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[40%] right-[35%]"></div>
      <div className="absolute w-[3px] h-[3px] bg-white rounded-full shadow-[0_0_10px_2px_rgba(255,255,255,0.7)] opacity-70 top-[55%] right-[45%]"></div>

      {/* Story Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-white">
        <div className="text-center mb-8">
          <div className="w-16 h-16 relative bg-black/50 rounded-full flex items-center justify-center border border-white/20 overflow-hidden mx-auto mb-4">
            <img src="/images/execfit-logo.png" alt="ExecFit Logo" className="w-full h-full object-contain p-1" />
          </div>
          <h1 className="text-3xl font-bold mb-2 uppercase tracking-widest text-shadow-glow">PREMIUM COOKBOOKS</h1>
          <p className="text-lg opacity-90">Elevate your nutrition</p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white/10 backdrop-blur-sm rounded-lg p-3 text-center border border-white/10">
              <BookOpen className="w-6 h-6 mx-auto mb-1" />
              <p className="text-xs font-medium">Cookbook {i}</p>
            </div>
          ))}
        </div>

        <Badge className="bg-white text-black text-lg px-6 py-2 mb-4 font-semibold">Swipe Up to Get Yours!</Badge>

        <div className="text-center">
          <p className="text-sm opacity-75">Follow @yourbusiness</p>
          <p className="text-sm opacity-75">Get instant download access</p>
        </div>
      </div>

      {/* Swipe Up Indicator */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="w-12 h-1 bg-white/50 rounded-full animate-pulse"></div>
      </div>
    </div>
  )
}
