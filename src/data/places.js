export const PLACES = [
  {
    id: 'place-1',
    name: 'منتجع ومطعم النخيل الشاطئي',
    nameEn: 'Al-Nakhil Beach Resort & Restaurant',
    cityId: 'arish',
    categoryId: 'restaurant',
    rating: 4.9,
    reviewCount: 128,
    minPrice: 150,
    maxPrice: 450,
    priceRange: '150 – 450 ج.م',
    featured: true,
    isOpenNow: true,
    whatsapp: '201012345678',
    phone: '+20 68 335 1200',
    address: 'كورنيش العريش، شمال سيناء',
    location: {
      address: 'كورنيش العريش، شمال سيناء',
      latitude: 31.1350,
      longitude: 33.7990
    },
    description: 'وجهة ساحلية رائدة في العريش توفر إطلالات بانورامية على البحر الأبيض المتوسط تحت ظلال نخيل التمر الشاهقة. يشتهر بصيد اليوم الطازج من الأسماك، الجمبري المشوي على الفحم، والولائم البدوية الأصيلة.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80'
    ],
    openingTime: '11:00',
    closingTime: '00:00',
    openingHours: '11:00 ص — 12:00 م',
    amenities: ['إطلالة مباشرة على البحر', 'جلسات بدوية تحت النخيل', 'واي فاي مجاني', 'موقف سيارات', 'قسم خاص للعائلات', 'مصلى'],
    coordinates: { lat: 31.1350, lng: 33.7990 },
    hasOrdering: true,
    hasBooking: true,
    ownerId: 'user-business-1',
    menu: [
      {
        category: 'أسماك البحر الطازجة',
        items: [
          { id: 'm1', name: 'سمك قاروص البحر المتوسط المشوي', price: 340, description: 'قاروص طازج متبل بيافا وزيت الزيتون والليمون والأعشاب السيناوية.', image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'm2', name: 'طبق جمبري جامبو مشوي على الفحم', price: 420, description: 'جمبري جامبو طازج يقدم مع زبدة الثوم والأرز البدوي المبهر.', image: 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'm3', name: 'طاجن فواكه البحر السيناوي', price: 290, description: 'طاجن فخار طازج بالصلصة الحمراء والأعشاب والجمبري والكاليماري.', image: 'https://images.unsplash.com/photo-1559847844-5315695dadae?auto=format&fit=crop&w=600&q=80', available: true }
        ]
      },
      {
        category: 'المشويات البدوية',
        items: [
          { id: 'm4', name: 'ريش ضأن مندي بدوي', price: 380, description: 'لحم ضأن طري مطهوة على البطيء تحت الأرض مع أرز البسمتي المعطر.', image: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'm5', name: 'طبق مشكل كفتة وشيش طاووق', price: 310, description: 'أسياخ كفتة وشيش متبلة بالأعشاب البدوية المشوية على الحطب.', image: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?auto=format&fit=crop&w=600&q=80', available: true }
        ]
      },
      {
        category: 'المشروبات والحلويات',
        items: [
          { id: 'm6', name: 'شاي الحبق السيناوي على الجمر', price: 45, description: 'شاي أسود بدوي أصيل مغلي مع نعناع الحبق الجبلي الدافئ.', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'm7', name: 'عصير مانجو مع تمر سيناوي', price: 65, description: 'مزيج منعش من المانجو الطازجة وتمر العريش الحلو.', image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80', available: true }
        ]
      }
    ]
  },
  {
    id: 'place-2',
    name: 'كافيه ولاونج الباشا المطل على البحر',
    nameEn: 'Al-Basha Seafront Café & Lounge',
    cityId: 'arish',
    categoryId: 'cafe',
    rating: 4.8,
    reviewCount: 94,
    minPrice: 50,
    maxPrice: 180,
    priceRange: '50 – 180 ج.م',
    featured: true,
    isOpenNow: true,
    whatsapp: '201098765432',
    phone: '+20 68 336 4410',
    address: 'ممشى كورنيش العريش الساحلي',
    location: {
      address: 'ممشى كورنيش العريش الساحلي',
      latitude: 31.1362,
      longitude: 33.8012
    },
    description: 'كافيه زجاجي فاخر يقع مباشرة على البحر المتوسط في العريش. يقدم قهوة مختصة، حلويات غربية وشرقية طازجة، عصائر طبيعية، وشيشة في أجواء نسيم البحر الساحرة.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80'
    ],
    openingTime: '08:00',
    closingTime: '01:00',
    openingHours: '08:00 ص — 01:00 ص',
    amenities: ['تراس على البحر مباشرة', 'واي فاي سريع', 'أجواء عائلية', 'قهوة مختصة', 'موسيقى هادئة'],
    coordinates: { lat: 31.1362, lng: 33.8012 },
    hasOrdering: true,
    hasBooking: true,
    ownerId: 'user-business-2',
    menu: [
      {
        category: 'القهوة المختصة والمشروبات',
        items: [
          { id: 'mc1', name: 'سبانيش لاتيه (بارد / ساخن)', price: 75, description: 'جرعة إسبريسو مزدوجة مع الحليب المكثف والمهدرج.', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'mc2', name: 'قهوة بدوية بالهيل والزعفران', price: 50, description: 'قهوة عربية محمصة خفيفة ومغلية في دلة نُحاسية مع الهيل.', image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80', available: true }
        ]
      },
      {
        category: 'الحلويات والمخبوزات',
        items: [
          { id: 'mc3', name: 'وافل بلجيكي بالنوتيلا والتوت', price: 110, description: 'وافل ساخن مقرمش محشو بشوكولاتة النوتيلا وقطع الفراولة والتوت.', image: 'https://images.unsplash.com/photo-1562376552-0d160a2f238d?auto=format&fit=crop&w=600&q=80', available: true },
          { id: 'mc4', name: 'تشيز كيك الكنافة بالفستق', price: 125, description: 'تشيز كيك كريمي غني يعلوه طبقة كنافة مقرمشة بالزبدة والفستق.', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80', available: true }
        ]
      }
    ]
  },
  {
    id: 'place-3',
    name: 'محمية الزرانيق الطبيعية ومحيط بحيرة بردويل',
    nameEn: 'Zaraniq Protectorate & Bird Sanctuary',
    cityId: 'bir-al-abd',
    categoryId: 'attraction',
    rating: 4.9,
    reviewCount: 156,
    priceRange: '$',
    featured: true,
    isOpenNow: true,
    whatsapp: '201055544332',
    phone: '+20 68 377 1010',
    address: 'اللسان الشرقي لبحيرة بردويل، بئر العبد، شمال سيناء',
    description: 'محمية طبيعية ذات أهمية عالمية مسجلة في اتفاقية رامسار. تعتبر المحطة الرئيسية لمئات الآلاف من الطيور المهاجرة سنوياً بين أفريقيا وأوروبا، بما في ذلك طيور الفلامنغو الوردي والبجع والظربان.',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: '07:00 صباحاً - 05:00 مساءً',
    amenities: ['مركز زوار', 'جولات بيئية بإرشاد متخصص', 'أبراج مراقبة بالتلسكوب', 'نقاط تصوير طبيعي'],
    coordinates: { lat: 31.1000, lng: 33.4333 },
    hasOrdering: false,
    hasBooking: true,
    ownerId: null,
    menu: []
  },
  {
    id: 'place-4',
    name: 'شاطئ نخيل العريش الملكي والشاليهات',
    nameEn: 'Al-Arish Royal Palm Beach & Chalets',
    cityId: 'arish',
    categoryId: 'beach',
    rating: 4.7,
    reviewCount: 210,
    priceRange: '$$',
    featured: true,
    isOpenNow: true,
    whatsapp: '201011223344',
    phone: '+20 68 335 8899',
    address: 'ساحل النخيل الغربي، العريش',
    description: 'شاطئ ذهبي ساحر محاط بآلاف نخيل التمر الساحلية. يتميز بمياهه الضحلة الهادئة، شاليهات خاصة للمصطافين، ألعاب مائية، وجلسات مظللة مريحة.',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: '06:00 صباحاً - 08:00 مساءً',
    amenities: ['كبائن شاطئية', 'منقذون معتمدون', 'غرف تغيير الملابس ودش', 'رياضات مائية', 'كرة طائرة شاطئية'],
    coordinates: { lat: 31.1340, lng: 33.7920 },
    hasOrdering: false,
    hasBooking: true,
    ownerId: null,
    menu: []
  },
  {
    id: 'place-5',
    name: 'معصرة ومزارع الزيتون بالشيخ زويد',
    nameEn: 'Sheikh Zuweid Olive Estate & Organic Mill',
    cityId: 'sheikh-zuweid',
    categoryId: 'activity',
    rating: 4.8,
    reviewCount: 67,
    priceRange: '$',
    featured: false,
    isOpenNow: true,
    whatsapp: '201066778899',
    phone: '+20 68 350 1122',
    address: 'الحزام الزراعي، الشيخ زويد',
    description: 'تجربة جولات بين أشجار الزيتون المعمرة التي تعود لعقود طويلة. يمكنك تذوق زيت الزيتون البكر المعصور على البارد، العسل الجبلي، والزيتون المخلل مباشرة من المزارعين.',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: '08:00 صباحاً - 04:00 مساءً',
    amenities: ['تذوق منتجات المزرعة', 'متجر هدايا وزيوت', 'جولة بالجرار الزراعي', 'غداء طازج من المزرعة'],
    coordinates: { lat: 31.2190, lng: 34.1110 },
    hasOrdering: false,
    hasBooking: true,
    ownerId: null,
    menu: []
  },
  {
    id: 'place-6',
    name: 'نخيل واحة رفح المطلة على الغروب',
    nameEn: 'Rafah Coastal Palms & Sunset Point',
    cityId: 'rafah',
    categoryId: 'beach',
    rating: 4.6,
    reviewCount: 43,
    priceRange: '$',
    featured: false,
    isOpenNow: true,
    whatsapp: '201077889900',
    phone: '+20 68 360 4455',
    address: 'الطريق الساحلي، رفح',
    description: 'نقطة ساحلية هادئة ذات كبان رملية عذراء ومشاهد غروب شمس ساحرة على البحر المتوسط. مثالية للنزهات العائلية والمشي الساحلي.',
    image: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'
    ],
    openingHours: '24 ساعة',
    amenities: ['موقف سيارات مجاني', 'جلسات مظللة', 'موقع متميز للتصوير الفوتوغرافي'],
    coordinates: { lat: 31.2850, lng: 34.2430 },
    hasOrdering: false,
    hasBooking: false,
    ownerId: null,
    menu: []
  }
];
