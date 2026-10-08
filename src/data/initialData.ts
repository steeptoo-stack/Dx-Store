import { StoreSettings, Product, Category, Order, Customer } from '../types';

export const initialStoreSettings: StoreSettings = {
  store: {
    name: "DX Security",
    tagline: "Advanced AI Surveillance & Enterprise Security Solutions",
    logoUrl: "",
    faviconUrl: "",
    description: "Bangladesh's leading provider of certified CCTV surveillance, IP cameras, 4K NVR/DVR setups, biometric access control, and smart security alarms.",
    currency: "BDT",
    currencySymbol: "৳",
    orderPrefix: "DXS",
    timezone: "Asia/Dhaka"
  },
  contact: {
    phone: "01761861680",
    whatsapp: "01761861680",
    whatsappFormatted: "+8801761861680",
    email: "Not configured",
    address: "Level 4, Multiplan Center, 69-71 New Elephant Road, Dhaka-1205, Bangladesh",
    businessHours: "Saturday - Thursday: 10:00 AM - 8:00 PM (Friday Closed)",
    supportMessage: "Contact our technical surveillance engineers anytime for custom security consultation and instant quotation."
  },
  payment: {
    codEnabled: true,
    codCharge: 0,
    codInstructions: "Pay cash in hand to the delivery courier after verifying your security equipment package.",
    bkashEnabled: true,
    bkashNumber: "01761861680",
    bkashType: "Manual Payment / Send Money",
    bkashInstructions: `1. Open your bKash Mobile App and select 'Send Money'.
2. Enter our bKash Personal Number: 01761861680.
3. Enter the total bill amount.
4. In Reference, enter your Phone Number or Name.
5. Enter your bKash PIN to confirm transaction.
6. Copy the Transaction ID (TrxID) and enter it below along with your sender bKash number.`,
    nagadEnabled: true,
    nagadNumber: "Not configured",
    nagadType: "Manual Payment / Send Money",
    nagadInstructions: `1. Open your Nagad Mobile App and tap 'Send Money'.
2. Enter the displayed Nagad Number.
3. Enter the total payable amount.
4. Put your contact number in reference.
5. Complete transaction and enter the Transaction ID (TrxID) below.`,
    minOrderAmount: 0
  },
  delivery: {
    insideDhakaCharge: 80,
    outsideDhakaCharge: 150,
    freeDeliveryThreshold: 10000,
    estimatedDeliveryInside: "24 to 48 Hours (Dhaka Metro Express)",
    estimatedDeliveryOutside: "2 to 4 Days (All 64 Districts via Steadfast/SA Paribahan/Sundarban Courier)",
    deliveryInstructions: "All surveillance gear is securely bubble-wrapped with official tamper-evident security warranty seals."
  },
  homepage: {
    heroTitle: "Next-Gen AI Surveillance & Smart Security",
    heroSubtitle: "Protect your residence, factory, showroom, and corporate premises with 4K Ultra-HD night vision cameras, smart biometric entry, and 24/7 cloud live monitoring.",
    heroBadge: "Official Security Partner in Bangladesh",
    heroImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=1200&q=80",
    heroBtnText: "Explore Security Cameras",
    heroBtnLink: "#products",
    bannerEnabled: true,
    bannerTitle: "Exclusive 4-Camera ColorVu 5MP Full Package",
    bannerSubtitle: "Complete package including 4x Night Color Cameras, 4K NVR, 1TB Surveillance HDD, Cat6 cabling and installation guidance. Flat 15% discount this week!",
    bannerImage: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=1200&q=80",
    bannerBtnText: "View Featured Packages",
    showFeatured: true,
    showNewArrivals: true,
    showCategories: true,
    showWhyChooseUs: true,
    showStats: true
  },
  website: {
    siteTitle: "DX Security - Surveillance & Smart Security Systems",
    metaDescription: "DX Security offers top-grade CCTV cameras, NVR/DVR systems, biometric time-attendance, and smart security alarms across Bangladesh. Fast delivery with bKash, Nagad, and Cash on Delivery.",
    keywords: "CCTV camera Bangladesh, Hikvision camera price, Dahua NVR, bKash payment camera, surveillance system Dhaka, DX Security",
    announcementBarText: "🚚 সারাদেশে Cash on Delivery Available | 📞 হটলাইন: 01761861680 | 100% জেনুইন প্রোডাক্ট",
    announcementBarEnabled: true,
    footerText: "DX Security is Bangladesh's dedicated provider of commercial & residential electronic security, surveillance equipment, and access control technology.",
    copyrightText: "© 2026 DX Security Bangladesh. All rights reserved."
  },
  social: {
    facebookUrl: "https://facebook.com/dxsecuritybd",
    facebookEnabled: true,
    instagramUrl: "https://instagram.com/dxsecuritybd",
    instagramEnabled: true,
    youtubeUrl: "https://youtube.com/@dxsecuritybd",
    youtubeEnabled: true,
    tiktokUrl: "",
    tiktokEnabled: false,
    linkedinUrl: "",
    linkedinEnabled: false
  },
  about: {
    title: "About DX Security Bangladesh",
    description: "Founded with the ambition to make enterprise-grade security accessible for every business and home in Bangladesh, DX Security delivers authentic surveillance technology from global market leaders including Hikvision, Dahua, Tiandy, and ZKTeco.",
    companyInfo: "DX Security operates with certified technical engineers trained in IP networking, fiber optic video transmission, and enterprise biometric systems. We maintain a zero-tolerance policy against counterfeit surveillance products.",
    mission: "To safeguard lives, businesses, and property across Bangladesh by deploying cutting-edge, dependable security equipment backed by rapid warranty fulfillment.",
    vision: "To be Bangladesh's premier smart security automation and artificial intelligence surveillance powerhouse.",
    whyChooseUs: [
      "100% Authentic Brand-New Products with Original Serial Numbers",
      "Official 2-Year Replacement & Service Warranty",
      "Experienced Surveillance Field Engineers for Setup Guidance",
      "Cash on Delivery & Secure bKash/Nagad Manual Verification",
      "Fast Express Delivery across all 64 Districts in Bangladesh",
      "Free Remote Viewing Setup on Mobile Phones & PCs"
    ]
  },
  policies: {
    privacyPolicy: `At DX Security, we value and respect your privacy.
    
1. Information Collection: We collect only essential contact information (name, delivery address, phone number, and transaction references) required to process orders and warranty claims.
2. Data Usage: Your phone number and address are shared only with verified courier partners for delivery.
3. No Third-Party Selling: We never sell, rent, or trade customer contact details to third-party marketing companies.
4. Security: Payment transaction IDs are recorded exclusively for financial reconciliation and verification.`,
    termsAndConditions: `Terms & Conditions of DX Security:
    
1. Order Acceptance: All orders submitted online are subject to verification. Orders with invalid phone numbers or missing payment details may be held.
2. Pricing: All prices are listed in Bangladeshi Taka (BDT) and include standard packaging.
3. bKash / Nagad Transactions: For manual bKash or Nagad payments, orders are confirmed once our accounts desk verifies the Transaction ID. Please ensure accurate TrxID entry.
4. Warranty Claims: Official warranty requires keeping the product box with the serial sticker intact.`,
    returnAndRefundPolicy: `Return & Replacement Policy:
    
1. 7-Day Replacement: If a product arrives physically damaged or functionally defective out of the box, notify us within 48 hours for immediate replacement.
2. Original Packaging: Returned products must include all original accessories, adapters, mounting screws, and warranty slips.
3. Refund Processing: For manual bKash/Nagad cancellations prior to dispatch, refunds are returned to the sender's account within 24-48 business hours.`,
    deliveryPolicy: `Nationwide Delivery Guidelines:
    
1. Inside Dhaka Metro: Delivery within 24 to 48 hours via local bike courier. Standard fee ৳80.
2. Outside Dhaka (All 64 Districts): Delivery within 2 to 4 business days via courier services (Steadfast, Sundarban, SA Paribahan). Standard fee ৳150.
3. Verification: You may inspect the package exterior prior to accepting from the courier rider.`
  }
};

export const initialCategories: Category[] = [
  {
    id: "cat-1",
    name: "IP Surveillance Cameras",
    slug: "ip-cameras",
    description: "High-definition Network cameras with AI human & vehicle detection, ColorVu 24/7 color night vision, and POE support.",
    image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=600&q=80",
    isEnabled: true
  },
  {
    id: "cat-2",
    name: "NVR & DVR Recorders",
    slug: "recorders",
    description: "4K 8/16/32-channel Network Video Recorders with smart AcuSense playback and heavy-duty surveillance HDD support.",
    image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=600&q=80",
    isEnabled: true
  },
  {
    id: "cat-3",
    name: "Biometric & Access Control",
    slug: "access-control",
    description: "Fingerprint, facial recognition, and RFID card door locks and employee time-attendance machines.",
    image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=600&q=80",
    isEnabled: true
  },
  {
    id: "cat-4",
    name: "Smart Video Intercoms",
    slug: "video-intercom",
    description: "Two-way audio and video doorbells with indoor touchscreens and mobile remote door unlock.",
    image: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=600&q=80",
    isEnabled: true
  },
  {
    id: "cat-5",
    name: "Security Accessories & Cables",
    slug: "accessories",
    description: "Pure copper Cat6 cables, POE switches, surveillance hard drives, and industrial power supplies.",
    image: "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=600&q=80",
    isEnabled: true
  }
];

export const initialProducts: Product[] = [
  {
    id: "prod-1",
    name: "Hikvision DS-2CD2047G2-LU 4MP ColorVu Bullet IP Camera",
    slug: "hikvision-ds-2cd2047g2-lu-4mp-colorvu",
    category: "IP Surveillance Cameras",
    price: 6800,
    discountPrice: 5950,
    stock: 24,
    sku: "HIK-CV-4MP-01",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isVisible: true,
    shortDescription: "4MP 24/7 full-time color image with F1.0 super-aperture, AcuSense AI human & vehicle target classification, and built-in microphone.",
    description: "Hikvision DS-2CD2047G2-LU provides 24/7 vivid chromatic images in total darkness. Deep learning artificial intelligence accurately classifies humans and vehicles, dramatically cutting false alarms caused by rain or animals. IP67 weather-proof metal casing ensures outdoor resilience.",
    specifications: [
      { label: "Resolution", value: "4 Megapixel (2688 × 1520 @ 30fps)" },
      { label: "Lens", value: "2.8mm Fixed Lens, 112° FOV" },
      { label: "Night Vision", value: "24/7 ColorVu Full Color, White Light up to 40m" },
      { label: "Audio", value: "Built-in High-Sensitivity Microphone" },
      { label: "Protection", value: "IP67 Water and Dust Resistant" },
      { label: "Power", value: "12 VDC & PoE (802.3af)" }
    ],
    features: [
      "24/7 Colorful Imaging with F1.0 Advanced Sensor",
      "Deep Learning Human and Vehicle Classification",
      "130 dB True WDR for Crystal Clear Backlit Video",
      "Built-in MicroSD Slot up to 256 GB",
      "Real-time Audio Recording"
    ],
    warranty: "2 Years Official Replacement Warranty"
  },
  {
    id: "prod-2",
    name: "Hikvision 8-Channel 4K AcuSense NVR (DS-7608NXI-K2)",
    slug: "hikvision-8ch-4k-acusense-nvr",
    category: "NVR & DVR Recorders",
    price: 11500,
    discountPrice: 9900,
    stock: 12,
    sku: "HIK-NVR-8K2",
    images: [
      "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isVisible: true,
    shortDescription: "8-Channel 4K Ultra-HD Network Video Recorder supporting dual SATA hard drives up to 20TB, H.265+ compression, and smart motion search.",
    description: "The Hikvision DS-7608NXI-K2 AcuSense NVR is engineered for uninterrupted 24/7 surveillance. Equipped with HDMI 4K video output, H.265+ compression which saves 75% bandwidth and storage, and smart face/perimeter detection search.",
    specifications: [
      { label: "Video Channels", value: "8 IP Channels up to 12MP resolution" },
      { label: "Output", value: "1x HDMI (4K 3840×2160), 1x VGA" },
      { label: "SATA Storage", value: "2 SATA Interfaces (Up to 10TB each, 20TB total)" },
      { label: "Decoding Format", value: "H.265+ / H.265 / H.264+ / H.264" },
      { label: "Incoming Bandwidth", value: "80 Mbps" },
      { label: "Smart Feature", value: "AcuSense False Alarm Reduction" }
    ],
    features: [
      "4K Ultra-HD Display Output",
      "Supports 2x SATA Hard Drives",
      "Hik-Connect Free Mobile App Live View",
      "AI Smart Playback by Person or Vehicle"
    ],
    warranty: "2 Years Replacement Warranty"
  },
  {
    id: "prod-3",
    name: "Dahua DH-IPC-HFW1230S 2MP Entry IR Bullet IP Camera",
    slug: "dahua-dh-ipc-hfw1230s-2mp-bullet",
    category: "IP Surveillance Cameras",
    price: 3600,
    discountPrice: 3100,
    stock: 35,
    sku: "DAH-BUL-2MP",
    images: [
      "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: false,
    isNewArrival: true,
    isVisible: true,
    shortDescription: "2MP 1080P Full HD IP bullet camera with 30m Smart IR night vision, IP67 weather resistance, and high-efficiency H.265+ encoding.",
    description: "Affordable, industrial-grade surveillance camera from Dahua. Ideal for small stores, residences, garages, and corridors. Features smart illumination to avoid overexposing nearby objects at night.",
    specifications: [
      { label: "Resolution", value: "2MP (1920 × 1080) @ 25/30 fps" },
      { label: "IR Distance", value: "Up to 30 meters Smart IR" },
      { label: "Lens", value: "3.6mm (84° angle)" },
      { label: "Ingress Protection", value: "IP67 Outdoor Weatherproof" },
      { label: "Power", value: "PoE (802.3af) or 12V DC" }
    ],
    features: [
      "Crystal Clear 1080P Full HD Video",
      "Smart IR Night Vision without Whiteout",
      "H.265+ Codec saves Storage",
      "Plug & Play with Dahua NVR"
    ],
    warranty: "1 Year Official Warranty"
  },
  {
    id: "prod-4",
    name: "ZKTeco K40 Biometric Fingerprint & RFID Time Attendance Terminal",
    slug: "zkteco-k40-biometric-attendance",
    category: "Biometric & Access Control",
    price: 6500,
    discountPrice: 5700,
    stock: 18,
    sku: "ZK-K40-BIO",
    images: [
      "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: true,
    isNewArrival: false,
    isVisible: true,
    shortDescription: "Standalone fingerprint and RFID card time-attendance device with built-in backup battery, 2.8-inch TFT screen, and TCP/IP network report download.",
    description: "The ZKTeco K40 is Bangladesh's most popular office attendance machine. Features a built-in battery that keeps operating during power outages. Includes free desktop software for Excel attendance reports, overtime calculation, and payroll integration.",
    specifications: [
      { label: "Fingerprint Capacity", value: "1,000 Fingerprints" },
      { label: "Card Capacity", value: "1,000 ID Cards" },
      { label: "Record Capacity", value: "80,000 Transactions" },
      { label: "Display", value: "2.8-inch Color TFT Screen" },
      { label: "Communication", value: "TCP/IP, USB-Host (Flash Drive download)" },
      { label: "Backup Battery", value: "Built-in Rechargeable (Up to 4 Hours backup)" }
    ],
    features: [
      "Operates during Load Shedding via Built-in Battery",
      "Instant Excel Report Export via USB Pen Drive",
      "Door Access Control Relay Port included",
      "Speedy Verification under 0.5 seconds"
    ],
    warranty: "1 Year Replacement Warranty"
  },
  {
    id: "prod-5",
    name: "Hikvision DS-KIS602 Modular IP Video Intercom Doorbell System",
    slug: "hikvision-ds-kis602-modular-ip-intercom",
    category: "Smart Video Intercoms",
    price: 18500,
    discountPrice: 16900,
    stock: 8,
    sku: "HIK-INT-602",
    images: [
      "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: true,
    isNewArrival: true,
    isVisible: true,
    shortDescription: "Premium modular IP video door phone system featuring 2MP HD fisheye camera door station, 7-inch indoor touchscreen, and remote smartphone unlocking.",
    description: "Answer your door from anywhere in the world. The Hikvision DS-KIS602 kit lets you see who is at your gate in 1080P HD, speak with two-way noise-cancelling audio, and unlock magnetic door strikes directly from the indoor touch monitor or your smartphone via Hik-Connect.",
    specifications: [
      { label: "Camera", value: "2MP HD Fisheye with 180° Panoramic View" },
      { label: "Indoor Display", value: "7-Inch Capacitive Touch Screen (1024 × 600)" },
      { label: "Audio", value: "Noise Suppression and Echo Cancellation" },
      { label: "Unlocking", value: "Remote App Unlock, RFID Card, Indoor Screen" },
      { label: "Power", value: "Standard PoE (IEEE 802.3af)" }
    ],
    features: [
      "Smartphone Notification & Live Video Call",
      "Unlock Electric Gate Lock remotely",
      "180-Degree Fisheye Wide Camera View",
      "SD Card Slot for Visitor Snapshots"
    ],
    warranty: "2 Years Replacement Warranty"
  },
  {
    id: "prod-6",
    name: "Western Digital Purple 4TB Surveillance 24/7 Hard Drive",
    slug: "wd-purple-4tb-surveillance-hdd",
    category: "Security Accessories & Cables",
    price: 12500,
    discountPrice: 11200,
    stock: 15,
    sku: "WD-PURP-4TB",
    images: [
      "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=800&q=80"
    ],
    mainImage: "https://images.unsplash.com/photo-1544716278-e513176f20b5?auto=format&fit=crop&w=800&q=80",
    status: "active",
    isFeatured: false,
    isNewArrival: false,
    isVisible: true,
    shortDescription: "Engineered specifically for 24/7, high-temperature, always-on NVR/DVR surveillance systems. Supports up to 64 HD video streams.",
    description: "Built for always-on, 24/7 high-definition surveillance security systems. With a supported workload rating of up to 180 TB/yr and support for up to 64 cameras, WD Purple drives are optimized for surveillance systems with AllFrame technology.",
    specifications: [
      { label: "Capacity", value: "4 Terabytes" },
      { label: "Form Factor", value: "3.5-inch Internal SATA 6 Gb/s" },
      { label: "Cache", value: "256 MB" },
      { label: "Workload Rating", value: "180 TB / Year" },
      { label: "Technology", value: "AllFrame 4K Technology for zero frame loss" }
    ],
    features: [
      "Specially Tuned for 24/7 Security Recording",
      "Low Power Consumption & Heat Generation",
      "Supports up to 64 Cameras simultaneously",
      "100% Genuine with Warranty Serial"
    ],
    warranty: "3 Years Official Replacement Warranty"
  }
];

export const initialOrders: Order[] = [
  {
    id: "DXS-82914",
    customerName: "Engr. Tanvir Ahmed",
    phone: "01712345678",
    email: "tanvir.tech@gmail.com",
    address: "House 14, Road 7, Sector 3, Uttara",
    district: "Dhaka",
    thana: "Uttara West",
    notes: "Please call before delivery. Urgent setup for office.",
    items: [
      {
        productId: "prod-1",
        name: "Hikvision DS-2CD2047G2-LU 4MP ColorVu Bullet IP Camera",
        price: 5950,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        sku: "HIK-CV-4MP-01"
      },
      {
        productId: "prod-2",
        name: "Hikvision 8-Channel 4K AcuSense NVR (DS-7608NXI-K2)",
        price: 9900,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=800&q=80",
        sku: "HIK-NVR-8K2"
      }
    ],
    subtotal: 21800,
    deliveryCharge: 80,
    total: 21880,
    paymentMethod: "bkash",
    paymentStatus: "Verified",
    paymentPhoneNumber: "01712345678",
    transactionId: "BK9A82X91M",
    orderStatus: "Processing",
    createdAt: "2026-10-06T14:22:00Z",
    updatedAt: "2026-10-06T15:10:00Z",
    timeline: [
      { status: "Pending", timestamp: "2026-10-06T14:22:00Z", note: "Order placed via website with bKash Send Money." },
      { status: "Payment Verified", timestamp: "2026-10-06T14:35:00Z", note: "Admin verified bKash TrxID BK9A82X91M for amount ৳21,880." },
      { status: "Confirmed", timestamp: "2026-10-06T14:40:00Z", note: "Order confirmed with customer over phone." },
      { status: "Processing", timestamp: "2026-10-06T15:10:00Z", note: "Hardware tested and packed with warranty seal." }
    ]
  },
  {
    id: "DXS-82915",
    customerName: "Md. Rafiqul Islam",
    phone: "01819876543",
    email: "",
    address: "Holding 42, GEC Circle, Nasirabad",
    district: "Chittagong",
    thana: "Panchlaish",
    notes: "Deliver via Sundarban Courier.",
    items: [
      {
        productId: "prod-4",
        name: "ZKTeco K40 Biometric Fingerprint & RFID Time Attendance Terminal",
        price: 5700,
        quantity: 1,
        image: "https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80",
        sku: "ZK-K40-BIO"
      }
    ],
    subtotal: 5700,
    deliveryCharge: 150,
    total: 5850,
    paymentMethod: "cod",
    paymentStatus: "Pending",
    orderStatus: "Confirmed",
    createdAt: "2026-10-07T09:15:00Z",
    updatedAt: "2026-10-07T09:45:00Z",
    timeline: [
      { status: "Pending", timestamp: "2026-10-07T09:15:00Z", note: "Cash on delivery order submitted." },
      { status: "Confirmed", timestamp: "2026-10-07T09:45:00Z", note: "Customer confirmed order over telephone." }
    ]
  },
  {
    id: "DXS-82916",
    customerName: "Kamrul Hasan",
    phone: "01911223344",
    email: "kamrul.hasan@yahoo.com",
    address: "Block C, Bashundhara R/A",
    district: "Dhaka",
    thana: "Bhatara",
    notes: "New bKash submission waiting for verification",
    items: [
      {
        productId: "prod-3",
        name: "Dahua DH-IPC-HFW1230S 2MP Entry IR Bullet IP Camera",
        price: 3100,
        quantity: 2,
        image: "https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&w=800&q=80",
        sku: "DAH-BUL-2MP"
      }
    ],
    subtotal: 6200,
    deliveryCharge: 80,
    total: 6280,
    paymentMethod: "bkash",
    paymentStatus: "Pending",
    paymentPhoneNumber: "01911223344",
    transactionId: "BK7K3921AA",
    orderStatus: "Pending",
    createdAt: "2026-10-07T10:10:00Z",
    updatedAt: "2026-10-07T10:10:00Z",
    timeline: [
      { status: "Pending", timestamp: "2026-10-07T10:10:00Z", note: "Order placed. Awaiting admin transaction verification." }
    ]
  }
];

export const initialCustomers: Customer[] = [
  {
    id: "cust-1",
    name: "Engr. Tanvir Ahmed",
    phone: "01712345678",
    email: "tanvir.tech@gmail.com",
    address: "House 14, Road 7, Sector 3, Uttara",
    district: "Dhaka",
    ordersCount: 2,
    totalSpent: 43760,
    lastOrderDate: "2026-10-06T14:22:00Z"
  },
  {
    id: "cust-2",
    name: "Md. Rafiqul Islam",
    phone: "01819876543",
    email: "",
    address: "Holding 42, GEC Circle, Nasirabad",
    district: "Chittagong",
    ordersCount: 1,
    totalSpent: 5850,
    lastOrderDate: "2026-10-07T09:15:00Z"
  },
  {
    id: "cust-3",
    name: "Kamrul Hasan",
    phone: "01911223344",
    email: "kamrul.hasan@yahoo.com",
    address: "Block C, Bashundhara R/A",
    district: "Dhaka",
    ordersCount: 1,
    totalSpent: 6280,
    lastOrderDate: "2026-10-07T10:10:00Z"
  }
];
