import { Header } from "./Header.tsx";
import { Outlet } from "react-router";

/*interface MainLayoutProps {
    darkMode: string,
}*/

export function MainLayout(/*props: MainLayoutProps*/) {
    return (
        <div className={/*props.darkMode*/""}>
            <Header />
            <div style={{padding: "0 2em"}}>
                <Outlet/>
            </div>
        </div>
    );
}
