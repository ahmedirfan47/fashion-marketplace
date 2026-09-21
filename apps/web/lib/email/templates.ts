export function orderConfirmationEmail(orderId: string, total: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#17241a;">Order confirmed</h2>
      <p>Thank you for your order. We will contact you to confirm delivery.</p>
      <p><strong>Order reference:</strong> ${orderId.slice(0, 8)}</p>
      <p><strong>Total:</strong> ${total}</p>
    </div>
  `;
}

export function fulfillmentUpdateEmail(productTitle: string, status: string) {
  return `
    <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto;">
      <h2 style="color:#17241a;">Order update</h2>
      <p>Your item "<strong>${productTitle}</strong>" is now marked as <strong>${status}</strong>.</p>
    </div>
  `;
}