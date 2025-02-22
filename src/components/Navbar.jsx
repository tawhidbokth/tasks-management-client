import React, { useContext } from 'react';
import { AuthContext } from '../Provider/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';

const Navbar = () => {
  const { user, signOutUser } = useContext(AuthContext);

  const handleSignOut = () => {
    signOutUser()
      .then(() => {
        toast.success('Sign Out Successful!', {
          position: 'top-center',
          autoClose: 2000,
        });
      })
      .catch(error => {
        toast.error(`Error: ${error.message}`, {
          position: 'top-center',
          autoClose: 2000,
        });
      });
  };

  return (
    <div>
      <div className="navbar -mt-8 mb-10">
        <div className="navbar-start">
          <div className="dropdown">
            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h8m-8 6h16"
                />
              </svg>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content text-black rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a>Name: {user?.displayName}</a>
              </li>
              <li>
                <a>Email: {user?.email}</a>
              </li>
            </ul>
          </div>
          <a className="btn btn-ghost text-xl text-black">TMA</a>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1 text-black text-lg">
            <li>
              <a>Name: {user?.displayName}</a>
            </li>
            <li>
              <a>Email: {user?.email}</a>
            </li>
          </ul>
        </div>
        <div className="navbar-end">
          <button
            onClick={handleSignOut}
            className="px-4 py-2 text-black bg-orange-500 rounded hover:bg-orange-600"
          >
            Sign Out
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Navbar;
