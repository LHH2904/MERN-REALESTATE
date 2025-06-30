import {Avatar, Navbar, NavbarBrand, NavbarCollapse, NavbarLink, NavbarToggle, TextInput} from "flowbite-react";
import {FaSearch} from "react-icons/fa";
import {useHeaderData} from "./useHeaderData";

const Header = () => {
    const { currentPath, currentUser } = useHeaderData();

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
                {/* Toggle và Avatar ở màn hình nhỏ */}
                <div className="flex items-center gap-2 sm:hidden">
                    <NavbarToggle/>
                    {currentUser && (
                        <Avatar
                            img={currentUser.avatar}
                            alt="User avatar"
                            rounded
                        />
                    )}
                </div>
                <NavbarCollapse className="flex items-center gap-4">
                    <div className="flex items-center gap-4">
                        <NavbarLink href="/" active={currentPath === "/"}>
                            Home
                        </NavbarLink>
                        <NavbarLink href="/about" active={currentPath === "/about"}>
                            About
                        </NavbarLink>
                        {currentUser ? (
                            <>
                                {/* Link PROFILE cho màn hình nhỏ: hiện chữ */}
                                <NavbarLink
                                    href="/profile"
                                    active={currentPath === "/profile"}
                                    className="flex items-center md:hidden"
                                >
                                    Profile
                                </NavbarLink>

                                {/* Avatar cho màn hình lớn */}
                                <NavbarLink
                                    href="/profile"
                                    active={currentPath === "/profile"}
                                    className="hidden md:flex items-center"
                                >
                                    <Avatar
                                        img={currentUser.avatar}
                                        alt="User avatar"
                                        rounded
                                    />
                                </NavbarLink>
                            </>
                        ) : (
                            <NavbarLink href="/sign-in" active={currentPath === "/sign-in"}>
                                Sign In
                            </NavbarLink>
                        )}
                    </div>
                </NavbarCollapse>
            </Navbar>
        </header>
    );
};

export default Header;

