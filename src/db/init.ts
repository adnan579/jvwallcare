import { pool } from './index.ts';

let initPromise: Promise<void> | null = null;

async function runDatabaseInitialization() {
  // 1. Ensure all 4 application tables exist (idempotent for fresh Neon / Vercel databases)
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      uid TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'ADMIN',
      password_hash TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS inquiries (
      id SERIAL PRIMARY KEY,
      reference_id TEXT NOT NULL UNIQUE,
      inquiry_type TEXT NOT NULL DEFAULT 'ORDER_INQUIRY',
      status TEXT NOT NULL DEFAULT 'NEW',
      full_name TEXT NOT NULL,
      firm_name TEXT,
      phone TEXT NOT NULL,
      email TEXT,
      location TEXT NOT NULL,
      building_segment TEXT,
      selected_product TEXT,
      quantity_or_target TEXT NOT NULL,
      godown_area_sqft TEXT,
      affiliation_tier TEXT,
      message TEXT,
      admin_notes TEXT,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS blogs (
      id SERIAL PRIMARY KEY,
      slug TEXT NOT NULL UNIQUE,
      title TEXT NOT NULL,
      hindi_subtitle TEXT,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'Wall Care Guide',
      cover_image_url TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      author_name TEXT NOT NULL DEFAULT 'J.V. Wall Care Technical Desk',
      read_time_minutes INTEGER NOT NULL DEFAULT 4,
      seo_keywords TEXT,
      status TEXT NOT NULL DEFAULT 'PUBLISHED',
      author_id INTEGER REFERENCES users(id),
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS gallery_items (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL,
      category TEXT NOT NULL DEFAULT 'PACKAGING',
      media_url TEXT NOT NULL,
      media_type TEXT NOT NULL DEFAULT 'image',
      cloudinary_public_id TEXT,
      featured BOOLEAN NOT NULL DEFAULT TRUE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

  // 2. Seed initial official blog posts if the blogs table is empty (fresh Neon DB)
  const blogCountRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM blogs');
  if ((blogCountRes.rows[0]?.cnt ?? 0) === 0) {
    await pool.query(`
      INSERT INTO blogs (slug, title, hindi_subtitle, excerpt, content, category, cover_image_url, media_type, author_name, read_time_minutes, seo_keywords, status)
      VALUES
      (
        'waterproof-blue-vs-extra-fine-teal-wall-putty-guide',
        'How to Choose Between J.V. Water Proof (Blue Pack) & Extra Fine (Teal Pack) 40 kg Wall Putty',
        'जे. वी. वाटर प्रूफ (ब्लू पैक) बनाम एक्स्ट्रा फाइन (टील पैक) — सही चुनाव कैसे करें',
        'A complete civil engineering and painter guide comparing J.V. Water Proof Wall Putty (JV-WP-40B) for damp-prone exteriors and J.V. Extra Fine Wall Putty (JV-EF-40T) for ultra-smooth luxury interiors.',
        'Selecting the right wall putty determines how long your exterior and interior paints survive monsoon humidity and dust. J.V. Water Proof Wall Putty (Blue & Orange 40 kg Pack, JV-WP-40B) is formulated with hydrophobic polymers and white cement to create a moisture-blocking barrier on exterior facades, balconies, and damp-prone rooms. It provides Water Proof, Wind Resistant, Anti-Pill, Anti-Cracking, and Anti-Fungal defense with 12–15 sq. ft./kg coverage across 2 coats.

For living rooms, bedrooms, schools, offices, and commercial interiors where a mirror-smooth finish is paramount, J.V. Wall Putty — Extra Fine Finish (Teal & Orange 40 kg Pack, JV-EF-40T) delivers rapid trowel glide, Water Resistant and Anti-Bacterial protection, and 14–16 sq. ft./kg coverage. Mix 38% clean water by weight, apply in 2 coats (max 1.5 mm total thickness) with 4–6 hours drying between coats, and allow 24 hours before priming.',
        'Product Selection Guide',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.00_PM_05cafad8.jpeg',
        'image',
        'J.V. Wall Care Technical Desk, Bhadohi',
        5,
        'JV Wall Putty, Waterproof Wall Putty 40kg, Extra Fine Wall Putty, Bhadohi Wall Putty Manufacturer',
        'PUBLISHED'
      ),
      (
        'white-cement-polymer-putty-reduces-paint-consumption',
        'Why White Cement & Polymer Wall Putty Saves 25% Topcoat Paint Cost on New & Old Homes',
        'सफेद सीमेंट और पॉलीमर वाल पुट्टी से पेंट की खपत में 25% तक की बचत',
        'Discover how J.V. Wall Care Udyog ISO 9001:2015 certified wall putty seals micro-pores in rough plaster, prevents hairline shrinkage cracks, and brings out true emulsion shade brightness.',
        'Applying decorative paint directly on raw sand-cement plaster absorbs excessive emulsion and causes uneven patches. Because J.V. Wall Putty is manufactured using pure white cement and redispersible polymers at our Saripur, Gopiganj, Bhadohi plant, it fills plaster undulations and creates an ultra-white, low-porosity base.

Whether you are finishing a नया घर (New Home), repainting a पुराना घर (Old Home), or executing a कमर्शियल बिल्डिंग (Commercial Building), applying two smooth coats of J.V. Wall Putty reduces topcoat paint consumption by up to 25% while providing strong adhesion and eco-friendly durability.',
        'Site Application Protocol',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.21.59_PM__1__14b9e24f.jpeg',
        'image',
        'Quality Control Lab, Gopiganj Plant',
        4,
        'White Cement Wall Putty, Save Paint Cost, New Home Wall Putty, Old Home Repainting',
        'PUBLISHED'
      ),
      (
        'inside-saripur-gopiganj-bhadohi-wall-putty-manufacturing',
        'Inside Our Saripur, Gopiganj Manufacturing Plant & 40 kg HDPE Packaging Standards',
        'सारीपुर, गोपीगंज (भदोही) फैक्ट्री डिस्पैच और 40 kg एचडीपीई पैकेजिंग मानक',
        'How J.V. Wall Care Udyog ensures moisture-proof 40 kg laminated HDPE packaging, batch-tested ISO 9001:2015 consistency, and direct truckload dispatch across Eastern Uttar Pradesh.',
        'Wall putty is highly sensitive to ambient moisture during transit and godown storage. Every 40 kg bag dispatched from J.V. Wall Care Udyog (0, Gopiganj, Lohara Khas, Saripur, Bhadohi, UP 221303) is sealed in heavy-duty laminated HDPE sacks marked with ISO 9001:2015 quality certification, Use No Hooks handling guidelines, and batch traceability.

Authorized dealers, hardware stockists, and project contractors across Bhadohi, Varanasi, Mirzapur, Prayagraj, and Jaunpur benefit from direct factory pricing, fast loading turnaround, and consistent whiteness batch after batch.',
        'Manufacturing & Dealership',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.04_PM_54420459.jpeg',
        'image',
        'Plant Dispatch Desk, Bhadohi',
        4,
        'Wall Putty Factory Bhadohi, Gopiganj Wall Putty Dealership, 40kg HDPE Bag Putty',
        'PUBLISHED'
      )
      ON CONFLICT (slug) DO NOTHING;
    `);
  }

  // 3. Seed initial official gallery items if gallery_items is empty (fresh Neon DB)
  const galleryCountRes = await pool.query('SELECT COUNT(*)::int AS cnt FROM gallery_items');
  if ((galleryCountRes.rows[0]?.cnt ?? 0) === 0) {
    await pool.query(`
      INSERT INTO gallery_items (title, subtitle, category, media_url, media_type, featured)
      VALUES
      (
        'Official Campaign Poster — जे. वी. वाल पुट्टी (सुंदरता की पहचान)',
        'नया घर | पुराना घर | कमर्शियल बिल्डिंग · 5 Quality Pillars',
        'POSTER',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.21.59_PM__1__14b9e24f.jpeg',
        'image',
        TRUE
      ),
      (
        'Dual 40 kg Catalog Packaging — Blue Water Proof & Teal Extra Fine',
        'White Cement & Polymer Based Interior & Exterior Wall Putty (Net Wt. 40 kg)',
        'PACKAGING',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.00_PM_05cafad8.jpeg',
        'image',
        TRUE
      ),
      (
        'Physical 40 kg Factory Sack — Saripur, Gopiganj, Bhadohi Plant',
        'Laminated Moisture-Resistant HDPE Sack Ready for Dealer Dispatch',
        'PLANT',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.22.04_PM_54420459.jpeg',
        'image',
        TRUE
      ),
      (
        'Official J.V. Wall Putty Registered Brand Monogram',
        'Signature Teal & Safety Orange Identity of J.V. Wall Care Udyog',
        'POSTER',
        '/assets/aistudio/WhatsApp_Image_2026-11-15_at_8.21.59_PM_97b0b9ac.jpeg',
        'image',
        TRUE
      );
    `);
  }
}

export function ensureDatabaseInitialized(): Promise<void> {
  if (!initPromise) {
    initPromise = runDatabaseInitialization().catch((err) => {
      // Allow retry on the next request if a transient connection failure occurs
      initPromise = null;
      throw err;
    });
  }
  return initPromise;
}
