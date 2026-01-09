# MemoryPro - メモリモジュール専門ECサイト

産業用・組込み用メモリモジュールの検索・見積・相談・購入ができるECサイトのPoCです。

## 技術スタック

- **フレームワーク**: Next.js 14 (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + shadcn/ui
- **データベース**: MongoDB (Mongoose)
- **決済**: Stripe Checkout
- **バリデーション**: Zod

## 機能

- スペック検索・フィルタリング（URLクエリ対応でシェア可能）
- 製品詳細表示
- 見積依頼フォーム
- お問い合わせフォーム
- 小口購入（Stripe Checkout）
- 管理者向けリード一覧

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.example`をコピーして`.env.local`を作成し、各値を設定してください。

```bash
cp .env.example .env.local
```

設定が必要な環境変数：

| 変数名 | 説明 |
|--------|------|
| `MONGODB_URI` | MongoDBの接続URI |
| `STRIPE_SECRET_KEY` | StripeのシークレットキーKEY |
| `NEXT_PUBLIC_SITE_URL` | サイトのURL（Stripeリダイレクト用） |
| `ADMIN_TOKEN` | 管理画面アクセス用トークン |

### 3. MongoDB起動

ローカルの場合：

```bash
mongod
```

またはDocker：

```bash
docker run -d -p 27017:27017 --name mongodb mongo:7
```

### 4. シードデータの投入

```bash
npm run seed
```

40件のサンプル製品データが投入されます。

### 5. 開発サーバー起動

```bash
npm run dev
```

http://localhost:3000 でアクセスできます。

## ページ構成

| パス | 説明 |
|------|------|
| `/` | トップページ |
| `/products` | 製品一覧（フィルタ付き） |
| `/products/[slug]` | 製品詳細 |
| `/quote` | 見積依頼フォーム |
| `/contact` | お問い合わせフォーム |
| `/thanks` | 送信完了ページ |
| `/admin/leads?token=xxx` | リード一覧（管理者用） |

## フィルタパラメータ

製品一覧ページではURLクエリパラメータでフィルタ条件を指定できます。

| パラメータ | 説明 | 例 |
|------------|------|-----|
| `mfr` | メーカー（CSV） | `mfr=Century%20Micro,Micron` |
| `status` | ステータス（CSV） | `status=アクティブ` |
| `type` | メモリタイプ（CSV） | `type=DDR5,DDR4` |
| `form` | フォームファクタ（CSV） | `form=UDIMM,SODIMM` |
| `cap` | 容量（CSV） | `cap=16,32` |
| `ecc` | ECC対応 | `ecc=true` |
| `speedMin` | 最低速度 | `speedMin=4800` |
| `speedMax` | 最高速度 | `speedMax=6400` |
| `inStock` | 在庫あり | `inStock=true` |
| `sort` | 並び替え | `sort=stock-desc` |
| `page` | ページ番号 | `page=2` |

## API

| エンドポイント | メソッド | 説明 |
|---------------|----------|------|
| `/api/leads` | POST | リード（見積/相談）作成 |
| `/api/stripe/checkout` | POST | Stripe Checkoutセッション作成 |

## 今後の拡張予定（v2以降）

- B2Bログイン機能
- 在庫引当・配送計算
- 注文履歴
- メール通知
- 管理画面の拡充

## ライセンス

MIT
