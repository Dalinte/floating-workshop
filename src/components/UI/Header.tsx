export default function Header() {
  return (
    <div className="fixed top-6 left-6 z-10 select-none pointer-events-none">
      <h1 className="text-white text-3xl md:text-4xl font-semibold tracking-tight drop-shadow">
        Floating Workshop
      </h1>
      <p className="text-white/70 text-sm md:text-base mt-1">
        Crafting things, one commit at a time.
      </p>
    </div>
  )
}
