import { useQuery } from '@tanstack/react-query';
import { useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../Provider/AuthProvider';

const useTasks = () => {
  const { user } = useContext(AuthContext);
  const { refetch, data: tasks = [] } = useQuery({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await axios.get(
        `https://tasks-managment-server.vercel.app/tasks?email=${user.email}`
      );
      return res.data;
    },
  });

  return [tasks, refetch];
};

export default useTasks;
