import {BrowserRouter, Routes, Route} from 'react-router-dom'
import Home from "./pages/Home";
import SignIn from "./pages/SignIn/SignIn";
import SignUp from "./pages/SignUp/SignUp";
import About from "./pages/About";
import Profile from "./pages/Profile/Profile";
import Header from "./components/Header";
import PrivateRoute from "./components/PrivateRoute";
import SessionProvider from "./provider/SessionProvider";
import CreateListing from "./pages/CreateListing";

function App() {
    return (
        <SessionProvider>
            <BrowserRouter>
                <Header/>
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/sign-in" element={<SignIn/>}/>
                    <Route path="/sign-up" element={<SignUp/>}/>
                    <Route path="/about" element={<About/>}/>
                    <Route element={<PrivateRoute/>}>
                        <Route path="/profile" element={<Profile/>}/>
                        <Route path="/create-listing" element={<CreateListing/>}/>
                    </Route>
                </Routes>
            </BrowserRouter>
        </SessionProvider>
    )
}

export default App
