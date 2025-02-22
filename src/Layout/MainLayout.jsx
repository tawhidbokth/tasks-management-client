import { Outlet } from 'react-router-dom';

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <main className="flex-grow">
        <div>
          <Outlet></Outlet>
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
