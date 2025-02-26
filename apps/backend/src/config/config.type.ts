export type AppConfig = {
  nodeEnv: string;
  webUrl?: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
  jwtKey: string;
  jwtExpirationTime: number;
};

export type AwsConfig = {
  bucketName: string;
  accessKeyId: string;
  secretAccessKey: string;
  bucketRegion: string;
  digitalOceanEndPoint: string;
};

export type DatabaseConfig = {
  url?: string;
  type?: string;
  host?: string;
  port?: number;
  password?: string;
  name?: string;
  username?: string;
  synchronize?: boolean;
  maxConnections: number;
  sslEnabled?: boolean;
  rejectUnauthorized?: boolean;
  ca?: string;
  key?: string;
  cert?: string;
};

export type EmailConfig = {
  serverName: string;
  userName: string;
  key: string;
  port: number;
  defaultEmail: string;
  secure: boolean;
  emailVerifyTokenExpirationTime: number;
  emailVerifyTokenIssuedTime: number;
};

export type StripeConfig = {
  stripeSecerectKey: string;
  stripeMode: string;
  stripePaymentMethod: string;
  stripeProductQuantity: string;
  stripeBillingInterval: string;
  stripeProductPrice: string;
  stripeProductPriceId: string;
  stripeProductName: string;
  stripeProductId: string;
  stripeProductPriceCurrency: string;
  stripeEndPointSecret: string;
  stripeTrialPeriodDays: string;
  stripePriceId: string;
  stripeApiVersion: string;
};

export type PdfConfig = {
  fontSize1: number;
  fontSize2: number;
  fontSize3: number;
  fillColor1: string;
  fillColor2: string;
  fillColor3: string;
  fillColor4: string;
  titleHeight: number;
  lineWidth: number;
  titleLeftMargin: number;
  titleStart: number;
  invoiceStart: number;
  invoiceHeight: number;
  billingAddressHeight: number;
  billingAddressStart: number;
  purchaseDetailsLeftMargin: number;
  headingsHeight: number;
  headingsStart: number;
  quantityLeftMargin: number;
  quantityWdith: number;
  descriptionWidth: number;
  detailsHeight: number;
  detailsStart: number;
  taxHeight: number;
  taxStart: number;
  totalHeight: number;
  totalStart: number;
  policyHeight: number;
  policyStart: number;
  endStart: number;
  endLeftMargin: number;
  policyLine1: string;
  policyLine2: string;
  policyLine3: string;
  policyLine4: string;
  policyLine5: string;
  policyLine6: string;
  textHeight: number;
  policyLine1Start: number;
  policyLine2Start: number;
  policyLine3Start: number;
  policyLine4Start: number;
  policyLine5Start: number;
  policyLine6Start: number;
};

export type AllConfigType = {
  app: AppConfig;
  database: DatabaseConfig;
  email: EmailConfig;
  aws: AwsConfig;
  stripe: StripeConfig;
  pdf: PdfConfig;
};
