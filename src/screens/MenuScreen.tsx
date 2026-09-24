import React, { useState } from 'react';
import { Image, Text, View, StyleSheet } from 'react-native';
import { Category } from '../types';
import { menu } from '../data/menu';
import { useApp } from '../state/AppProvider';
import { Button, Heading, IconButton, Screen, Tabs } from '../components/UI';
import { CartSheet } from '../components/CartSheet';
import { colors, styles } from '../theme';
import { money } from '../utils/validation';
export function MenuScreen() {
  const [category, setCategory] = useState<Category>('Regular');
  const [cart, setCart] = useState(false);
  const { data, quantity } = useApp();
  const count = Object.values(data.cart).reduce((sum, value) => sum + value, 0);
  return (
    <Screen animationKey={category}>
      <View style={styles.between}>
        <View style={localStyles.heading}>
          <Heading title="Restaurant Menu" />
        </View>
        <IconButton
          name="bag"
          label={`Open basket, ${count} items`}
          badge={count}
          onPress={() => setCart(true)}
        />
      </View>
      <Tabs
        values={['Regular', 'Vegetarian', 'Vegan']}
        selected={category}
        onSelect={setCategory}
      />
      {(['Dishes', 'Drinks'] as const).map(kind => (
        <React.Fragment key={kind}>
          <Text style={[styles.label, localStyles.sectionLabel]}>
            {kind.toUpperCase()}
          </Text>
          {menu
            .filter(item => item.category === category && item.kind === kind)
            .map(item => (
              <View key={item.id} style={[styles.card, localStyles.menuCard]}>
                <Image source={item.image} style={localStyles.dishImage} />
                <View style={localStyles.dishContent}>
                  <View style={styles.between}>
                    <Text style={[styles.subtitle, localStyles.dishName]}>
                      {item.name}
                    </Text>
                    <Text style={localStyles.price}>{money(item.price)}</Text>
                  </View>
                  <Text style={styles.muted}>{item.ingredients}</Text>
                  <View style={styles.between}>
                    <Text style={[styles.muted, localStyles.preparation]}>
                      Prep. time: ~{item.minutes} min
                      {data.cart[item.id]
                        ? ` · ${data.cart[item.id]} in basket`
                        : ''}
                    </Text>
                    <Button
                      title="ADD"
                      disabled={data.cart[item.id] >= 99}
                      onPress={() => quantity(item.id, 1)}
                    />
                  </View>
                </View>
              </View>
            ))}
        </React.Fragment>
      ))}
      <CartSheet visible={cart} onClose={() => setCart(false)} />
    </Screen>
  );
}
const localStyles = StyleSheet.create({
  heading: {
    flex: 1,
  },
  sectionLabel: {
    marginTop: 8,
  },
  menuCard: {
    padding: 0,
    overflow: 'hidden',
  },
  dishImage: {
    width: '100%',
    height: 205,
  },
  dishContent: {
    padding: 16,
    gap: 12,
  },
  dishName: {
    flex: 1,
  },
  price: {
    color: colors.gold,
    fontWeight: '700',
    fontSize: 17,
  },
  preparation: {
    flex: 1,
    fontSize: 11,
  },
});
