export interface CandidatePhoto {
  id: number;
  url?: string;
  photo_url?: string;
  is_main: boolean;
}

export interface Candidate {
  id: number;
  candidate_code: string;
  nickname: string;
  full_name: string;
  gender: 'male' | 'female';
  candidate_type: 'mandiri' | 'pashmina';
  status: string;
  marital_status: string;
  date_of_birth: string;
  place_of_birth: string;
  education: string;
  occupation: string;
  height: number;
  weight: number;
  email?: string;
  whatsapp_number?: string;
  full_address: string;
  daerah_id?: number;
  daerah?: { id: number; name: string } | string;
  desa_id?: number;
  desa?: { id: number; name: string } | string;
  kelompok_id?: number;
  kelompok?: { id: number; name: string } | string;
  self_description: string;
  sifat: string;
  sifat_dominan?: string[];
  traits?: string[];
  hobbies: string | string[];
  favorite_foods: string | string[];
  partner_criteria: string | string[];
  social_media?: Array<{ type: string; handle: string }>;
  parents_marital_status?: string;
  father_name?: string;
  father_membership_status?: string;
  father_occupation?: string;
  father_domicile?: string;
  mother_name?: string;
  mother_membership_status?: string;
  mother_occupation?: string;
  mother_domicile?: string;
  birth_order?: number;
  siblings_count?: number;
  company_name?: string;
  blood_type?: string;
  suku?: string;
  bio?: string;
  photos: CandidatePhoto[];
}

export interface EventSession {
  id: number;
  name: string;
  start_time: string;
  end_time: string;
}

export interface EventItem {
  id: number;
  slug: string;
  nama_kegiatan: string;
  deskripsi: string;
  banner_url?: string;
  type?: 'internal' | 'external' | string;
  created_at?: string;
  registration_status: 'open' | 'closed' | 'configurable';
  registration_open_at?: string;
  registration_close_at?: string;
  single_attendance?: boolean;
  candidates_count: number;
  lokasi?: string;
  dates: Array<{
    id: number;
    date: string;
    start_time?: string;
    end_time?: string;
    is_all_day?: boolean;
    sessions?: EventSession[];
    location?: { id: number; name: string; address?: string; gmap_link?: string };
  }>;
}

export const daerahs = [
  {
    id: 1,
    name: 'DKI Jakarta',
    children: [
      {
        id: 101,
        name: 'Jakarta Selatan',
        children: [
          { id: 1001, name: 'Tebet' },
          { id: 1002, name: 'Kebayoran Baru' },
          { id: 1003, name: 'Pasar Minggu' },
        ],
      },
      {
        id: 102,
        name: 'Jakarta Barat',
        children: [
          { id: 1004, name: 'Kalideres' },
          { id: 1005, name: 'Kebon Jeruk' },
        ],
      },
      {
        id: 103,
        name: 'Jakarta Timur',
        children: [
          { id: 1006, name: 'Duren Sawit' },
          { id: 1007, name: 'Jatinegara' },
        ],
      },
      {
        id: 104,
        name: 'Jakarta Pusat',
        children: [
          { id: 1008, name: 'Cempaka Putih' },
          { id: 1009, name: 'Menteng' },
        ],
      },
    ],
  },
  {
    id: 2,
    name: 'Jawa Barat',
    children: [
      {
        id: 201,
        name: 'Kota Bandung',
        children: [
          { id: 2001, name: 'Coblong' },
          { id: 2002, name: 'Cicendo' },
        ],
      },
    ],
  },
  {
    id: 3,
    name: 'Banten',
    children: [
      {
        id: 301,
        name: 'Tangerang',
        children: [
          { id: 3001, name: 'Cipondoh' },
          { id: 3002, name: 'Karawaci' },
        ],
      },
    ],
  },
];

export const educations = ['SMA / SMK', 'D3', 'S1', 'S2', 'S3', 'Pondok / Pesantren'];

export const mockCandidates: Candidate[] = [
  // Akhwat (Perempuan)
  {
    id: 1,
    candidate_code: 'A-042',
    nickname: 'Fatimah',
    full_name: 'Fatimah Az-Zahra',
    gender: 'female',
    candidate_type: 'mandiri',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '1998-05-14',
    place_of_birth: 'Jakarta',
    education: 'S1',
    occupation: 'Software Engineer',
    company_name: 'Tech Company Jakarta',
    height: 162,
    weight: 52,
    blood_type: 'O',
    suku: 'Jawa',
    email: 'fatimah.azzahra@email.com',
    whatsapp_number: '081234567890',
    full_address: 'Jl. Tebet Barat Dalam No. 12, Tebet, Jakarta Selatan',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 101,
    desa: { id: 101, name: 'Jakarta Selatan' },
    kelompok_id: 1001,
    kelompok: { id: 1001, name: 'Tebet' },
    self_description: 'Pribadi yang tenang, suka belajar hal baru dan membaca buku. Menjaga komitmen ibadah dan kekeluargaan.',
    bio: 'Bismillah, mencari pendamping hidup sholeh yang siap bersama membina rumah tangga sakinah, mawaddah, wa rohmah.',
    sifat: 'Penyabar, Ramah, Tanggung Jawab, Mandiri',
    traits: ['Penyabar', 'Ramah', 'Tanggung Jawab', 'Mandiri'],
    hobbies: ['Membaca', 'Memasak', 'Fotografi', 'Ngaji'],
    favorite_foods: ['Soto', 'Gado-gado', 'Ayam Bakar'],
    partner_criteria: 'Sholeh, berpendidikan S1/sederajat, memiliki pekerjaan halal & tetap, penyabar, tidak merokok, dan siap berkeluarga.',
    social_media: [{ type: 'instagram', handle: '@fatimah.az' }],
    parents_marital_status: 'married',
    father_name: 'H. Abdullah',
    father_membership_status: 'member',
    father_occupation: 'Wiraswasta',
    father_domicile: 'Jakarta Selatan',
    mother_name: 'Hj. Aminah',
    mother_membership_status: 'member',
    mother_occupation: 'Ibu Rumah Tangga',
    mother_domicile: 'Jakarta Selatan',
    birth_order: 2,
    siblings_count: 2,
    photos: [
      { id: 101, url: '/storage/register-hero.jpg', is_main: true },
      { id: 102, url: '/storage/register-hero-bg.jpg', is_main: false },
    ],
  },
  {
    id: 2,
    candidate_code: 'A-089',
    nickname: 'Aisyah',
    full_name: 'Aisyah Nurul Hidayah',
    gender: 'female',
    candidate_type: 'pashmina',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '2000-08-20',
    place_of_birth: 'Bandung',
    education: 'S1',
    occupation: 'Financial Analyst',
    company_name: 'Bank Syariah Mandiri',
    height: 158,
    weight: 48,
    blood_type: 'A',
    suku: 'Sunda',
    email: 'aisyah.nurul@email.com',
    whatsapp_number: '081398765432',
    full_address: 'Jl. Kemang Raya No. 45, Jakarta Selatan',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 101,
    desa: { id: 101, name: 'Jakarta Selatan' },
    kelompok_id: 1002,
    kelompok: { id: 1002, name: 'Kebayoran Baru' },
    self_description: 'Suka kerapian, menghargai waktu, aktif dalam kegiatan kemandirian dan kajian pemuda.',
    bio: 'Pribadi yang ceria, suka kerapian, disiplin dan aktif mengaji. Mencari imam keluarga yang membimbing.',
    sifat: 'Jujur, Amanah, Pekerja Keras, Humoris',
    traits: ['Jujur', 'Amanah', 'Pekerja Keras', 'Humoris'],
    hobbies: ['Traveling', 'Berkebun', 'Desain'],
    favorite_foods: ['Nasi Goreng', 'Rendang', 'Pempek'],
    partner_criteria: 'Sholeh, amanah, domisili Jabodetabek/Jawa Barat, bertanggung jawab terhadap nafkah.',
    social_media: [{ type: 'instagram', handle: '@aisyah_nh' }],
    parents_marital_status: 'married',
    father_name: 'Drs. H. Mulyono',
    father_membership_status: 'member',
    father_occupation: 'PNS',
    father_domicile: 'Jakarta Selatan',
    mother_name: 'Hj. Siti Rahmah',
    mother_membership_status: 'member',
    mother_occupation: 'Guru',
    mother_domicile: 'Jakarta Selatan',
    birth_order: 1,
    siblings_count: 1,
    photos: [
      { id: 201, url: '/storage/register-hero-bg.jpg', is_main: true },
    ],
  },
  {
    id: 3,
    candidate_code: 'A-104',
    nickname: 'Maryam',
    full_name: 'Maryam Salimah',
    gender: 'female',
    candidate_type: 'mandiri',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '1996-12-05',
    place_of_birth: 'Surabaya',
    education: 'S2',
    occupation: 'Apoteker',
    company_name: 'Rumah Sakit Islam',
    height: 165,
    weight: 55,
    blood_type: 'B',
    suku: 'Jawa',
    email: 'maryam.salimah@email.com',
    whatsapp_number: '081299887766',
    full_address: 'Kalideres, Jakarta Barat',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 102,
    desa: { id: 102, name: 'Jakarta Barat' },
    kelompok_id: 1004,
    kelompok: { id: 1004, name: 'Kalideres' },
    self_description: 'Senang dunia kesehatan dan edukasi herbal. Tenang dan senang berdiskusi mendalam.',
    bio: 'Praktisi kesehatan yang menyukai kesederhanaan dan keteraturan. Siap menikah barokah.',
    sifat: 'Religius, Penyabar, Teliti',
    traits: ['Religius', 'Penyabar', 'Teliti'],
    hobbies: ['Menulis', 'Membaca', 'Kuliner'],
    favorite_foods: ['Rawon', 'Sayur Asem'],
    partner_criteria: 'Faham agama, visioner, penyayang keluarga, berakhlak mulia.',
    social_media: [{ type: 'instagram', handle: '@maryam.salimah' }],
    photos: [
      { id: 301, url: '/storage/register-hero.jpg', is_main: true },
    ],
  },

  // Ikhwan (Laki-laki)
  {
    id: 4,
    candidate_code: 'I-011',
    nickname: 'Ahmad',
    full_name: 'Ahmad Fauzi Rahman',
    gender: 'male',
    candidate_type: 'mandiri',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '1995-04-18',
    place_of_birth: 'Jakarta',
    education: 'S1',
    occupation: 'Lead Product Designer',
    company_name: 'Digital Agency Jakarta',
    height: 175,
    weight: 68,
    blood_type: 'O',
    suku: 'Betawi',
    email: 'ahmad.fauzi@email.com',
    whatsapp_number: '081211223344',
    full_address: 'Jl. Tebet Timur Dalam No. 8, Jakarta Selatan',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 101,
    desa: { id: 101, name: 'Jakarta Selatan' },
    kelompok_id: 1001,
    kelompok: { id: 1001, name: 'Tebet' },
    self_description: 'Pekerja keras, suka olahraga futsal dan kajian rutin. Siap memimpin keluarga secara islami.',
    bio: 'Bismillah, ikhwan mandiri mencari akhwat sholehah untuk menyempurnakan separuh agama.',
    sifat: 'Tanggung Jawab, Jujur, Penyabar, Pekerja Keras',
    traits: ['Tanggung Jawab', 'Jujur', 'Penyabar', 'Pekerja Keras'],
    hobbies: ['Olahraga', 'Fotografi', 'Ngaji', 'Otomotif'],
    favorite_foods: ['Nasi Kebuli', 'Sate Kambing', 'Soto Betawi'],
    partner_criteria: 'Sholihah, menjaga aurat & pergaulan, penyabar, menghormati suami.',
    social_media: [{ type: 'instagram', handle: '@ahmadfauzi_r' }],
    parents_marital_status: 'married',
    father_name: 'H. Fauzi Bakri',
    father_membership_status: 'member',
    father_occupation: 'Wiraswasta',
    father_domicile: 'Jakarta Selatan',
    mother_name: 'Hj. Fatimah',
    mother_membership_status: 'member',
    mother_occupation: 'Ibu Rumah Tangga',
    mother_domicile: 'Jakarta Selatan',
    birth_order: 1,
    siblings_count: 3,
    photos: [
      { id: 401, url: '/storage/register-hero.jpg', is_main: true },
    ],
  },
  {
    id: 5,
    candidate_code: 'I-012',
    nickname: 'Zaid',
    full_name: 'Zaid Pratama Hakim',
    gender: 'male',
    candidate_type: 'pashmina',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '1997-11-10',
    place_of_birth: 'Bandung',
    education: 'S1',
    occupation: 'Civil Engineer',
    company_name: 'BUMN Konstruksi',
    height: 172,
    weight: 65,
    blood_type: 'A',
    suku: 'Sunda',
    email: 'zaid.pratama@email.com',
    whatsapp_number: '081377889900',
    full_address: 'Cempaka Putih, Jakarta Pusat',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 104,
    desa: { id: 104, name: 'Jakarta Pusat' },
    kelompok_id: 1008,
    kelompok: { id: 1008, name: 'Cempaka Putih' },
    self_description: 'Disiplin, menyukai kegiatan sosial, gemar membaca tafsir hadis dan traveling.',
    bio: 'Menyukai keteraturan, pekerja keras, siap berumah tangga dengan landasan syariat yang kokoh.',
    sifat: 'Amanah, Dermawan, Ramah, Sopan',
    traits: ['Amanah', 'Dermawan', 'Ramah', 'Sopan'],
    hobbies: ['Badminton', 'Traveling', 'Membaca'],
    favorite_foods: ['Nasi Padang', 'Ayam Goreng'],
    partner_criteria: 'Sholihah, berakhlak karimah, suka belajar dan mendukung dakwah.',
    social_media: [{ type: 'instagram', handle: '@zaid_hakim' }],
    photos: [
      { id: 501, url: '/storage/register-hero-bg.jpg', is_main: true },
    ],
  },
  {
    id: 6,
    candidate_code: 'I-013',
    nickname: 'Farhan',
    full_name: 'Farhan Al-Ghifari',
    gender: 'male',
    candidate_type: 'mandiri',
    status: 'active',
    marital_status: 'single',
    date_of_birth: '1999-03-25',
    place_of_birth: 'Yogyakarta',
    education: 'S1',
    occupation: 'Senior Data Analyst',
    company_name: 'E-commerce Group',
    height: 178,
    weight: 70,
    blood_type: 'B',
    suku: 'Jawa',
    email: 'farhan.ghifari@email.com',
    whatsapp_number: '081555667788',
    full_address: 'Duren Sawit, Jakarta Timur',
    daerah_id: 1,
    daerah: { id: 1, name: 'DKI Jakarta' },
    desa_id: 103,
    desa: { id: 103, name: 'Jakarta Timur' },
    kelompok_id: 1006,
    kelompok: { id: 1006, name: 'Duren Sawit' },
    self_description: 'Senang matematika, coding, dan musik religi. Menghargai komunikasi terbuka.',
    bio: 'Tekun dalam karir, menjaga sholat berjamaah di masjid, dan siap menjadi imam keluarga.',
    sifat: 'Penyabar, Humoris, Religius',
    traits: ['Penyabar', 'Humoris', 'Religius'],
    hobbies: ['Gaming', 'Ngaji', 'Berenang'],
    favorite_foods: ['Gudeg', 'Soto Ayam'],
    partner_criteria: 'Sholihah, humoris, faham agama, siap tinggal di Jabodetabek.',
    social_media: [{ type: 'instagram', handle: '@farhan_ghifari' }],
    photos: [
      { id: 601, url: '/storage/register-hero.jpg', is_main: true },
    ],
  },
];

export const mockEvents: EventItem[] = [
  {
    id: 1,
    slug: 'temu-akrab-2025',
    nama_kegiatan: 'Temu Akrab & Taaruf Akbar Pemuda 2025',
    deskripsi: 'Pertemuan taaruf massal pemuda pemudi LDII dengan sistem bilik terjaga dan pendampingan Tim PNKB.',
    banner_url: '/storage/register-hero.jpg',
    type: 'internal',
    created_at: '2025-05-01',
    registration_status: 'open',
    candidates_count: 148,
    lokasi: 'Aula Pertemuan Serbaguna, Jakarta',
    dates: [
      {
        id: 1,
        date: '2025-06-15',
        start_time: '08:00',
        end_time: '16:00',
        sessions: [
          { id: 1, name: 'Sesi Pembukaan & Ice Breaking', start_time: '08:00', end_time: '10:00' },
          { id: 2, name: 'Sesi Bilik Taaruf 1-on-1', start_time: '10:15', end_time: '12:00' },
          { id: 3, name: 'Sesi Diskusi & Games Karakter', start_time: '13:00', end_time: '15:30' },
        ],
        location: {
          id: 1,
          name: 'Aula Serbaguna LDII',
          address: 'Jakarta Selatan',
        },
      },
    ],
  },
  {
    id: 2,
    slug: 'pashmina-banten-2025',
    nama_kegiatan: 'Pashmina Silaturrahim & Taaruf Banten',
    deskripsi: 'Kegiatan pengenalan dan taaruf terjaga untuk generasi muda wilayah Banten dan sekitarnya.',
    banner_url: '/storage/register-hero-bg.jpg',
    type: 'internal',
    created_at: '2025-05-10',
    registration_status: 'open',
    candidates_count: 86,
    lokasi: 'Gedung Pertemuan Cipondoh, Tangerang',
    dates: [
      {
        id: 2,
        date: '2025-07-20',
        start_time: '08:30',
        end_time: '15:30',
        sessions: [
          { id: 4, name: 'Sesi Taaruf & Pengenalan', start_time: '08:30', end_time: '11:30' },
          { id: 5, name: 'Sesi Bilik & Konsultasi Pendamping', start_time: '13:00', end_time: '15:00' },
        ],
        location: {
          id: 2,
          name: 'Gedung Pertemuan Cipondoh',
          address: 'Tangerang',
        },
      },
    ],
  },
];
