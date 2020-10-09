import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import AuthRoutes from './auth.routes'
import AppRoutes from './app.routes'

import { useAuth } from '../hooks/auth';

const Routes: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator style={{ opacity: 1 }} size="large" color="#00ff00" />
      </View>
    )
  }

  return user===undefined ? <AuthRoutes /> : <AppRoutes />;
};

export default Routes;
