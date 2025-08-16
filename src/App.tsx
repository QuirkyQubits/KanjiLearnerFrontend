export default function App() {

  const gradientVars = {
    '--tw-gradient-stops': 'var(--tw-gradient-from), var(--tw-gradient-to)',
    '--tw-gradient-from': '#f87171',
    '--tw-gradient-to': '#34d399',
  } as React.CSSProperties;

  
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-red-500 via-yellow-500 to-green-500 flex items-center justify-center"
      style={gradientVars}
    >
      <h1 className="text-4xl text-white font-bold drop-shadow">
        Gradient is finally working!
      </h1>
    </div>
  );
}