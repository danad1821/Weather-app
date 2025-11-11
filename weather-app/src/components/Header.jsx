import logo from "../assets/images/logo.png"
export default function Header(){
    return(
        <header className="bg-[#0b1957] flex justify-center text-white">
            <img src={logo} alt="weather logo" className="w-1/8" />
        </header>
    )
}