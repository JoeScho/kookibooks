export async function createGelatoOrder(params: {
  orderId: string;
  pdfUrl: string;
  recipient: {
    name: string;
    addressLine1: string;
    city: string;
    postCode: string;
    country: string;
  };
}) {
  const payload = {
    orderType: "order",
    orderReferenceId: params.orderId,
    customerReferenceId: params.orderId,
    currency: "GBP",
    items: [
      {
        itemReferenceId: `item_${params.orderId}`,
        productUid:
          "books_pf_pb_s_200x200-pt_170-cc_44_cov_soft-pt_250-cm_gloss", // Gelato softcover 8x8 square book
        files: [{ type: "default", url: params.pdfUrl }],
        quantity: 1,
      },
    ],
    shippingAddress: {
      firstName: params.recipient.name.split(" ")[0] || "Customer",
      lastName:
        params.recipient.name.split(" ").slice(1).join(" ") || "Customer",
      addressLine1: params.recipient.addressLine1,
      city: params.recipient.city,
      postCode: params.recipient.postCode,
      country: params.recipient.country,
    },
  };

  const response = await fetch("https://order.gelatoapis.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-API-KEY": process.env.GELATO_API_KEY!,
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`Gelato Error: ${await response.text()}`);
  }

  return response.json();
}
