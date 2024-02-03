import Sidebar from "../../components/SideBar";

export default function Layout({ children }) {

    return (
        <div className="flex">
            <Sidebar classes={[{ className: "MATHS", classId: "M103" }, { className: "Test", classId: "T103" }]} />
            {children}
        </div>
    );
}
