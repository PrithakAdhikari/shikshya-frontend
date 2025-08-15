import Sidebar from "../Components/SideBar";

const UserDashboard = ({ children }) => {
    return (<Sidebar>
        {children}
    </Sidebar>)
}

export default UserDashboard;