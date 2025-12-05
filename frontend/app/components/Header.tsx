'use client';

export default function Header() {
  return (
    <header className="absolute top-0 left-0 right-0 z-20">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-8 py-6">
        <div className="flex items-center gap-2">
          <div className="h-10 w-10 rounded-md bg-gradient-to-br from-emerald-500 to-lime-400 flex items-center justify-center font-bold text-black">
            X
          </div>
          <div className="ml-2">
            <span className="text-lg font-bold text-white">PEST LINK</span>
          </div>
        </div>
      </nav>
    </header>
  );
}