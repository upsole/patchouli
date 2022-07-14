export const today = () => new Date();
export const yesterday = () => {
  let d = today()
  d.setDate(d.getDate() - 1);
  return d
}
