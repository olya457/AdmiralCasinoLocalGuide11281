import { Place } from '../types';
import { images } from './images';
export const venues: Place[] = [
  {
    id: 'Casino',
    name: 'Gaming Hall',
    hours: 'Open 24 hours',
    short: 'Elegant gaming and entertainment',
    marker: { x: 80, y: 16 },
    offer: {
      title: 'Welcome Offer',
      text: 'Receive an exclusive welcome bonus and enjoy selected casino experiences during your visit.',
    },
    paragraphs: [
      'The casino offers a refined gaming environment with classic tables, modern machines, and comfortable lounge areas. Guests can enjoy an elegant atmosphere with premium service throughout the day and night. The space is designed for both experienced players and visitors discovering the casino for the first time.',
      'A dedicated staff team is available to assist guests and answer questions. The venue combines stylish interiors, entertainment, and attentive hospitality in one location. Guests can also check current promotions and special events through the app.',
    ],
    image: images.Casino,
  },
  {
    id: 'MainRestaurant',
    name: 'Main Restaurant',
    hours: '7:00 AM – 11:00 PM',
    short: 'Fine dining with local flavours',
    marker: { x: 21, y: 14 },
    offer: {
      title: '20% Off Drinks',
      text: 'Enjoy 20% off selected cocktails, wines, and soft drinks with your dinner.',
    },
    paragraphs: [
      'The main restaurant serves a varied menu inspired by international and local cuisine. Guests can choose from regular, vegetarian, and vegan dishes prepared with fresh ingredients. The elegant dining room is suitable for breakfast, lunch, dinner, and special occasions.',
      'The restaurant also offers a carefully selected drinks menu with cocktails, wines, coffee, and refreshing beverages. Guests can browse dishes, view ingredients, and check preparation times in the app. Orders can be placed directly through the digital menu.',
    ],
    image: images.MainRestaurant,
  },
  {
    id: 'SPACentre',
    name: 'SPA Centre',
    hours: '9:00 AM – 9:00 PM',
    short: 'Relaxation, treatments, and wellness',
    marker: { x: 21, y: 35 },
    offer: {
      title: '30% Off Massage',
      text: 'Relax and recharge with 30% off selected massage treatments this week.',
    },
    paragraphs: [
      'The SPA centre provides a calm environment for relaxation and personal care. Guests can enjoy massages, beauty treatments, sauna sessions, and wellness services. Every treatment is designed to help visitors slow down and feel refreshed.',
      'The professional team creates personalised experiences based on each guest’s preferences. The peaceful atmosphere, soft lighting, and premium facilities make the SPA ideal for complete relaxation. Guests can also explore available treatments and current offers in the app.',
    ],
    image: images.SPACentre,
  },
  {
    id: 'LoungeBar',
    name: 'Lounge Bar',
    hours: '4:00 PM – 2:00 AM',
    short: 'Signature cocktails and evening ambience',
    marker: { x: 80, y: 35 },
    offer: {
      title: 'Two Cocktails for One Price',
      text: 'Enjoy two selected signature cocktails for the price of one before 7 PM.',
    },
    paragraphs: [
      'The lounge bar offers a sophisticated setting for cocktails, premium spirits, wine, and light snacks. Guests can relax in comfortable seating while enjoying stylish music and an intimate atmosphere. The menu includes classic drinks as well as signature creations from the bar team.',
      'The venue is ideal for meeting friends, starting an evening, or enjoying a quiet drink. The bar team can recommend beverages based on personal taste and preferences. Special offers and selected drinks may be available throughout the week.',
    ],
    image: images.LoungeBar,
  },
  {
    id: 'ConcertHall',
    name: 'Concert Hall',
    hours: 'Based on event schedule',
    short: 'Live music and special performances',
    marker: { x: 21, y: 55 },
    offer: {
      title: 'Priority Event Access',
      text: 'Get early access to selected performances and reserve your preferred seats first.',
    },
    paragraphs: [
      'The concert hall hosts live music, cultural performances, entertainment shows, and seasonal events. Its spacious interior provides comfortable seating and clear views of the stage. The venue is designed for memorable evenings and high-quality performances.',
      'Guests can check upcoming events, dates, and schedules through the app. Event information includes the performance location, start time, and additional details. The concert hall can be visited independently or as part of a complete evening at the complex.',
    ],
    image: images.ConcertHall,
  },
  {
    id: 'Nightclub',
    name: 'Nightclub',
    hours: '10:00 PM – 4:00 AM',
    short: 'Music, dancing, and nightlife',
    marker: { x: 80, y: 55 },
    offer: {
      title: 'Complimentary Welcome Drink',
      text: 'Receive one complimentary welcome drink with selected evening events.',
    },
    paragraphs: [
      'The nightclub offers a vibrant evening atmosphere with energetic music, stylish lighting, and a modern interior. Guests can enjoy DJ performances, dancing, signature drinks, and late-night entertainment. The venue combines a premium design with an exciting social atmosphere.',
      'The nightclub regularly hosts themed nights and special events. Guests can check the current schedule and opening information in the app. The venue is suitable for visitors looking to continue their evening after dinner or a show.',
    ],
    image: images.Nightclub,
  },
  {
    id: 'SwimmingPool',
    name: 'Swimming Pool',
    hours: '7:00 AM – 10:00 PM',
    short: 'Peaceful swimming and leisure',
    marker: { x: 80, y: 76 },
    offer: {
      title: 'Poolside Refreshment',
      text: 'Enjoy a complimentary refreshing drink with your pool visit this afternoon.',
    },
    paragraphs: [
      'The swimming pool provides a relaxing space for guests to enjoy quiet leisure and refreshing water activities. The area includes comfortable loungers, soft lighting, and a calm atmosphere. It is suitable for both morning relaxation and an evening break.',
      'Guests can use the pool as part of their daily wellness routine. The clean, spacious environment is designed for comfort and privacy. Additional pool rules and service information can be viewed in the app.',
    ],
    image: images.SwimmingPool,
  },
  {
    id: 'FitnessCentre',
    name: 'Fitness Centre',
    hours: 'Open 24 hours',
    short: 'Modern equipment and daily training',
    marker: { x: 21, y: 76 },
    offer: {
      title: 'Personal Training Bonus',
      text: 'Book a training session and receive a complimentary fitness consultation.',
    },
    paragraphs: [
      'The fitness centre offers modern equipment for cardio, strength training, and everyday workouts. Guests can exercise independently in a clean and comfortable environment. The facility is suitable for beginners as well as experienced visitors.',
      'The open layout allows guests to create a personal training routine during their stay. The fitness centre is available throughout the day and night for maximum flexibility. Guests can combine their workout with a visit to the SPA or swimming pool.',
    ],
    image: images.FitnessCentre,
  },
];
export const nearby: Place[] = [
  {
    id: 'HistoricOldTown',
    name: 'Historic Old Town',
    short: 'Charming streets and local history',
    coordinates: { latitude: 41.3275, longitude: 19.8187 },
    paragraphs: [
      'The Historic Old Town is known for its traditional architecture, quiet streets, and cultural landmarks. Visitors can explore small cafés, local shops, and picturesque squares throughout the area. It is an ideal location for a relaxed afternoon walk.',
      'The district combines historic charm with a lively local atmosphere. Guests can discover regional traditions, take photographs, and enjoy authentic cuisine. The Old Town is especially beautiful during the evening when the streets become softly illuminated.',
    ],
    image: images.HistoricOldTown,
  },
  {
    id: 'HilltopCastle',
    name: 'Hilltop Castle',
    short: 'Panoramic views and ancient walls',
    coordinates: { latitude: 41.3312, longitude: 19.8236 },
    paragraphs: [
      'The Hilltop Castle is a historic landmark located above the surrounding area. Its stone walls, towers, and elevated position offer impressive views of the city and landscape. The location is popular with visitors interested in history and architecture.',
      'Guests can walk through the castle grounds and explore its remaining structures. The viewpoint is especially attractive around sunset. Comfortable shoes are recommended because some paths may be uneven.',
    ],
    image: images.HilltopCastle,
  },
  {
    id: 'BotanicalGardens',
    name: 'Botanical Gardens',
    short: 'Peaceful gardens and native plants',
    coordinates: { latitude: 41.3198, longitude: 19.8064 },
    paragraphs: [
      'The Botanical Gardens offer a quiet escape filled with flowers, trees, and carefully designed walking paths. Visitors can explore local plant species and seasonal displays in a peaceful setting. The gardens are suitable for a slow morning or relaxing afternoon visit.',
      'Several shaded areas provide comfortable places to rest during the walk. The location is popular with families, photography lovers, and nature enthusiasts. Guests can enjoy a calm break away from the busy city centre.',
    ],
    image: images.BotanicalGardens,
  },
  {
    id: 'RiversidePromenade',
    name: 'Riverside Promenade',
    short: 'Scenic walks beside the river',
    coordinates: { latitude: 41.3241, longitude: 19.8342 },
    paragraphs: [
      'The Riverside Promenade is a scenic area for walking, relaxing, and enjoying views of the water. It features a long pedestrian route with benches, cafés, and landscaped areas. The promenade is suitable for both daytime visits and evening strolls.',
      'The route offers a pleasant atmosphere throughout the year. Visitors can enjoy local drinks, take photographs, or simply watch the city around them. It is an easy destination to reach from the hotel complex.',
    ],
    image: images.RiversidePromenade,
  },
  {
    id: 'ArtisanMarket',
    name: 'Artisan Market',
    short: 'Local crafts and authentic flavours',
    coordinates: { latitude: 41.3304, longitude: 19.8129 },
    paragraphs: [
      'The Artisan Market brings together local crafts, handmade products, regional food, and traditional souvenirs. Visitors can browse colourful stalls and discover unique items made by local creators. The market offers a more authentic alternative to standard tourist shops.',
      'Guests can taste local specialities and purchase gifts for friends and family. The atmosphere is lively, welcoming, and full of regional character. Opening times may vary depending on the day and season.',
    ],
    image: images.ArtisanMarket,
  },
  {
    id: 'MountainWaterfallTrail',
    name: 'Mountain Waterfall Trail',
    short: 'Nature trails and refreshing waterfalls',
    coordinates: { latitude: 41.3527, longitude: 19.7865 },
    paragraphs: [
      'The Mountain Waterfall Trail leads through a natural landscape with trees, rocky paths, and refreshing waterfalls. It is a popular destination for visitors who enjoy walking and outdoor experiences. The route combines peaceful scenery with light adventure.',
      'Several viewpoints along the trail offer beautiful opportunities for photography. Visitors should bring comfortable shoes, water, and suitable clothing. The trail may take longer to explore depending on weather conditions and walking speed.',
    ],
    image: images.MountainWaterfallTrail,
  },
  {
    id: 'ContemporaryArtMuseum',
    name: 'Contemporary Art Museum',
    short: 'Modern art and cultural exhibitions',
    coordinates: { latitude: 41.3219, longitude: 19.8173 },
    paragraphs: [
      'The Contemporary Art Museum presents modern artwork, temporary exhibitions, and creative installations. Its collection includes works by regional and international artists. The museum offers an inspiring indoor experience for visitors interested in culture and design.',
      'Guests can explore the exhibition halls at their own pace. Special events, guided tours, and seasonal exhibitions may be available throughout the year. The museum is a convenient option for a cultural visit during rainy or cooler days.',
    ],
    image: images.ContemporaryArtMuseum,
  },
  {
    id: 'CoastalViewpoint',
    name: 'Coastal Viewpoint',
    short: 'Open views and sunset moments',
    coordinates: { latitude: 41.3068, longitude: 19.8461 },
    paragraphs: [
      'The Coastal Viewpoint offers wide views of the surrounding landscape and distant shoreline. It is a peaceful location for taking photographs, enjoying fresh air, and watching the sunset. The viewpoint is especially popular during the late afternoon.',
      'Visitors can spend a short time there or combine the stop with a longer scenic route. The open surroundings create a calm and memorable atmosphere. Guests should check the weather before planning their visit.',
    ],
    image: images.CoastalViewpoint,
  },
];
