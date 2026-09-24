import React, { useContext, useEffect, useRef } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  StyleProp,
  ViewStyle,
} from 'react-native';
import { NavigationContext } from '@react-navigation/native';

type Props = {
  children: React.ReactNode;
  animationKey?: string | number;
  style?: StyleProp<ViewStyle>;
};

export function ContentEntrance({ children, animationKey, style }: Props) {
  const progress = useRef(new Animated.Value(0)).current;
  const navigation = useContext(NavigationContext);

  useEffect(() => {
    let active = true;
    let generation = 0;
    const reveal = async () => {
      const current = ++generation;
      progress.stopAnimation();
      try {
        const reduced = await AccessibilityInfo.isReduceMotionEnabled();
        if (!active || current !== generation) {
          return;
        }
        if (reduced) {
          progress.setValue(1);
          return;
        }
        progress.setValue(0);
        Animated.timing(progress, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
          isInteraction: false,
        }).start();
      } catch {
        if (active && current === generation) {
          progress.setValue(1);
        }
      }
    };
    const stop = () => {
      generation += 1;
      progress.stopAnimation();
      progress.setValue(1);
    };
    reveal();
    const unsubscribeFocus = navigation?.addListener('focus', reveal);
    const unsubscribeBlur = navigation?.addListener('blur', stop);
    const accessibility = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      reduced => {
        if (reduced) {
          stop();
        }
      },
    );
    return () => {
      active = false;
      generation += 1;
      progress.stopAnimation();
      unsubscribeFocus?.();
      unsubscribeBlur?.();
      accessibility.remove();
    };
  }, [animationKey, navigation, progress]);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: progress,
          transform: [
            {
              translateY: progress.interpolate({
                inputRange: [0, 1],
                outputRange: [14, 0],
              }),
            },
          ],
        },
      ]}
    >
      {children}
    </Animated.View>
  );
}
