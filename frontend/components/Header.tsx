export default function Header() {
  return (
    <header className="flex items-center justify-between px-4 py-3">
      <h1 className="font-serif text-lg text-persona-green">
        Persona
      </h1>

      <div className="flex items-center gap-2">
        <img
          src="/avatar.jpg"
          alt="avatar"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="text-right">
          <div className="text-sm font-medium text-persona-text">
            Evelyn
          </div>
          <div className="text-xs italic text-persona-muted">
            Feeling thoughtful…
          </div>
        </div>
      </div>
    </header>
  );
}
