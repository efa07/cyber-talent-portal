import Link from "next/link"
import Image from "next/image"
import {
  Shield,
  Search,
  ClipboardCheck,
  BookOpen,
  Info,
  LogIn,
  Home,
  Folder,
  Eye,
  Heart,
  MessageSquare,
  Settings,
  Lock,
  Wifi,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#f0f4f8] overflow-hidden relative" id="landing-root">

      {/* Subtle grid/circuit background pattern */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-[0.04]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23334155' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      {/* Navigation */}
      <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-md border-b border-slate-200/60 shadow-sm" id="header-nav">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">

          {/* Logo + Brand */}
          <Link href="/" className="flex items-center gap-3 group" id="logo-link">
            <Image
              src="/logo.png"
              alt="Ethiopian Cyber Talent Portal Logo"
              width={52}
              height={52}
              className="object-contain drop-shadow-md transition-transform group-hover:scale-105"
              priority
            />
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="text-[15px] font-extrabold tracking-wide text-slate-800 uppercase" style={{ letterSpacing: '0.08em' }}>
                Cyber
              </span>
              <span className="text-[15px] font-extrabold tracking-wide text-slate-800 uppercase" style={{ letterSpacing: '0.08em' }}>
                Talent Portal
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8 text-[14px] font-medium text-slate-600" id="desktop-nav">
            <Link href="#" className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <Search className="h-3.5 w-3.5" />
              Browse Profiles
            </Link>
            <Link href="#" className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <ClipboardCheck className="h-3.5 w-3.5" />
              Skills Assessment
            </Link>
            <Link href="#" className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" />
              Resources
            </Link>
            <Link href="#" className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <Info className="h-3.5 w-3.5" />
              About
            </Link>
            <Link href="/login" className="hover:text-teal-600 transition-colors flex items-center gap-1.5">
              <LogIn className="h-3.5 w-3.5" />
              Login
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button className="lg:hidden p-2 text-slate-600 hover:text-slate-900" aria-label="Menu" id="mobile-menu-btn">
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </header>

      <main className="flex-1 relative z-10">

        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 lg:pt-20 lg:pb-10" id="hero-section">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[65vh]">

            {/* Left side — Headline + CTAs */}
            <div className="space-y-8 relative z-10">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] xl:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.08] uppercase" id="hero-heading">
                Unlock Ethiopia&apos;s<br />
                Elite Cyber<br />
                Defenders.
              </h1>

              <p className="text-base sm:text-lg text-slate-500 max-w-md leading-relaxed">
                Connect with vetted cybersecurity specialists, ethical
                hackers, and digital forensics experts ready to secure
                your digital future.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold tracking-widest uppercase border-2 border-teal-500 text-teal-600 rounded-md hover:bg-teal-500 hover:text-white transition-all duration-200"
                  id="cta-explore"
                >
                  Explore Talent Profiles
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center justify-center h-12 px-8 text-sm font-bold tracking-widest uppercase border-2 border-slate-300 text-slate-600 rounded-md hover:bg-slate-800 hover:text-white hover:border-slate-800 transition-all duration-200"
                  id="cta-challenge"
                >
                  Post a Challenge
                </Link>
              </div>

              {/* Floating code snippet — bottom-left */}
              <div className="hidden md:block font-mono text-[13px] text-slate-400 mt-8 select-none opacity-70">
                <div className="text-teal-500/60">&lt;script&gt;</div>
                <div className="pl-6">security.login()</div>
                <div className="pl-6 text-slate-300">&#47;&#47; ethical hacking phase</div>
                <div className="text-teal-500/60">&lt;/script&gt;</div>
              </div>
            </div>

            {/* Right side — Digital Dossier Card + Floating elements */}
            <div className="relative flex items-center justify-center lg:justify-end" id="hero-visual">

              {/* Background glow effect */}
              <div className="absolute w-[400px] h-[400px] bg-gradient-to-br from-teal-200/30 via-cyan-100/20 to-transparent rounded-full blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

              {/* Floating mini cards */}
              {/* Top-left chart card */}
              <div className="absolute top-4 left-0 lg:left-4 bg-white shadow-lg rounded-xl p-3 flex items-center gap-2 z-20 animate-[float_6s_ease-in-out_infinite]">
                <div className="flex gap-0.5 items-end h-8">
                  <div className="w-1.5 bg-teal-300 rounded-sm" style={{ height: '40%' }} />
                  <div className="w-1.5 bg-teal-400 rounded-sm" style={{ height: '65%' }} />
                  <div className="w-1.5 bg-teal-500 rounded-sm" style={{ height: '50%' }} />
                  <div className="w-1.5 bg-teal-400 rounded-sm" style={{ height: '80%' }} />
                  <div className="w-1.5 bg-teal-500 rounded-sm" style={{ height: '60%' }} />
                </div>
              </div>

              {/* Top-right small data card */}
              <div className="absolute -top-2 right-0 lg:right-8 bg-white shadow-lg rounded-xl p-3 z-20 animate-[float_5s_ease-in-out_1s_infinite]">
                <div className="text-[10px] text-slate-400 font-medium">Data</div>
                <div className="flex gap-1 mt-1">
                  <div className="w-6 h-1.5 bg-teal-400 rounded-full" />
                  <div className="w-4 h-1.5 bg-slate-200 rounded-full" />
                </div>
              </div>

              {/* Right-side floating code */}
              <div className="hidden xl:block absolute -right-4 top-8 font-mono text-[11px] text-slate-300 select-none z-10 opacity-60">
                <div className="text-cyan-400/50">&lt;script&gt;</div>
                <div className="pl-3 text-slate-400/50">security.login()</div>
                <div className="pl-3 text-slate-300/50">&#47;&#47; ethical hacking phase</div>
              </div>

              {/* Bottom-right data card */}
              <div className="absolute bottom-12 -right-2 lg:right-0 bg-white shadow-lg rounded-xl p-3 z-20 animate-[float_7s_ease-in-out_0.5s_infinite]">
                <div className="text-[10px] text-slate-400 font-medium">Data</div>
                <div className="flex gap-1 mt-1">
                  <div className="w-5 h-1.5 bg-orange-300 rounded-full" />
                  <div className="w-3 h-1.5 bg-slate-200 rounded-full" />
                </div>
              </div>

              {/* Main Digital Dossier Card */}
              <div className="relative z-10 bg-white rounded-2xl shadow-2xl border border-slate-200/80 w-[320px] sm:w-[360px] p-6 space-y-5" id="dossier-card">

                {/* Card Header */}
                <div className="text-center">
                  <h3 className="text-lg font-bold text-slate-800">Digital Dossier</h3>
                </div>

                {/* Profile section */}
                <div className="flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 border-4 border-white shadow-inner flex items-center justify-center overflow-hidden">
                    <svg className="w-12 h-12 text-slate-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </div>
                  <div className="text-center">
                    <div className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">Name</div>
                    <div className="text-base font-bold text-slate-800">Abebe Kebede</div>
                    <div className="text-xs text-teal-600 font-medium">Certified Ethical Hacker</div>
                  </div>
                </div>

                {/* Skills Label */}
                <div className="text-sm font-bold text-slate-700">Skills</div>

                {/* Skills Radar Chart (SVG) */}
                <div className="relative mx-auto w-48 h-48">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    {/* Pentagon grid lines */}
                    {[1, 0.75, 0.5, 0.25].map((scale, i) => {
                      const r = 80 * scale
                      const cx = 100, cy = 100
                      const points = Array.from({ length: 5 }, (_, k) => {
                        const angle = (Math.PI * 2 * k) / 5 - Math.PI / 2
                        return `${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`
                      }).join(' ')
                      return <polygon key={i} points={points} fill="none" stroke="#e2e8f0" strokeWidth="1" />
                    })}
                    {/* Axis lines */}
                    {Array.from({ length: 5 }, (_, k) => {
                      const angle = (Math.PI * 2 * k) / 5 - Math.PI / 2
                      return (
                        <line
                          key={k}
                          x1="100" y1="100"
                          x2={100 + 80 * Math.cos(angle)}
                          y2={100 + 80 * Math.sin(angle)}
                          stroke="#e2e8f0" strokeWidth="1"
                        />
                      )
                    })}
                    {/* Data polygon */}
                    {(() => {
                      const values = [0.85, 0.7, 0.75, 0.6, 0.8]
                      const cx = 100, cy = 100, r = 80
                      const points = values.map((v, k) => {
                        const angle = (Math.PI * 2 * k) / 5 - Math.PI / 2
                        return `${cx + r * v * Math.cos(angle)},${cy + r * v * Math.sin(angle)}`
                      }).join(' ')
                      return (
                        <>
                          <polygon points={points} fill="rgba(20,184,166,0.15)" stroke="#14b8a6" strokeWidth="2" />
                          {values.map((v, k) => {
                            const angle = (Math.PI * 2 * k) / 5 - Math.PI / 2
                            return <circle key={k} cx={cx + r * v * Math.cos(angle)} cy={cy + r * v * Math.sin(angle)} r="4" fill="#14b8a6" />
                          })}
                        </>
                      )
                    })()}
                  </svg>

                  {/* Labels around the chart */}
                  <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 text-[10px] font-semibold text-slate-600 whitespace-nowrap">Penetration Testing</span>
                  <span className="absolute top-1/3 right-0 translate-x-2 text-[10px] font-semibold text-slate-600 whitespace-nowrap">Network Security</span>
                  <span className="absolute bottom-2 right-4 text-[10px] font-semibold text-slate-600 whitespace-nowrap text-center">Security<br/>Architecture</span>
                  <span className="absolute bottom-2 left-4 text-[10px] font-semibold text-slate-600 whitespace-nowrap">Incident Response</span>
                  <span className="absolute top-1/3 left-0 -translate-x-2 text-[10px] font-semibold text-slate-600 whitespace-nowrap">Data<br/>Analysis</span>
                </div>

                {/* Skill bars */}
                <div className="space-y-2 pt-1">
                  {[
                    { color: 'bg-red-400', w: '85%' },
                    { color: 'bg-blue-500', w: '70%' },
                    { color: 'bg-green-500', w: '75%' },
                  ].map((bar, i) => (
                    <div key={i} className="h-2.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full ${bar.color} rounded-full transition-all duration-700`} style={{ width: bar.w }} />
                    </div>
                  ))}
                </div>
              </div>

              {/* Bottom-left floating code snippet */}
              <div className="hidden md:block absolute bottom-4 left-0 lg:left-4 font-mono text-[11px] text-slate-300/70 z-20 select-none">
                <div className="text-cyan-400/40">&lt;script&gt;</div>
                <div className="pl-3 text-slate-400/40">security.login()</div>
                <div className="pl-5 text-slate-300/40">proficiency.test()</div>
                <div className="text-cyan-400/40">&gt;</div>
                <div className="pl-3 text-slate-300/40">&#47;&#47; ethical hacking phase</div>
              </div>
            </div>
          </div>
        </section>

        {/* Binary Ticker */}
        <div className="w-full overflow-hidden py-3 opacity-[0.15] select-none pointer-events-none" id="binary-ticker">
          <div className="whitespace-nowrap font-mono text-[11px] text-slate-500 tracking-[0.15em] animate-[scroll_30s_linear_infinite]">
            100101001011000001 &nbsp; 01011010010040100101100 &nbsp; 110100001000011001110100101010 &nbsp;
            1001 &nbsp; 1001011001011000 &nbsp; 01100001100100011011010100101011001 &nbsp;
            1001001001010 &nbsp; 1110010101001 &nbsp; 1110010110110010111 &nbsp;
            11001 &nbsp; 01001001001101011011 &nbsp; 110001101001010 &nbsp;
            100101001011000001 &nbsp; 01011010010040100101100 &nbsp; 110100001000011001110100101010 &nbsp;
            1001 &nbsp; 1001011001011000 &nbsp; 01100001100100011011010100101011001
          </div>
        </div>

        {/* Bottom Icon Bar */}
        <div className="border-t border-slate-200/60 bg-white/70 backdrop-blur-sm" id="icon-bar">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center gap-8 sm:gap-12 py-4">
              {[
                { icon: Home, label: "Home" },
                { icon: Folder, label: "Files" },
                { icon: Search, label: "Search" },
                { icon: Eye, label: "Monitor" },
                { icon: Shield, label: "Security" },
                { icon: Heart, label: "Trust" },
                { icon: Lock, label: "Encrypt" },
                { icon: MessageSquare, label: "Comms" },
                { icon: Wifi, label: "Network" },
                { icon: Settings, label: "Config" },
              ].map((item, i) => (
                <div key={i} className="flex flex-col items-center gap-1 group cursor-pointer" title={item.label}>
                  <item.icon className="h-5 w-5 text-slate-400 group-hover:text-teal-500 transition-colors duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Second binary ticker below icons */}
        <div className="w-full overflow-hidden py-2 opacity-[0.12] select-none pointer-events-none">
          <div className="whitespace-nowrap font-mono text-[10px] text-slate-500 tracking-[0.12em] animate-[scroll_25s_linear_infinite_reverse]">
            110001101001010 &nbsp; 1001001001010 &nbsp; 1110010101001110010110110010111 &nbsp;
            01001001001101011011 &nbsp; 11001 &nbsp; 1001011001011000011000011001000 &nbsp;
            1001 &nbsp; 100101001011000001 &nbsp; 010110100100401001011001101000010000110011101001010 &nbsp;
            110001101001010 &nbsp; 1001001001010 &nbsp; 1110010101001110010110110010111
          </div>
        </div>

      </main>

      {/* Keyframe animations */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  )
}
