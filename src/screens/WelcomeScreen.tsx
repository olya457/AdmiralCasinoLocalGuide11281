import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { images } from '../data/images';
import { Button } from '../components/UI';
import { ContentEntrance } from '../components/ContentEntrance';
import { colors, serif } from '../theme';
import { useApp } from '../state/AppProvider';
import { loadingHtml } from '../components/splash/loadingHtml';
const loadingSource = { html: loadingHtml };
export function SplashScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const finished = useRef(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const callback = useRef(onDone);
  callback.current = onDone;
  const done = useCallback(() => {
    if (!finished.current) {
      finished.current = true;
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      callback.current();
    }
  }, []);
  const armFallback = useCallback(
    (delay: number) => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
      if (!finished.current) {
        timeout.current = setTimeout(done, delay);
      }
    },
    [done],
  );
  useEffect(() => {
    armFallback(10000);
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [armFallback]);
  return (
    <ImageBackground source={images.splash} style={s.fill}>
      <LinearGradient
        colors={['#00000020', '#00000020', '#000000a0']}
        style={s.fill}
      >
        <View style={s.splashTitleWrap}>
          <Text accessibilityRole="header" style={s.splashTitle}>
            Admiral Resort Hub
          </Text>
        </View>
        <View
          pointerEvents="none"
          accessibilityRole="progressbar"
          accessibilityLabel="Loading"
          style={[s.loader, { bottom: insets.bottom + 32 }]}
        >
          <WebView
            source={loadingSource}
            originWhitelist={['*']}
            javaScriptEnabled
            onLoadEnd={() => armFallback(4500)}
            onError={() => armFallback(4000)}
            onContentProcessDidTerminate={() => armFallback(4000)}
            onMessage={event => {
              if (event.nativeEvent.data === 'finished') {
                done();
              }
            }}
            scrollEnabled={false}
            bounces={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            androidLayerType="software"
            containerStyle={s.webContainer}
            style={s.web}
          />
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}
const slides = [
  {
    image: images.welcome,
    title: 'Everything in One Place',
    text: 'Explore the Admiral complex, discover every venue, and find essential services with ease.',
  },
  {
    image: images.dining,
    title: 'Dine Your Way',
    text: 'Browse restaurant menus, explore dietary options, and order your favourite dishes directly from the app.',
  },
  {
    image: images.discover,
    title: 'Discover Nearby',
    text: 'Find local attractions, scenic locations, and cultural experiences near the complex.',
  },
  {
    image: images.room,
    title: 'Make It Yours',
    text: 'Control your room lighting and air conditioning for a more comfortable experience.',
  },
];
export function OnboardingScreen() {
  const [page, setPage] = useState(0);
  const { update } = useApp();
  const slide = slides[page];
  return (
    <ImageBackground source={slide.image} style={s.fill}>
      <LinearGradient
        colors={['#00000000', '#00000010', '#000000ec']}
        locations={[0, 0.3, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <SafeAreaView style={s.fill}>
        <ContentEntrance style={s.fill} animationKey={page}>
          <ScrollView
            style={s.fill}
            contentContainerStyle={s.onboarding}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            <View style={localStyles.spacer} />
            <Text style={s.title}>{slide.title}</Text>
            <Text style={s.description}>{slide.text}</Text>
            <View accessibilityLabel={`Page ${page + 1} of 4`} style={s.dots}>
              {slides.map((_, i) => (
                <View
                  key={i}
                  style={[
                    s.dot,
                    {
                      width: i === page ? 22 : 6,
                      backgroundColor: i === page ? colors.gold : '#24405e',
                    },
                  ]}
                />
              ))}
            </View>
          </ScrollView>
          <View style={s.onboardingFooter}>
            <Button
              title="CONTINUE"
              onPress={() =>
                page < 3
                  ? setPage(page + 1)
                  : update({
                      onboarded: true,
                    })
              }
            />
          </View>
        </ContentEntrance>
      </SafeAreaView>
    </ImageBackground>
  );
}
const s = StyleSheet.create({
  fill: {
    flex: 1,
  },
  splashTitleWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashTitle: {
    width: '80%',
    maxWidth: 380,
    fontFamily: serif,
    fontSize: 36,
    lineHeight: 46,
    textAlign: 'center',
    color: colors.gold,
    textShadowColor: '#000000',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  loader: {
    position: 'absolute',
    alignSelf: 'center',
    width: '80%',
    maxWidth: 330,
    height: 40,
  },
  webContainer: {
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
  },
  web: {
    width: '100%',
    height: 40,
    backgroundColor: 'transparent',
  },
  onboarding: {
    flexGrow: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 25,
    maxWidth: 600,
    width: '100%',
    alignSelf: 'center',
  },
  onboardingFooter: {
    flexShrink: 0,
    paddingHorizontal: 25,
    paddingBottom: 24,
    width: '100%',
    maxWidth: 600,
    alignSelf: 'center',
  },
  title: {
    fontFamily: serif,
    fontSize: 30,
    lineHeight: 38,
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
  },
  description: {
    color: '#e1e5ec',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 23,
    paddingHorizontal: 14,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignSelf: 'center',
    marginTop: 38,
    marginBottom: 32,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
});
const localStyles = StyleSheet.create({
  spacer: {
    flex: 1,
    minHeight: 140,
  },
});
