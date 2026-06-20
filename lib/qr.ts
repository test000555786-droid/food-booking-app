import QRCode from "qrcode";

/**
 * Generate QR code data URL for a table
 */
export async function generateQRCodeDataUrl(tableId: string): Promise<string> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${appUrl}/menu/${tableId}`;
  
  return QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#1A1A18",
      light: "#FFFFFF",
    },
  });
}

/**
 * Generate QR code buffer (for API responses)
 */
export async function generateQRCodeBuffer(tableId: string): Promise<Buffer> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  const url = `${appUrl}/menu/${tableId}`;
  
  return QRCode.toBuffer(url, {
    width: 400,
    margin: 2,
    color: {
      dark: "#1A1A18",
      light: "#FFFFFF",
    },
  });
}

/**
 * Get the menu URL for a table (used for embedding in QR)
 */
export function getTableMenuUrl(tableId: string): string {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/menu/${tableId}`;
}
