interface ContainerProps {
  children: React.ReactElement | React.ReactElement[];
}
const ContainerFlex : React.FC<ContainerProps> = ({ children }) => {
  return <div className="container-flex"> {children}  </div>;
};

export default ContainerFlex;
