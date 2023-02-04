import "./App.css";
import Navbar from "./layout/Navbar";
import TeamSvgImage from "./assets/team.svg";
import WaveBottom from './assets/wave-blue-bg.svg';
import {Link} from 'react-router-dom'
function App() {

  return (
    <Navbar>
      <div className="relative w-full pt-24 flex justify-center 2xl:gap-x-64 xl:gap-x-48 lg:gap-x-32 md:gap-x-16 h-screen">
        <div className="text-left">
          <div className="text-4xl font-semibold text-blue-500 flex flex-col 2xl:leading-loose xl:leading-loose lg:leading-loose md:leading-loose">
            <span>Our team is stronger</span>
            <span className="text-slate-600 text-6xl comfortaa mt-8 2xl:mt-0 xl:mt-0 lg:mt-0 md:mt-0">Together</span>
          </div>
          <p className="mt-3 mb-6 text-gray-400">
            Join a team and give support or create <span className="font-semibold animate-pulse text-orange-500 opacity-70">your team!</span> 😉
          </p>
          <Link to="/home" className="btn btn-sm btn-primary">
            Start Now 👉
          </Link>
        </div>
        <div className="items-start w-1/3 hidden 2xl:flex xl:flex lg:flex md:flex -z-10">
          <img draggable={false} src={TeamSvgImage} className="" alt="" />
        </div>
        <img src={WaveBottom} className="w-full absolute bottom-0 -z-10" alt="" />
      </div>
    </Navbar>
  );
}

export default App;
