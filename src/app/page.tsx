import Three from "./components/threeCanvas"

export default function Home() {
  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="w-1/2 h-1/2 border-4 border-black">
        <Three />
      </div>
    </div>
  );
}
