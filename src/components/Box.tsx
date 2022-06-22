import styles from "~/styles/Box.module.css";
interface BoxProps {
  children: React.ReactElement[] | React.ReactElement;
}
const Box: React.FC<BoxProps> = ({children}) => {
  return <div className={`${styles.box}`}> {children} </div>
}

export default Box;
