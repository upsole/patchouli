interface BoxProps {
  children: React.ReactElement;
}
const Box: React.FC<BoxProps> = ({children}) => {
  return <div className="box"> {children} </div>
}

export default Box;
