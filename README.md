# 🚌 SCHOOL BUS AI

### Hệ thống AI điểm danh thông minh và cảnh báo bỏ quên trẻ em trên xe buýt trường học

**AI-Powered Smart Attendance and Child Left-Behind Alert System on School Buses**

<p align="center">
  <img src="https://img.shields.io/badge/Project-Capstone%20Project-2563EB?style=for-the-badge" alt="Capstone Project"/>
  <img src="https://img.shields.io/badge/Flutter-Dart-02569B?style=for-the-badge&logo=flutter&logoColor=white" alt="Flutter"/>
  <img src="https://img.shields.io/badge/React-TypeScript-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Supabase-Backend-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" alt="Supabase"/>
  <img src="https://img.shields.io/badge/AI-MobileFaceNet-8A2BE2?style=for-the-badge" alt="AI"/>
</p>

<p align="center">
  <strong>Đồ án học phần: Phát triển ứng dụng di động đa nền tảng</strong><br/>
  Nhóm Healing · Học kỳ 1 – Năm học 2026–2027
</p>

---

## 📌 1. Giới thiệu dự án

**School Bus AI** là hệ thống hỗ trợ quản lý hoạt động đưa đón học sinh bằng xe buýt trường học, tích hợp công nghệ trí tuệ nhân tạo (AI) và nhận diện khuôn mặt nhằm hỗ trợ điểm danh, theo dõi và đối soát trạng thái học sinh trong mỗi chuyến đi.

Hệ thống được xây dựng nhằm số hóa quy trình quản lý xe đưa đón học sinh, giúp nhà trường quản lý tập trung thông tin học sinh, nhân sự, phương tiện, tuyến đường và lịch trình đưa đón.

Thông qua ứng dụng di động, giáo viên có thể thực hiện điểm danh và quản lý chuyến xe, trong khi phụ huynh có thể theo dõi trạng thái đưa đón của con, nhận thông báo và quản lý các thông tin liên quan.

Một trong những chức năng trọng tâm của School Bus AI là hỗ trợ phát hiện trường hợp học sinh đã được ghi nhận lên xe nhưng chưa có xác nhận xuống xe khi kết thúc chuyến. Hệ thống sẽ tạo cảnh báo để giáo viên kiểm tra và xử lý kịp thời, góp phần tăng cường an toàn cho học sinh.

### 🎯 Mục tiêu dự án

- Số hóa quy trình quản lý hoạt động đưa đón học sinh bằng xe buýt.
- Hỗ trợ điểm danh học sinh bằng công nghệ nhận diện khuôn mặt AI.
- Theo dõi trạng thái học sinh trong suốt quá trình di chuyển.
- Đối soát danh sách học sinh lên xe và xuống xe.
- Phát hiện và cảnh báo trường hợp học sinh chưa được xác nhận xuống xe.
- Gửi thông báo để phụ huynh cập nhật tình trạng chuyến đi.
- Hỗ trợ quản lý học sinh, nhân sự, phương tiện và tuyến đường tập trung.
- Tăng cường tính an toàn, minh bạch và hiệu quả trong hoạt động đưa đón học sinh.

---

## ✨ 2. Tính năng chính

| Nhóm chức năng | Mô tả |
|---|---|
| 🔐 Xác thực | Đăng nhập, đăng ký, đăng xuất và điều hướng theo vai trò người dùng thông qua Supabase Auth. |
| 🚌 Quản lý chuyến xe | Theo dõi lịch trình, bắt đầu và kết thúc chuyến đưa đón học sinh. |
| 📸 Điểm danh AI | Hỗ trợ nhận diện khuôn mặt bằng MobileFaceNet để xác định học sinh. |
| 📱 Điểm danh QR | Quét mã QR để hỗ trợ xác nhận trạng thái học sinh. |
| ✍️ Điểm danh thủ công | Giáo viên có thể chủ động cập nhật trạng thái học sinh. |
| 🚨 Cảnh báo an toàn | Phát hiện học sinh đã lên xe nhưng chưa được xác nhận xuống xe khi kết thúc chuyến. |
| 🔔 Thông báo | Gửi thông báo đến phụ huynh theo học sinh đã được liên kết và xác minh. |
| 📍 Theo dõi phương tiện | Hỗ trợ theo dõi vị trí xe và trạng thái chuyến đi. |
| 👨‍👩‍👧 Quản lý phụ huynh | Theo dõi trạng thái con, xem lịch sử đưa đón và quản lý thông tin liên quan. |
| 📝 Đơn xin nghỉ | Phụ huynh gửi đơn xin nghỉ theo ngày và buổi; quản trị viên xét duyệt hoặc từ chối. |
| 📡 Hoạt động ngoại tuyến | Lưu dữ liệu cục bộ bằng SQLite/Drift, sử dụng hàng đợi đồng bộ và tự đồng bộ khi có kết nối mạng. |
| 🖥️ Quản trị website | Quản lý tổng quan, đội xe, học sinh, nhân sự, tuyến đường, điểm danh, đơn xin nghỉ và cảnh báo. |
| 🛡️ Bảo mật dữ liệu | Sử dụng Row-Level Security (RLS) để phân quyền truy cập dữ liệu trên 17 bảng PostgreSQL. |

### 🚨 Cơ chế cảnh báo học sinh chưa xuống xe

Hệ thống định hướng triển khai cơ chế cảnh báo theo 3 cấp:

1. **Cấp 1 – Cảnh báo tại chỗ:** Phát âm thanh cảnh báo và rung thiết bị để giáo viên chú ý kiểm tra.
2. **Cấp 2 – Cảnh báo mở rộng:** Sau 60 giây nếu tình trạng chưa được xử lý, hệ thống gửi thông báo đến quản trị viên và phụ huynh liên quan.
3. **Cấp 3 – Hỗ trợ xử lý khẩn cấp:** Hiển thị gợi ý liên hệ số điện thoại khẩn cấp để người phụ trách chủ động xử lý.

---

## 👥 3. Vai trò người dùng

Hệ thống được phân chia thành các nhóm vai trò với chức năng tương ứng trên từng nền tảng.

| Vai trò | Nền tảng | Quyền và chức năng |
|---|---|---|
| ADMIN | Website | Quản lý dữ liệu, tài khoản, học sinh, nhân sự, phương tiện, tuyến đường, chuyến xe và báo cáo. |
| SCHOOL_MANAGER | Website | Hỗ trợ quản lý và giám sát hoạt động đưa đón học sinh của nhà trường. |
| TEACHER | Mobile App | Quản lý chuyến xe, điểm danh học sinh lên/xuống xe, theo dõi danh sách và xử lý cảnh báo. |
| PARENT | Mobile App | Theo dõi trạng thái của con, nhận thông báo, xem lịch sử đưa đón và gửi đơn xin nghỉ. |

---

## 🛠️ 4. Công nghệ sử dụng

### 4.1. Mobile Application

| Thành phần | Công nghệ |
|---|---|
| Framework | Flutter |
| Ngôn ngữ | Dart |
| State Management | Riverpod |
| UI Framework | Material Design 3 |
| Architecture | Clean Architecture + Feature-First |
| Authentication | Supabase Auth |
| Local Database | SQLite / Drift |
| QR Scanner | Google ML Kit |
| Face Detection | Google ML Kit |
| Face Recognition | MobileFaceNet |
| Face Matching | Cosine Similarity |
| AI Model Runtime | TensorFlow Lite (đang kiểm tra khả năng chuyển đổi và tương thích) |

### 4.2. Admin Website

| Thành phần | Công nghệ |
|---|---|
| Frontend Framework | React |
| Programming Language | TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS |
| UI Components | Shadcn-style UI |
| Routing | React Router |
| Icons | Lucide React |
| Backend Integration | Supabase Client |

### 4.3. Backend & Infrastructure

| Thành phần | Công nghệ |
|---|---|
| Backend Platform | Supabase |
| Database | PostgreSQL |
| Authentication | Supabase Auth |
| Realtime | Supabase Realtime |
| File Storage | Supabase Storage |
| Database Security | Row-Level Security (RLS) |
| Version Control | Git |
| Source Code Hosting | GitHub |
| UI/UX Design | Figma |

---

## 🏗️ 5. Kiến trúc hệ thống

School Bus AI được xây dựng theo mô hình gồm ba thành phần chính:

- **Mobile Application:** Ứng dụng Flutter dành cho giáo viên và phụ huynh.
- **Admin Website:** Website React + TypeScript dành cho quản trị viên và quản lý nhà trường.
- **Backend:** Supabase cung cấp dịch vụ xác thực, cơ sở dữ liệu, lưu trữ và đồng bộ dữ liệu.

Hai ứng dụng khách sử dụng Supabase Client với khóa anon và JWT của người dùng đã xác thực. Các chính sách Row-Level Security (RLS) được áp dụng tại PostgreSQL nhằm kiểm soát quyền truy cập dữ liệu theo vai trò.

### 5.1. Kiến trúc Mobile Application

Ứng dụng di động sử dụng **Clean Architecture kết hợp Feature-First**, phân chia thành ba tầng:

```text
Presentation  →  Domain  ←  Data
```

- **Presentation:** Quản lý giao diện, trạng thái và tương tác người dùng.
- **Domain:** Chứa nghiệp vụ, entities và use cases; không phụ thuộc Flutter hoặc Supabase.
- **Data:** Quản lý repository implementation, data sources và kết nối backend/local database.

### 5.2. Cấu trúc thư mục Mobile Application

```text
lib/
├── core/
│   ├── constants/          # App constants, role constants
│   ├── errors/             # Failures, exceptions
│   ├── network/            # Network information
│   ├── theme/              # App theme, colors, text styles
│   ├── widgets/            # Shared widgets
│   ├── database/           # Local database, offline cache
│   └── routing/            # App router, role router
│
├── features/
│   ├── authentication/     # Authentication
│   │   ├── domain/
│   │   ├── data/
│   │   └── presentation/
│   │
│   ├── home/               # Teacher shell, parent shell
│   ├── trips/              # Quản lý chuyến xe
│   ├── attendance/         # Điểm danh học sinh
│   ├── alerts/             # Cảnh báo an toàn
│   ├── students/           # Quản lý học sinh
│   ├── profile/            # Hồ sơ người dùng
│   ├── face_recognition/   # Nhận diện khuôn mặt
│   ├── person_detection/   # Cấu trúc dự trù cho Object Detection
│   └── notifications/      # Thông báo
│
├── app.dart
└── main.dart
```

### 5.3. Cấu trúc thư mục Admin Website

```text
admin-web/
├── src/
│   ├── core/
│   │   ├── supabase/       # Supabase client
│   │   ├── routing/        # Routing và protected routes
│   │   ├── theme/          # Theme và styles
│   │   ├── constants/      # Constants
│   │   └── navigation/     # Sidebar, navigation
│   │
│   ├── features/
│   │   ├── auth/           # Đăng nhập, phân quyền
│   │   ├── overview/       # Tổng quan
│   │   ├── fleet/          # Giám sát đội xe
│   │   ├── students/       # Học sinh, phụ huynh, khuôn mặt
│   │   ├── staff/          # Tài xế và bảo mẫu
│   │   ├── routes/         # Xe, tuyến đường, điểm dừng
│   │   ├── trips/          # Quản lý chuyến xe
│   │   ├── attendance/     # Quản lý điểm danh
│   │   ├── absences/       # Đơn xin nghỉ
│   │   ├── alerts/         # Xử lý cảnh báo
│   │   └── reports/        # Báo cáo thống kê
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

Các feature trong website được tổ chức theo các nhóm `components/`, `hooks/`, `services/` và `types/` tùy theo nhu cầu triển khai.

---

## 🗄️ 6. Cơ sở dữ liệu

Hệ thống sử dụng **PostgreSQL trên Supabase**, gồm 17 bảng chính phục vụ quản lý hoạt động đưa đón học sinh.

### 6.1. Danh sách bảng

| STT | Tên bảng | Chức năng |
|---:|---|---|
| 1 | users | Thông tin tài khoản người dùng và vai trò |
| 2 | students | Thông tin học sinh |
| 3 | buses | Thông tin phương tiện |
| 4 | routes | Tuyến đường đưa đón |
| 5 | parents | Thông tin phụ huynh |
| 6 | teachers | Thông tin giáo viên |
| 7 | drivers | Thông tin tài xế |
| 8 | student_parents | Liên kết học sinh và phụ huynh |
| 9 | route_stops | Các điểm dừng trên tuyến |
| 10 | student_routes | Liên kết học sinh và tuyến đường |
| 11 | trips | Thông tin chuyến xe |
| 12 | face_embeddings | Vector đặc trưng khuôn mặt |
| 13 | attendance | Dữ liệu điểm danh |
| 14 | absences | Đơn xin nghỉ |
| 15 | alerts | Cảnh báo an toàn |
| 16 | gps_locations | Dữ liệu vị trí phương tiện |
| 17 | notifications | Thông báo đến người dùng |

### 6.2. Các quy tắc dữ liệu quan trọng

- Bảng `attendance` sử dụng ràng buộc `UNIQUE (trip_id, student_id)` nhằm tránh tạo bản ghi điểm danh trùng lặp khi đồng bộ dữ liệu.
- Điểm danh bằng AI yêu cầu lưu thông tin `ai_confidence` để thể hiện độ tin cậy của kết quả nhận diện.
- Trạng thái `ALIGHTED` yêu cầu có `check_out_time` để xác nhận thời điểm học sinh xuống xe.
- Bảng `face_embeddings` lưu vector đặc trưng khuôn mặt thay vì lưu ảnh khuôn mặt gốc.
- Chỉ lưu và sử dụng dữ liệu khuôn mặt khi phụ huynh đã cấp quyền đồng ý (`GRANTED`).
- Hệ thống có 20 chỉ mục hỗ trợ truy vấn và trigger `set_updated_at` để tự động cập nhật trường `updated_at`.
- Các chính sách RLS kiểm soát quyền truy cập dữ liệu theo vai trò người dùng.

---

## 🚀 7. Cài đặt và chạy dự án

### 7.1. Yêu cầu môi trường

Trước khi chạy dự án, cần chuẩn bị:

| Công cụ | Yêu cầu |
|---|---|
| Flutter SDK | Stable Channel |
| Dart SDK | Phiên bản tương thích với Flutter |
| Android Studio | Cài đặt Android SDK và Emulator |
| Visual Studio Code | Khuyến nghị để phát triển |
| Node.js | Phiên bản LTS |
| npm | Đi kèm Node.js |
| Git | Quản lý mã nguồn |
| Supabase Account | Tài khoản và dự án Supabase |
| Figma | Xem và tham khảo thiết kế giao diện |

### 7.2. Clone repository

```bash
git clone https://github.com/nguyenlinchi/dacn2_schoolbus_ai.git

cd dacn2_schoolbus_ai
```

### 7.3. Thiết lập Supabase

**Bước 1: Tạo dự án Supabase**

Truy cập:

https://supabase.com/

Tạo một dự án mới và lưu lại thông tin kết nối.

**Bước 2: Khởi tạo cơ sở dữ liệu**

- Mở mục SQL Editor trong Supabase Dashboard.
- Chạy script SQL tạo 17 bảng dữ liệu.
- Khởi tạo các khóa ngoại, ràng buộc, chỉ mục và trigger.
- Kiểm tra lại cấu trúc cơ sở dữ liệu sau khi thực thi.

**Bước 3: Tạo tài khoản kiểm thử**

- Truy cập Authentication → Users.
- Tạo tài khoản giáo viên để kiểm thử đăng nhập.
- Mở script dữ liệu mẫu (seed).
- Thay đổi biến `v_teacher_email` thành email tài khoản vừa tạo.
- Chạy script seed để khởi tạo dữ liệu thử nghiệm.

Dữ liệu mẫu bao gồm:

- 1 giáo viên.
- 1 tài xế demo.
- 1 xe buýt.
- 2 tuyến đường: Tuyến 05 và Tuyến 03.
- 32 học sinh.
- 3 chuyến xe trong ngày:
  - 1 chuyến đang chạy với 28/32 học sinh đã được điểm danh.
  - 2 chuyến sắp tới.

Script seed được thiết kế để có thể chạy lại nhiều lần mà không tạo dữ liệu trùng lặp ngoài ý muốn.

**Bước 4: Lấy thông tin kết nối**

Vào:

`Supabase Dashboard → Project Settings → API`

Lấy các thông tin:

- Project URL
- Anon / Publishable Key tương ứng với cấu hình dự án

> ⚠️ **Lưu ý bảo mật:** Chỉ sử dụng khóa anon/publishable key trong ứng dụng khách. Tuyệt đối không đưa `service_role` key vào mã nguồn hoặc commit lên GitHub.

### 7.4. Chạy ứng dụng di động Flutter

Mở terminal tại thư mục gốc dự án:

```bash
flutter pub get
```

Cấu hình Project URL và Anon Key theo phương thức mà nhóm đang sử dụng trong `main.dart`, chẳng hạn hằng số, `--dart-define` hoặc tệp môi trường.

Sau đó chạy ứng dụng:

```bash
flutter run
```

Nếu muốn chạy trên Android Emulator:

```bash
flutter devices
```

Chọn thiết bị Android đang hoạt động và chạy:

```bash
flutter run -d emulator-5554
```

### 7.5. Chạy Admin Website

Di chuyển vào thư mục website:

```bash
cd admin-web
```

Cài đặt dependencies:

```bash
npm install
```

Tạo file `.env.local` trong thư mục `admin-web`:

```env
VITE_SUPABASE_URL=https://<your-project>.supabase.co
VITE_SUPABASE_ANON_KEY=<your-anon-key>
```

Thay các giá trị mẫu bằng thông tin dự án Supabase thực tế.

Khởi chạy website:

```bash
npm run dev
```

Mở địa chỉ Vite hiển thị trong terminal, thông thường:

```text
http://localhost:5173
```

---

## 🧪 8. Kiểm thử

Dự án sử dụng Flutter Test để kiểm thử các thành phần và chức năng của ứng dụng di động.

Chạy toàn bộ test:

```bash
flutter test
```

Chạy kiểm thử và tạo báo cáo coverage:

```bash
flutter test --coverage
```

File báo cáo độ bao phủ mã nguồn:

```text
coverage/lcov.info
```

Các nhóm chức năng cần được kiểm thử:

- Đăng nhập và xác thực người dùng.
- Phân quyền theo vai trò.
- Điều hướng giữa các màn hình.
- Điểm danh thủ công, QR và nhận diện khuôn mặt.
- Trạng thái lên xe và xuống xe.
- Cơ chế phát hiện học sinh chưa xuống xe.
- Gửi và nhận thông báo.
- Đồng bộ dữ liệu khi có kết nối mạng.
- Kiểm soát quyền truy cập thông qua RLS.

---

## 📦 9. Đóng gói ứng dụng Android

Để tạo bản APK Release, chạy lệnh:

```bash
flutter build apk --release
```

Sau khi build thành công, file APK được tạo tại:

```text
build/app/outputs/flutter-apk/app-release.apk
```

Thông tin bản kiểm thử nội bộ:

| Thuộc tính | Giá trị |
|---|---|
| Phiên bản | v0.3.0-beta |
| Nền tảng | Android |
| Định dạng | APK |
| Phân phối | GitHub Releases |

---

## 📊 10. Trạng thái phát triển dự án

Bảng dưới đây thể hiện tiến độ triển khai các hạng mục của School Bus AI.

| Hạng mục | Trạng thái |
|---|---|
| Thiết kế cơ sở dữ liệu PostgreSQL gồm 17 bảng | ✅ Hoàn thành |
| Khởi tạo cấu trúc Clean Architecture cho Flutter | ✅ Hoàn thành |
| Đăng nhập và phân quyền theo vai trò | ✅ Hoàn thành |
| Giao diện ứng dụng giáo viên và phụ huynh | 🔄 Đang hoàn thiện |
| Điểm danh thủ công | 🔄 Đang tích hợp và kiểm thử |
| Điểm danh QR | 🔄 Đang tích hợp và kiểm thử |
| Nhận diện khuôn mặt MobileFaceNet | 🔄 Đang kiểm tra TensorFlow Lite |
| Cảnh báo học sinh chưa xuống xe | 🔄 Đang hoàn thiện |
| Cơ sở dữ liệu ngoại tuyến SQLite/Drift | 🔄 Đang thực hiện |
| Cơ chế đồng bộ dữ liệu khi có mạng | 🔄 Đang thực hiện |
| Website quản trị React + TypeScript | 🔄 Đang thực hiện |
| Object Detection phát hiện người trong khoang xe | 📌 Hướng phát triển, chưa triển khai |

> **Lưu ý:** Trạng thái dự án cần được cập nhật theo tiến độ thực tế của nhóm trước mỗi lần phát hành phiên bản mới.

---

## 🔐 11. Bảo mật và quyền riêng tư

School Bus AI chú trọng bảo vệ thông tin cá nhân và dữ liệu khuôn mặt của học sinh.

### 11.1. Bảo vệ dữ liệu khuôn mặt

- Chỉ sử dụng dữ liệu khuôn mặt khi phụ huynh đã đồng ý.
- Lưu vector đặc trưng khuôn mặt trong bảng `face_embeddings`.
- Không lưu ảnh khuôn mặt gốc trong bảng `face_embeddings`.
- Trạng thái đồng ý được quản lý thông qua `consent_status`.
- Phụ huynh có thể thu hồi quyền đồng ý sử dụng dữ liệu khuôn mặt.

### 11.2. Phân quyền truy cập dữ liệu

Hệ thống sử dụng **Row-Level Security (RLS)** trên PostgreSQL để giới hạn quyền truy cập dữ liệu.

| Vai trò | Phạm vi truy cập |
|---|---|
| ADMIN | Quản lý dữ liệu trong phạm vi quyền quản trị của nhà trường. |
| SCHOOL_MANAGER | Giám sát và quản lý hoạt động theo quyền được cấp. |
| TEACHER | Chỉ truy cập dữ liệu học sinh và chuyến xe được phân công. |
| PARENT | Chỉ xem thông tin của học sinh đã được liên kết và xác minh. |

Việc áp dụng RLS giúp tăng cường bảo mật ở cấp cơ sở dữ liệu, hạn chế truy cập trái phép từ các ứng dụng khách.

---

## 🔮 12. Hướng phát triển trong tương lai

Trong các giai đoạn tiếp theo, nhóm định hướng phát triển thêm các chức năng:

- Hoàn thiện triển khai MobileFaceNet bằng TensorFlow Lite trên thiết bị di động.
- Tối ưu tốc độ và độ chính xác của quá trình nhận diện khuôn mặt.
- Hoàn thiện cơ chế cảnh báo học sinh chưa xuống xe theo 3 cấp.
- Hoàn thiện khả năng hoạt động ngoại tuyến và đồng bộ dữ liệu.
- Tích hợp GPS Realtime để giám sát vị trí xe buýt.
- Phát triển Object Detection nhằm hỗ trợ phát hiện người còn trong khoang xe.
- Hoàn thiện hệ thống thống kê và báo cáo hoạt động đưa đón.
- Tối ưu giao diện và trải nghiệm người dùng trên cả Mobile App và Admin Website.
- Tăng cường kiểm thử bảo mật, hiệu năng và độ ổn định của hệ thống.

---

## 🔗 13. Liên kết dự án

| Tài nguyên | Liên kết |
|---|---|
| 🎨 Figma Design | [Xem thiết kế giao diện](https://www.figma.com/design/fI5DA1dBN1fmBGENQtieaQ/Linh-Chi?node-id=0-1&t=e4MSaiWU2YkQdzJn-1) |
| 🎬 Video Demo | [Xem video demo dự án](https://drive.google.com/drive/folders/16T4vzztgdpCD2UWp8gU5L0nSa298vrXf?usp=sharing) |
| 📱 APK | [Tải ứng dụng Android](https://drive.google.com/drive/folders/16T4vzztgdpCD2UWp8gU5L0nSa298vrXf?usp=sharing) |
| 💻 GitHub Repository | [dacn2_schoolbus_ai](https://github.com/nguyenlinchi/dacn2_schoolbus_ai) |

---

## 👨‍💻 14. Thành viên thực hiện

**Nhóm Healing**

| STT | Họ và tên | MSSV | Vai trò |
|---:|---|---|---|
| 1 | Nguyễn Thị Linh Chi | 23IT.B018 | Trưởng nhóm, phụ trách giao diện giáo viên |
| 2 | Lê Thị Mỹ Duyên | 23IT.B033 | Phụ trách giao diện phụ huynh |
| 3 | Trần Thu Phương | 23IT.B0172 | Phụ trách giao diện Admin |

**Học phần:** Phát triển ứng dụng di động đa nền tảng  
**Học kỳ:** 1 – Năm học 2026–2027

---

<p align="center">
  <strong>🚌 SCHOOL BUS AI</strong><br/>
  <em>Smarter Attendance – Safer School Transportation</em><br/>
  <sub>Developed by Healing Team ❤️</sub>
</p>
