import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { addAdminActionNotification } from '../store/slices/adminActionsSlice';

export function useAdminActionSocket() {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = io();

    socket.on('admin:action-taken', (action) => {
      const notification = {
        _id: action._id ?? Date.now(),
        type: 'admin_action',
        title: action.title ?? 'Admin Action Notification',
        message: action.message,
        details: action.details,
        createdAt: action.createdAt ?? new Date().toISOString(),
        read: false,
      };

      dispatch(addAdminActionNotification(notification));
    });

    return () => {
      socket.off('admin:action-taken');
    };
  }, [dispatch]);
}
