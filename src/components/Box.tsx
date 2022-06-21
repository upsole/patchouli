import styles from "~/styles/Box.module.css";
interface BoxProps {
  children: React.ReactElement[] | React.ReactElement;
  stripes?: boolean
}
const Box: React.FC<BoxProps> = ({children, stripes=false}) => {
  return <div className={`${styles.box} ${stripes ? styles.stripes : null}`}> {children} </div>
}

export default Box;
