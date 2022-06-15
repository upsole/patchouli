import Navbar from "./Navbar";
interface LayoutProps {
  children: React.ReactElement;
}
const Layout: React.FC<LayoutProps> = ({children}) => {
  return <> 
    <Navbar />
    <main> {children} </main>
    </>
  
}

export default Layout
