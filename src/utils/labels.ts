import { Product } from '../types/domain';

export const buildLabelHtml = (products: Product[]) => {
  const cards = products
    .map(
      (p) => `
      <div class="label">
        <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
          p.id,
        )}" />
        <div class="name">${p.name}</div>
        <div class="sku">${p.sku}</div>
      </div>
    `,
    )
    .join('');

  return `
  <html>
    <style>
      body { font-family: Arial, sans-serif; }
      .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; }
      .label { border: 1px solid #ddd; padding: 8px; text-align: center; }
      .name { font-size: 12px; font-weight: bold; }
      .sku { font-size: 10px; }
      img { width: 80px; height: 80px; }
    </style>
    <body>
      <div class="grid">${cards}</div>
    </body>
  </html>`;
};
