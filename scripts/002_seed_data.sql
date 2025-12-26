-- Insert sample admin user (password: admin123)
-- Note: In production, use proper password hashing with bcrypt
INSERT INTO users (id, email, password_hash, full_name, role) VALUES
  ('a0000000-0000-0000-0000-000000000001', 'admin@eventoria.com', '$2a$10$rN8qXgZQXg2xGZPLPkGSIeK9kVJh9zDxGZhq.LFxJO6K8VBqxLZcy', 'Admin Eventoria', 'admin');

-- Insert sample seminars
INSERT INTO seminars (id, title, description, category, speaker, event_date, location, price, max_participants, image_url, created_by) VALUES
  (
    'b0000000-0000-0000-0000-000000000001',
    'Digital Marketing Mastery 2025',
    'Pelajari strategi digital marketing terkini untuk mengembangkan bisnis Anda di era digital. Workshop interaktif dengan studi kasus nyata.',
    'umum',
    'Dr. Sarah Johnson',
    '2025-02-15 09:00:00+07',
    'Jakarta Convention Center',
    150000,
    200,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000002',
    'Kesehatan Mental di Tempat Kerja',
    'Seminar tentang pentingnya menjaga kesehatan mental di lingkungan kerja. Bersama psikolog klinis berpengalaman.',
    'kesehatan',
    'Prof. Dr. Michael Chen',
    '2025-02-20 14:00:00+07',
    'Gedung Serbaguna Universitas Indonesia',
    100000,
    150,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000003',
    'Info Session: Program Beasiswa S2 Luar Negeri',
    'Informasi lengkap tentang program beasiswa S2 ke luar negeri, tips aplikasi, dan testimoni penerima beasiswa.',
    'promosi_sekolah_kampus',
    'Tim Admission Office',
    '2025-02-18 13:00:00+07',
    'Auditorium ITB Bandung',
    50000,
    300,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000004',
    'Artificial Intelligence untuk Pemula',
    'Workshop pengenalan AI dan machine learning. Cocok untuk pemula yang ingin memulai karir di bidang AI.',
    'umum',
    'Dr. Kevin Wijaya',
    '2025-03-01 10:00:00+07',
    'Cyber Building Jakarta',
    200000,
    100,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000005',
    'Nutrisi dan Diet Sehat',
    'Panduan lengkap nutrisi seimbang dan diet sehat oleh ahli gizi profesional.',
    'kesehatan',
    'Dr. Lisa Putri, M.Gizi',
    '2025-02-25 15:00:00+07',
    'RS Siloam Semanggi Jakarta',
    120000,
    80,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  ),
  (
    'b0000000-0000-0000-0000-000000000006',
    'Open House Universitas Multimedia Nusantara',
    'Kenali program studi, fasilitas, dan keunggulan UMN. Gratis konsultasi jurusan!',
    'promosi_sekolah_kampus',
    'Tim Marketing UMN',
    '2025-02-22 09:00:00+07',
    'Kampus UMN Tangerang',
    0,
    500,
    '/placeholder.svg?height=400&width=600',
    'a0000000-0000-0000-0000-000000000001'
  );
