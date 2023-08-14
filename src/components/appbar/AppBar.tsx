import React from "react";
import logo from "../../LOGO.png"
import {AiFillPrinter} from "react-icons/ai"
import {GrUndo} from "react-icons/gr"

const AppBar = () => {

    const handlePrint = () => {
        window.print();
    };

    const handleClick = () => {
        window.location.href="https://8288girl.com";
    }

    return (
        <div className="flex items-center justify-center h-60 bg-[#120123] pb-20">
            <div className="flex flex-row items-center justify-center h-16">
                <img src={logo} alt='logo' className="flex-shrink-0 h-full max-h-full mr-2 cursor-pointer" onClick={handleClick}/>
            </div>
            <div className="absolute top-0 right-0 cursor-pointer text-xl md:text-5xl text-white mr-12 md:mr-16 mt-32 md:mt-14">
                <AiFillPrinter onClick={handlePrint}/>
            </div>
            <div className="absolute top-0 left-0 cursor-pointer text-xl md:text-5xl text-white ml-12 d:ml-16 mt-32 md:mt-14">
                <a href="https://8288girl.com">
                    <GrUndo />
                </a>
            </div>
        </div>
    )
}

export default AppBar;