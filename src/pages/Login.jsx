import { motion } from 'framer-motion';
import { FcGoogle } from 'react-icons/fc';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom'; // 🔥 Import useNavigate
import { AuthContext } from '../Provider/AuthProvider';

const Login = () => {
  const { signInWithGoogle } = useContext(AuthContext);
  const navigate = useNavigate(); // ✅ Initialize useNavigate

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
      navigate('/'); // 🔥 Redirect after login
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:gap-0 justify-center items-center h-screen bg-black">
        <div>
          <img src="https://i.ibb.co.com/zhvnDp8Z/loginani.webp" alt="" />
        </div>
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white p-8 rounded-lg shadow-lg text-center lg:mt-28"
        >
          <h2 className="text-2xl font-semibold mb-4 text-black">Login</h2>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGoogleLogin} // ✅ Login and Redirect
            className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-900"
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
