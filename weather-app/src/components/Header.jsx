import logo from "../assets/images/logo.png"
export default function Header(){
    return(
        <header className="bg-[#0b1957] flex justify-around items-center text-white">
            <h2 className="text-white" style={{color: "white"}}>Dana Dabdoub's Weather App</h2>
            <img src={logo} alt="weather logo" className="w-1/8" />
        </header>
    )
}