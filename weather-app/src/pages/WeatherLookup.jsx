import { CiSearch } from "react-icons/ci";
import cloud from "../assets/images/cloud.png";
export default function WeatherLookup() {
  return (
    <main className="flex flex-col items-center justify-center grow gap-5 weatherLookup">
      <img src={cloud} alt="Rain cloud and sun" className="w-1/5" />
      <div className="">
        <input type="text" className="rounded-lg" placeholder="Type the desired City or Country" />
        <button className="rounded-lg">
          <CiSearch className="" />
        </button>
      </div>
      <button>Check Weather in My Location</button>
    </main>
  );
}
