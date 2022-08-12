import Navbar from "./Navbar";
import Meta from "./Meta";
interface LayoutProps {
  children: React.ReactElement;
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  return <> 
    <Meta />
    <Navbar />
    <main> {children} </main>
    </>
  
}

export default Layout
