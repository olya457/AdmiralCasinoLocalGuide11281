import React from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {
  SafeAreaView,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { colors, styles } from '../theme';
import { Icon, IconName } from './Icon';
import { ContentEntrance } from './ContentEntrance';
export function Button({
  title,
  onPress,
  variant = 'gold',
  disabled,
  loading,
  icon,
}: {
  title: string;
  onPress: () => void;
  variant?: 'gold' | 'teal' | 'outline';
  disabled?: boolean;
  loading?: boolean;
  icon?: IconName;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityState={{
        disabled: disabled || loading,
      }}
      disabled={disabled || loading}
      onPress={onPress}
      style={({ pressed }) => [
        ui.button,
        variant === 'outline' && ui.outline,
        { opacity: disabled ? 0.4 : pressed ? 0.75 : 1 },
      ]}
    >
      <LinearGradient
        colors={
          variant === 'gold'
            ? ['#ffe139', '#ffd20a']
            : variant === 'teal'
            ? ['#00888b', '#006c73']
            : [colors.navy, colors.navy]
        }
        pointerEvents="none"
        style={StyleSheet.absoluteFill}
      />
      <View pointerEvents="none" style={ui.buttonContent}>
        {loading ? (
          <ActivityIndicator
            color={variant === 'gold' ? colors.background : colors.text}
          />
        ) : (
          <>
            {icon && (
              <Icon
                name={icon}
                size={16}
                color={variant === 'gold' ? colors.background : colors.text}
              />
            )}
            <Text
              style={[
                ui.buttonText,
                {
                  color: variant === 'gold' ? colors.background : colors.text,
                },
              ]}
            >
              {title}
            </Text>
          </>
        )}
      </View>
    </Pressable>
  );
}
export function Screen({
  children,
  scroll = true,
  animationKey,
}: {
  children: React.ReactNode;
  scroll?: boolean;
  animationKey?: string | number;
}) {
  const insets = useSafeAreaInsets();
  return (
    <LinearGradient colors={[colors.background, colors.blue]} style={ui.flex}>
      <SafeAreaView edges={['top', 'left', 'right']} style={ui.flex}>
        <KeyboardAvoidingView
          style={ui.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ContentEntrance style={ui.flex} animationKey={animationKey}>
            {scroll ? (
              <ScrollView
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={[
                  ui.content,
                  { paddingBottom: Math.max(30, insets.bottom + 16) },
                ]}
              >
                {children}
              </ScrollView>
            ) : (
              <View style={[ui.content, ui.flex]}>{children}</View>
            )}
          </ContentEntrance>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
export function Heading({
  title,
  action,
  icon = 'close',
  onAction,
}: {
  title: string;
  action?: string;
  icon?: IconName;
  onAction?: () => void;
}) {
  return (
    <View style={[styles.between, localStyles.heading]}>
      <Text style={[styles.title, localStyles.headingTitle]}>{title}</Text>
      {onAction && (
        <IconButton name={icon} label={action || 'Close'} onPress={onAction} />
      )}
    </View>
  );
}
export function IconButton({
  name,
  label,
  onPress,
  badge,
}: {
  name: IconName;
  label: string;
  onPress: () => void;
  badge?: number;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      style={ui.iconButton}
    >
      <Icon name={name} color={colors.text} />
      {!!badge && (
        <View style={ui.badge}>
          <Text style={ui.badgeText}>{badge}</Text>
        </View>
      )}
    </Pressable>
  );
}
export function Field({
  label,
  ...props
}: TextInputProps & {
  label: string;
}) {
  return (
    <View style={localStyles.field}>
      <Text style={styles.label}>{label.toUpperCase()}</Text>
      <TextInput
        {...props}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={styles.input}
      />
    </View>
  );
}
export function Sheet({
  visible,
  children,
  onClose,
}: {
  visible: boolean;
  children: React.ReactNode;
  onClose: () => void;
}) {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={ui.modal}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <Pressable
          accessibilityLabel="Close dialog"
          onPress={onClose}
          style={StyleSheet.absoluteFill}
        />
        <View
          accessibilityViewIsModal
          style={[
            ui.sheet,
            {
              paddingBottom: Math.max(20, insets.bottom),
              marginTop: insets.top + 20,
            },
          ]}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={localStyles.sheetContent}
          >
            {children}
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
export function Tabs<T extends string>({
  values,
  selected,
  onSelect,
}: {
  values: T[];
  selected: T;
  onSelect: (value: T) => void;
}) {
  return (
    <View style={ui.tabs}>
      {values.map(value => (
        <Pressable
          key={value}
          accessibilityRole="tab"
          accessibilityState={{
            selected: value === selected,
          }}
          onPress={() => onSelect(value)}
          style={[ui.tab, value === selected && ui.activeTab]}
        >
          <Text
            style={{
              color: value === selected ? colors.gold : colors.muted,
              fontSize: 13,
              textAlign: 'center',
            }}
          >
            {value}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}
export function Choice({
  title,
  active,
  onPress,
}: {
  title: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        selected: active,
      }}
      onPress={onPress}
      style={[ui.choice, active && ui.activeChoice]}
    >
      <Text
        style={{
          color: active ? colors.gold : colors.muted,
          textAlign: 'center',
          fontSize: 13,
        }}
      >
        {title}
      </Text>
    </Pressable>
  );
}
export function Stepper({
  value,
  decrease,
  increase,
  label,
  min,
  max,
}: {
  value: number | string;
  decrease: () => void;
  increase: () => void;
  label: string;
  min?: boolean;
  max?: boolean;
}) {
  return (
    <View style={styles.between}>
      <Pressable
        disabled={min}
        accessibilityLabel={`Decrease ${label}`}
        onPress={decrease}
        style={[
          ui.step,
          {
            opacity: min ? 0.35 : 1,
          },
        ]}
      >
        <Text style={styles.subtitle}>−</Text>
      </Pressable>
      <Text accessibilityLabel={`${label}: ${value}`} style={styles.subtitle}>
        {value}
      </Text>
      <Pressable
        disabled={max}
        accessibilityLabel={`Increase ${label}`}
        onPress={increase}
        style={[
          ui.step,
          {
            opacity: max ? 0.35 : 1,
          },
        ]}
      >
        <Text style={styles.subtitle}>+</Text>
      </Pressable>
    </View>
  );
}
const ui = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 21,
    paddingTop: 20,
    paddingBottom: 30,
    gap: 16,
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
  },
  button: {
    minHeight: 48,
    flexShrink: 0,
    overflow: 'hidden',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 9,
  },
  buttonText: {
    flexShrink: 1,
    lineHeight: 18,
    includeFontPadding: false,
    fontWeight: '700',
    fontSize: 12,
    letterSpacing: 1,
    textAlign: 'center',
  },
  outline: {
    borderWidth: 1,
    borderColor: colors.border,
  },
  iconButton: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    right: 0,
    top: 1,
    minWidth: 18,
    paddingHorizontal: 4,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: 10,
    color: colors.background,
    fontWeight: '700',
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#000b',
  },
  sheet: {
    maxHeight: '92%',
    width: '100%',
    maxWidth: 650,
    alignSelf: 'center',
    backgroundColor: colors.navy,
    borderWidth: 1,
    borderColor: colors.border,
    borderTopLeftRadius: 14,
    borderTopRightRadius: 14,
    padding: 21,
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: colors.border,
    marginBottom: 4,
  },
  tab: {
    flex: 1,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    borderBottomWidth: 2,
    borderColor: 'transparent',
  },
  activeTab: {
    borderColor: colors.gold,
  },
  choice: {
    minWidth: 80,
    minHeight: 44,
    flexGrow: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 5,
    justifyContent: 'center',
  },
  activeChoice: {
    borderColor: colors.gold,
    backgroundColor: '#26302e',
  },
  step: {
    width: 44,
    height: 44,
    borderRadius: 5,
    backgroundColor: colors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
const localStyles = StyleSheet.create({
  heading: {
    marginBottom: 20,
  },
  headingTitle: {
    flex: 1,
  },
  field: {
    gap: 8,
  },
  sheetContent: {
    gap: 18,
  },
});
