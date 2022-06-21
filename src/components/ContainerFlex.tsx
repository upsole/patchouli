import styles from "~/styles/ContainerFlex.module.css";

interface ContainerProps {
  children: React.ReactElement | React.ReactElement[];
}
const ContainerFlex : React.FC<ContainerProps> = ({ children }) => {
  return <div className={styles.container}> {children}  </div>;
};

export default ContainerFlex;
