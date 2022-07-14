import Box from "~/components/Box";
import styles from "~/styles/Warning.module.css";
const LoginWarning: React.FC = () => {
  return (
    <div className={styles.single_flex}>
      <Box>
        <div>
          <h3>You need to login to access this page</h3>
        </div>
      </Box>
    </div>
  );
};

export default LoginWarning;
