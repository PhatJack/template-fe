# 🚀 Hướng Dẫn Chạy Frontend

## Tài khoản mẫu
```bash
email: user1@gmail.com
password: 12345678
```
## 🛠️ Yêu Cầu Hệ Thống

Trước khi chạy dự án, hãy đảm bảo bạn đã cài đặt:

### 1. **Node.js** (phiên bản 22 hoặc cao hơn)

- Tải từ: https://nodejs.org/

### 2. Chọn Package Manager

Bạn có thể sử dụng một trong ba package manager sau:

#### **pnpm** (phiên bản 10+) - KHUYẾN NGHỊ

```bash
npm install -g pnpm
pnpm --version
```

#### **npm** (phiên bản 9+) - Mặc định với Node.js

```bash
npm --version
```

#### **yarn** (phiên bản 3+)

```bash
npm install -g yarn
yarn --version
```

### Kiểm Tra Cài Đặt

```bash
node --version
pnpm --version  # hoặc: npm --version, yarn --version
```

---

## 📦 Bước 1: Cài Đặt Thư Viện

Chạy từ thư mục `template-fe`:

**Với pnpm (khuyến nghị):**

```bash
cd template-fe
`pnpm | npm | yarn` install
```

**Với npm:**

```bash
cd template-fe
npm install
```

**Với yarn:**

```bash
cd template-fe
yarn install
```

---

## 🚀 Bước 2: Chạy Development Server

**Với pnpm:**

```bash
pnpm run dev
```

**Với npm:**

```bash
npm run dev
```

**Với yarn:**

```bash
yarn dev
```

Xong! 🎉 Ứng dụng sẽ chạy tại **http://localhost:5173**
