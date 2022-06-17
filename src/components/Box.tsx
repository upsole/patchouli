interface BoxProps {
  children: React.ReactElement[] | React.ReactElement;
  stripes?: boolean
}
const Box: React.FC<BoxProps> = ({children, stripes=false}) => {
  return <div className={`box ${stripes ? "stripes" : ""}`}> {children} </div>
}

export default Box;
