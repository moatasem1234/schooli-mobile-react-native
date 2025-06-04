import React from 'react';
import {
  ScrollView,
  RefreshControl,
  StyleSheet,
  ViewStyle,
  ScrollViewProps,
} from 'react-native';

interface PullToRefreshProps extends ScrollViewProps {
  refreshing: boolean;
  onRefresh: () => void;
  children: React.ReactNode;
  refreshColor?: string;
}

const PullToRefresh: React.FC<PullToRefreshProps> = ({
  refreshing,
  onRefresh,
  children,
  refreshColor = '#00C4B4',
  style,
  contentContainerStyle,
  ...rest
}) => {
  return (
    <ScrollView
      style={[styles.container, style]}
      contentContainerStyle={[styles.contentContainer, contentContainerStyle]}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[refreshColor]}
          tintColor={refreshColor}
        />
      }
      {...rest}>
      {children}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
  },
});

export default PullToRefresh;