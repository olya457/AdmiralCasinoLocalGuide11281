import React from 'react';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
export type IconName =
  | 'home'
  | 'map'
  | 'menu'
  | 'pin'
  | 'controls'
  | 'bag'
  | 'close'
  | 'qr'
  | 'check'
  | 'settings'
  | 'back';
const paths: Partial<Record<IconName, string>> = {
  home: 'M3 10L12 3l9 7v11h-6v-8H9v8H3z',
  map: 'M3 5l6-3 6 3 6-3v17l-6 3-6-3-6 3zM9 2v17M15 5v17',
  menu: 'M4 8h13v9a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM17 9h2a3 3 0 0 1 0 6h-2M7 2v3M11 1v4M15 2v3',
  pin: 'M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 1 1 16 0z',
  controls: 'M3 5h18M3 12h18M3 19h18',
  bag: 'M4 7h16v14H4zM8 8V6a4 4 0 0 1 8 0v2',
  close: 'M6 6l12 12M18 6L6 18',
  check: 'M5 12l4 4L19 6',
  back: 'M15 4l-8 8 8 8',
  settings: 'M3 5h18M3 12h18M3 19h18',
};
export function Icon({
  name,
  color = '#98a9c0',
  size = 23,
}: {
  name: IconName;
  color?: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] && <Path d={paths[name]} />}
      {name === 'pin' && <Circle cx="12" cy="10" r="2.6" />}
      {(name === 'controls' || name === 'settings') && (
        <>
          <Circle cx="8" cy="5" r="2" fill={color} />
          <Circle cx="16" cy="12" r="2" fill={color} />
          <Circle cx="10" cy="19" r="2" fill={color} />
        </>
      )}
      {name === 'qr' && (
        <>
          <Rect x="3" y="3" width="6" height="6" />
          <Rect x="15" y="3" width="6" height="6" />
          <Rect x="3" y="15" width="6" height="6" />
          <Path d="M15 14v4h6M18 14h3v7h-6" />
        </>
      )}
    </Svg>
  );
}
