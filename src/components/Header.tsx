import {Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, TextInput} from "flowbite-react";
import {FaSearch} from "react-icons/fa";
import {useLocation} from "react-router-dom";

const Header = () => {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <header className='bg-slate-200 shadow-md'>
            <Navbar fluid rounded>
                <NavbarBrand href="/">
                    <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">AnhDuong Estate</span>
                </NavbarBrand>
                <form className='bg-slate-100 rounded-md hidden sm:flex'>
                    <TextInput
                        className='transparent w-24 sm:w-64'
                        type="text"
                        placeholder="Search..."
                        icon={FaSearch}
                    />
                </form>
                <NavbarToggle/>
                <NavbarCollapse>
                    <NavbarLink href="/" active={currentPath === "/"}>
                        Home
                    </NavbarLink>
                    <NavbarLink href="/about" active={currentPath === "/about"}>
                        About
                    </NavbarLink>
                    <NavbarLink href="/sign-in" active={currentPath === "/sign-in"}>
                        Sign In
                    </NavbarLink>
                </NavbarCollapse>
            </Navbar>
        </header>
    );
};

export default Header;