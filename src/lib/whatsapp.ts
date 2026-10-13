/** Tautan wa.me statis dengan pesan yang sudah terisi. */
export function buildWhatsAppUrl(phone: string, message?: string): string {
  const url = new URL(`https://wa.me/${phone}`);
  if (message) url.searchParams.set("text", message);
  return url.toString();
}

export const whatsappMessage = {
  general: (brandName: string) => `Halo ${brandName}, saya ingin bertanya.`,
  product: (brandName: string, productName: string) =>
    `Halo ${brandName}, saya tertarik dengan ${productName}. Boleh minta informasi lebih lanjut?`,
};
