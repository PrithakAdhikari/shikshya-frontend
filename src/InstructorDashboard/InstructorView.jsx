import InstructorSideBar from "../Components/InstructorSideBar";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/useAuth";
import { useEffect } from "react";

const InstructorView = ({ children }) => {
    
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (!isAuthenticated()) {
            navigate("/");
        }
        if (user.role === "User") {
            navigate("/");
        }
    }, [])

    return (
        <InstructorSideBar>
            {children}
        </InstructorSideBar>
    )
}

export default InstructorView;