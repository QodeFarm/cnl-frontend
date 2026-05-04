import { FormGroup } from "@angular/forms";


// export function displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
//     const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
//     let data = '';

//     if (product) {
//       data = `
//         <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
//         <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span>`;
//     }

//     if (size) {
//       data = `
//         <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
//         <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
//         <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span>
//         `;
//     }

//     if (color) {
//       data = `
//         <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
//         <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
//         <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> |
//         <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span>
//         `;
//     }

//     data += ` | ${unitData}`;

//     cardWrapper.querySelector('.center-message')?.remove();
//     const productInfoDiv = document.createElement('div');
//     productInfoDiv.classList.add('center-message');
//     productInfoDiv.innerHTML = data;
//     cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
//   };

export function displayInformation(
  product: any,
  size: any,
  color: any,
  unitData: any,
  sizeBalance: any,
  colorBalance: any
) {
  const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
  if (!cardWrapper || !product) return;

  console.log('Product data in html:', product);
  console.log('unitData data in html:', unitData);

  // ✅ Always-safe unit info
  const stockInfo = `
    <span style="color:red;">Unit Option:</span>
    <span style="color:blue;">${product?.unit_options?.unit_name ?? 'NA'}</span> |
    <span style="color:red;">Pack Unit:</span>
    <span style="color:blue;">${product?.pack_unit?.unit_name ?? 'NA'}</span> |
    <span style="color:red;">PackVsStock:</span>
    <span style="color:blue;">${product?.pack_vs_stock ?? 'NA'}</span> |
    <span style="color:red;">GPack Unit:</span>
    <span style="color:blue;">${product?.g_pack_unit?.unit_name ?? 'NA'}</span> |
    <span style="color:red;">GPackVsPack:</span>
    <span style="color:blue;">${product?.g_pack_vs_pack ?? 'NA'}</span>
  `;

  let data = `
    <span style="font-size:12px;">
      <span style="color:red;">Product Info:</span>
      <span style="color:blue;">${product?.name ?? 'N/A'}</span> |
      <span style="color:red;">Balance:</span>
      <span style="color:blue;">${product?.balance ?? 0}</span> |
      ${stockInfo}
    </span>
  `;

  if (size && !color) {
    data = `
      <span style="font-size:12px;">
        <span style="color:red;">Product Info:</span>
        <span style="color:blue;">${product?.name ?? 'N/A'}</span> |
        <span style="color:red;">Balance:</span>
        <span style="color:blue;">${sizeBalance ?? 0}</span> |
        <span style="color:red;">Size:</span>
        <span style="color:blue;">${size?.size_name ?? 'NA'}</span> |
        ${stockInfo}
      </span>
    `;
  }

  if (color) {
    data = `
      <span style="font-size:12px;">
        <span style="color:red;">Product Info:</span>
        <span style="color:blue;">${product?.name ?? 'N/A'}</span> |
        <span style="color:red;">Balance:</span>
        <span style="color:blue;">${colorBalance ?? 0}</span> |
        <span style="color:red;">Size:</span>
        <span style="color:blue;">${size?.size_name ?? 'NA'}</span> |
        <span style="color:red;">Color:</span>
        <span style="color:blue;">${color?.color_name ?? 'NA'}</span> |
        ${stockInfo}
      </span>
    `;
  }

  cardWrapper.querySelector('.center-message')?.remove();
  const productInfoDiv = document.createElement('div');
  productInfoDiv.classList.add('center-message');
  productInfoDiv.innerHTML = data;
  cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
}


// displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
//     const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
//     let data = '';
//     console.log('Product data in html : ', product)
//     console.log('unitData data in html : ', unitData)

//     // format unitData fields in correct order
//     const stockInfo = `
//       <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${product?.stock_unit.stock_unit_name || 'NA'}</span> |
//       <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${product?.pack_unit_id || 'NA'}</span> |
//       <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${product?.pack_vs_stock || 'NA'}</span> |
//       <span style="color: red;">GPack Unit:</span> <span style="color: blue;">${product?.g_pack_unit_id || 'NA'}</span> |
//       <span style="color: red;">GPackVsPack:</span> <span style="color: blue;">${product?.g_pack_vs_pack || 'NA'}</span>
//     `;

//     if (product && !size && !color) {
//       data = `
//         <span style="font-size: 12px;">
//           <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
//           <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span> | 
//           ${stockInfo}
//         </span>`;
//     }

//     if (size && !color) {
//       data = `
//         <span style="font-size: 12px;">
//           <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
//           <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span> | 
//           <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> | 
//           ${stockInfo}
//         </span>`;
//     }

//     if (color) {
//       data = `
//         <span style="font-size: 12px;">
//           <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> | 
//           <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span> | 
//           <span style="color: red;">Size:</span> <span style="color: blue;">${size?.size_name || 'NA'}</span> | 
//           <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> | 
//           ${stockInfo}
//         </span>`;
//     }

//     cardWrapper.querySelector('.center-message')?.remove();
//     const productInfoDiv = document.createElement('div');
//     productInfoDiv.classList.add('center-message');
//     productInfoDiv.innerHTML = data;
//     cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
//   };


export function sumQuantities(dataObject: any): number {
    // First, check if the data object contains the array in the 'data' field
    if (dataObject && Array.isArray(dataObject.data)) {
      // Now we can safely use reduce on dataObject.data
      return dataObject.data.reduce((sum, item) => sum + (item.quantity || 0), 0);
    } else {
      console.error("Data is not an array:", dataObject);
      return 0;
    }
  };

export function getUnitData(unitInfo: any) {
  if (!unitInfo) return '';

  // Always resolve values first
  const stockUnit = unitInfo?.stock_unit?.stock_unit_name ?? 'NA';
  const packUnit = unitInfo?.pack_unit?.unit_name ?? 'NA';
  const gPackUnit = unitInfo?.g_pack_unit?.unit_name ?? 'NA';

  const packVsStock =
    unitInfo?.pack_vs_stock === null || unitInfo?.pack_vs_stock === undefined
      ? 'NA'
      : unitInfo.pack_vs_stock;

  const gPackVsPack =
    unitInfo?.g_pack_vs_pack === null || unitInfo?.g_pack_vs_pack === undefined
      ? 'NA'
      : unitInfo.g_pack_vs_pack;

  const unitOption = unitInfo?.unit_options?.unit_name;

  // 🔥 CASE 1: unit_options is NULL → ALWAYS show fallback block
  if (!unitOption) {
    return `
      <span style="color:red;">Stock Unit:</span>
      <span style="color:blue;">${stockUnit}</span> |
      <span style="color:red;">Pack Unit:</span>
      <span style="color:blue;">${packUnit}</span> |
      <span style="color:red;">PackVsStock:</span>
      <span style="color:blue;">${packVsStock}</span> |
      <span style="color:red;">GPack Unit:</span>
      <span style="color:blue;">${gPackUnit}</span> |
      <span style="color:red;">GPackVsPack:</span>
      <span style="color:blue;">${gPackVsPack}</span>
    `;
  }

  // Regex cases (only affect WHICH fields are shown, not IF)
  const stockUnitReg = /\bstock[_ ]?unit\b/i;
  const gPackReg = /\bgpack[_ ]?unit\b/i;
  const stockPackReg = /\bstock[_ ]?pack[_ ]?unit\b/i;

  if (stockUnitReg.test(unitOption)) {
    return `
      <span style="color:red;">Stock Unit:</span>
      <span style="color:blue;">${stockUnit}</span>
    `;
  }

  if (gPackReg.test(unitOption)) {
    return `
      <span style="color:red;">Stock Unit:</span> <span style="color:blue;">${stockUnit}</span> |
      <span style="color:red;">Pack Unit:</span> <span style="color:blue;">${packUnit}</span> |
      <span style="color:red;">PackVsStock:</span> <span style="color:blue;">${packVsStock}</span> |
      <span style="color:red;">GPack Unit:</span> <span style="color:blue;">${gPackUnit}</span> |
      <span style="color:red;">GPackVsPack:</span> <span style="color:blue;">${gPackVsPack}</span>
    `;
  }

  if (stockPackReg.test(unitOption)) {
    return `
      <span style="color:red;">Stock Unit:</span> <span style="color:blue;">${stockUnit}</span> |
      <span style="color:red;">Pack Unit:</span> <span style="color:blue;">${packUnit}</span> |
      <span style="color:red;">PackVsStock:</span> <span style="color:blue;">${packVsStock}</span>
    `;
  }

  return '';
}

// getUnitData(unitInfo) {
//   console.log("unitinfo : ", unitInfo);

//   const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
//   const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';

//   //  Only null/undefined → NA, keep 0 or string
//   const packUnit = unitInfo.pack_unit?.stock_unit_name ?? (unitInfo.pack_unit_id == null ? 'NA' : unitInfo.pack_unit_id);
//   const gPackUnit = unitInfo.g_pack_unit?.stock_unit_name ?? (unitInfo.g_pack_unit_id == null ? 'NA' : unitInfo.g_pack_unit_id);

//   const packVsStock = unitInfo.pack_vs_stock == null ? 'NA' : unitInfo.pack_vs_stock;
//   const gPackVsPack = unitInfo.g_pack_vs_pack == null ? 'NA' : unitInfo.g_pack_vs_pack;

//   const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
//   const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
//   const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;

//   if (stockUnitReg.test(unitOption)) {
//     return `<span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> | &nbsp;`;
//   } else if (GpackReg.test(unitOption)) {
//     return `
//       <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
//       <span style="color: red;">Pck Unit:</span> <span style="color: blue;">${packUnit}</span> |
//       <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> |
//       <span style="color: red;">GPackUnit:</span> <span style="color: blue;">${gPackUnit}</span> |
//       <span style="color: red;">GPackVsPack:</span> <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`;
//   } else if (stockPackReg.test(unitOption)) {
//     return `
//       <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
//       <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${packUnit}</span> |
//       <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> | &nbsp;`;
//   } else {
//     console.log('No Unit Option match found');
//     return "";
//   }
// }

  //===========================================================

  // export function calculateTotalAmount(data: any, modelName: string, form: any) {
  //   if (!data) return;
  //   // console.log("data in edit mode : ", data);
  
  //   // Determine the parent model dynamically
  //   let parentModel = modelName.replace('_items', '');
  
  //   // Handling special cases for model names
  //   const modelMapping: { [key: string]: string } = {
  //     'sale_invoice': 'sale_invoice_order',
  //     'purchase_order': 'purchase_order_data',
  //     'purchase_invoice': 'purchase_invoice_orders',
  //     'sale_return': 'sale_return_order',
  //     'purchase_return': 'purchase_return_orders'
  //   };
  
  //   parentModel = modelMapping[parentModel] || parentModel;
  
  //   const products = data[modelName] || [];
  //   let totalAmount = 0;
  //   let totalDiscount = 0;
  //   let totalRate = 0;
  
  //   // Reset taxAmount before recalculating
  //   let taxAmount = 0; 
  
  //   // console.log("Initial taxAmount in edit mode : ", taxAmount);
  
  //   const billingAddress = data[parentModel]?.billing_address || '';
  //   // console.log("billingAddress : ", billingAddress);
  
  //   if (products.length) {
  //     products.forEach((product: any) => {
  //       if (product) {
  //         console.log("Product : ", product);
  //         const quantity = Number(product.quantity ?? 0);
  //         console.log("quantity in calculation : ", quantity)
  //         // 👇 Start with DB or user-entered rate
  //         let rate = Number(product.rate ?? 0);
  //         console.log("Rate in calculation : ", rate)

  //         const discountPercentage = Number(product.discount ?? 0);
  
  //         // Calculate individual product amounts
  //         const itemValue = quantity * rate;
  //         const discountAmount = (itemValue * discountPercentage) / 100;
  //         const amount = itemValue - discountAmount;
  
  //         product.item_value = itemValue.toFixed(2);
  //         product.discount_amount = discountAmount.toFixed(2);
  //         product.amount = amount.toFixed(2);
  
  //         // Update totals
  //         if (amount > 0 && quantity > 0) {
  //           totalRate += itemValue;
  //           totalAmount += amount;
  //           totalDiscount += discountAmount;
  
  //           // Calculate GST values if applicable
  //           if (product.product?.gst_input) {
  //             const gstValue = (amount * Number(product.product.gst_input)) / 100;
  
  //             // Determine CGST, SGST, or IGST based on billing address
  //             if (billingAddress.includes('Andhra Pradesh')) {
  //               product.cgst = (gstValue / 2).toFixed(2);
  //               product.sgst = (gstValue / 2).toFixed(2);
  //               product.igst = 0.00;
  //             } else {
  //               product.igst = gstValue.toFixed(2);
  //               product.cgst = 0.00;
  //               product.sgst = 0.00;
  //             }
  //           }
  //         }
  //       }
  //     });
  
  //     // Now calculate the total taxAmount from all products
  //     taxAmount = products.reduce((totalTax: number, product: any) => {
  //       return totalTax + Number(product.igst || 0) + Number(product.sgst || 0) + Number(product.cgst || 0);
  //     }, 0);
  
  //     // console.log("Final calculated tax_amount : ", taxAmount);
  //     // console.log("products : ", products);
  
  //     // Apply GST distribution logic to form controls
  //     products.forEach((product: any, index: number) => {
  //       const itemControls = form?.controls?.[modelName]?.controls?.[index];
  
  //       if (itemControls && itemControls instanceof FormGroup) {
  //         const controls = itemControls.controls;
  //         // console.log("product cgst : ", product.cgst);
  //         // console.log("product sgst : ", product.sgst);

  //         // Set CGST, SGST, or IGST for each product
  //         if (controls['cgst']) controls['cgst'].setValue(product.cgst || 0.00);
  //         if (controls['sgst']) controls['sgst'].setValue(product.sgst || 0.00);
  //         if (controls['igst']) controls['igst'].setValue(product.igst || 0.00);
  //       }
  //     });
  //   }
  
  //   // Ensure form and parent model exist before updating total values
  //   if (form?.controls?.[parentModel]?.controls) {
  //     const controls: any = form.controls[parentModel].controls;
  
  //     if (controls.item_value) controls.item_value.setValue(totalRate.toFixed(2));
  //     if (controls.tax_amount) controls.tax_amount.setValue(taxAmount.toFixed(2));
  //     // console.log("Setting tax_amount to : ", taxAmount.toFixed(2));
  //     if (controls.discount) controls.discount.setValue(totalDiscount.toFixed(2));
  
  //     // Handle additional amounts
  //     const cessAmount = Number(data[parentModel]?.cess_amount ?? 0);
  //     const advanceAmount = Number(data[parentModel]?.advance_amount ?? 0);
  //     const saleOrderDiscount = Number(data[parentModel]?.dis_amt ?? 0);
  
  //     // Final total amount calculation
  //     const finalAmount = (totalAmount + taxAmount + cessAmount) - saleOrderDiscount - advanceAmount;
  
  //     controls.total_amount.setValue(finalAmount.toFixed(2));
  //   } else {
  //     console.error("Form controls not found for:", parentModel);
  //   }
  // }

// export function calculateTotalAmount(data: any, modelName: string, form: any) {
//   if (!data) return;

//   // Determine the parent model dynamically
//   let parentModel = modelName.replace('_items', '');

//   // Handling special cases for model names
//   const modelMapping: { [key: string]: string } = {
//     sale_invoice: 'sale_invoice_order',
//     purchase_order: 'purchase_order_data',
//     purchase_invoice: 'purchase_invoice_orders',
//     sale_return: 'sale_return_order',
//     purchase_return: 'purchase_return_orders'
//   };

//   parentModel = modelMapping[parentModel] || parentModel;

//   const products = data[modelName] || [];
//   let totalAmount = 0;
//   let totalDiscount = 0;
//   let totalRate = 0;

//   // Reset taxAmount before recalculating
//   let taxAmount = 0;

//   const billingAddress = data[parentModel]?.billing_address || '';

//   //  NEW: Identify Purchase Invoice without tax
//   const isPurchaseInvoice = parentModel === 'purchase_invoice_orders';
//   const isWithoutTaxPurchase =
//     isPurchaseInvoice && data[parentModel]?.voucher === 'Purchase';

//   if (products.length) {
//     products.forEach((product: any) => {
//       if (product) {
//         const quantity = Number(product.quantity ?? 0);
//         let rate = Number(product.rate ?? 0);
//         const discountPercentage = Number(product.discount ?? 0);

//         // Calculate individual product amounts
//         const itemValue = quantity * rate;
//         const discountAmount = (itemValue * discountPercentage) / 100;
//         const amount = itemValue - discountAmount;

//         product.item_value = itemValue.toFixed(2);
//         product.discount_amount = discountAmount.toFixed(2);
//         product.amount = amount.toFixed(2);

//         // Update totals
//         if (amount > 0 && quantity > 0) {
//           totalRate += itemValue;
//           totalAmount += amount;
//           totalDiscount += discountAmount;

//           //  UPDATED GST LOGIC (Purchase without tax bypass)
//           if (!isWithoutTaxPurchase && product.product?.gst_input) {
//             const gstValue = (amount * Number(product.product.gst_input)) / 100;

//             if (billingAddress.includes('Andhra Pradesh')) {
//               product.cgst = (gstValue / 2).toFixed(2);
//               product.sgst = (gstValue / 2).toFixed(2);
//               product.igst = 0.00;
//             } else {
//               product.igst = gstValue.toFixed(2);
//               product.cgst = 0.00;
//               product.sgst = 0.00;
//             }
//           } else {
//             //  Force zero tax for Purchase (Without Tax)
//             product.cgst = 0.00;
//             product.sgst = 0.00;
//             product.igst = 0.00;
//           }
//         }
//       }
//     });

//     //  UPDATED total tax calculation
//     taxAmount = isWithoutTaxPurchase
//       ? 0
//       : products.reduce((totalTax: number, product: any) => {
//           return (
//             totalTax +
//             Number(product.igst || 0) +
//             Number(product.sgst || 0) +
//             Number(product.cgst || 0)
//           );
//         }, 0);

//     // Apply GST values to form controls
//     products.forEach((product: any, index: number) => {
//       const itemControls = form?.controls?.[modelName]?.controls?.[index];

//       if (itemControls && itemControls instanceof FormGroup) {
//         const controls = itemControls.controls;

//         if (controls['cgst']) controls['cgst'].setValue(product.cgst || 0.00);
//         if (controls['sgst']) controls['sgst'].setValue(product.sgst || 0.00);
//         if (controls['igst']) controls['igst'].setValue(product.igst || 0.00);
//       }
//     });
//   }

//   // Update parent totals
//   if (form?.controls?.[parentModel]?.controls) {
//     const controls: any = form.controls[parentModel].controls;

//     if (controls.item_value) controls.item_value.setValue(totalRate.toFixed(2));
//     if (controls.tax_amount) controls.tax_amount.setValue(taxAmount.toFixed(2));
//     if (controls.discount) controls.discount.setValue(totalDiscount.toFixed(2));

//     const cessAmount = Number(data[parentModel]?.cess_amount ?? 0);
//     const advanceAmount = Number(data[parentModel]?.advance_amount ?? 0);
//     const saleOrderDiscount = Number(data[parentModel]?.dis_amt ?? 0);

//     const finalAmount =
//       totalAmount + taxAmount + cessAmount - saleOrderDiscount - advanceAmount;

//     controls.total_amount.setValue(finalAmount.toFixed(2));
//   } else {
//     console.error('Form controls not found for:', parentModel);
//   }
// }

//pramod-change....
// export function calculateTotalAmount(data: any, modelName: string, form: any) {
//   if (!data) return;

//   let parentModel = modelName.replace('_items', '');

//   const modelMapping: { [key: string]: string } = {
//     sale_invoice: 'sale_invoice_order',
//     purchase_order: 'purchase_order_data',
//     purchase_invoice: 'purchase_invoice_orders',
//     sale_return: 'sale_return_order',
//     purchase_return: 'purchase_return_orders'
//   };

//   parentModel = modelMapping[parentModel] || parentModel;

//   const products = data[modelName] || [];
//   let totalAmount = 0;
//   let totalDiscount = 0;
//   let totalRate = 0;
//   let taxAmount = 0;

//   const companyState = 'Andhra Pradesh';
//   const billingAddress = data[parentModel]?.billing_address || '';

//   const isLocalState =
//     !billingAddress || billingAddress.includes(companyState);

//   const taxType = data[parentModel]?.tax || 'Exclusive';

//   const isPurchaseInvoice = parentModel === 'purchase_invoice_orders';
//   const isWithoutTaxPurchase =
//     isPurchaseInvoice && data[parentModel]?.voucher === 'Purchase';

//   if (products.length) {
//     products.forEach((product: any) => {
//       if (product) {
//         const quantity = Number(product.quantity ?? 0);
//         let rate = Number(product.rate ?? 0);

//         const itemValue = quantity * rate;

//         // Discount Logic
//         let discountAmount = 0;

//         if (product.discount_amount && Number(product.discount_amount) > 0) {
//           discountAmount = Number(product.discount_amount);
//         } else {
//           const discountPercentage = Number(product.discount ?? 0);
//           discountAmount = (itemValue * discountPercentage) / 100;
//         }

//         const amountBeforeTax = itemValue - discountAmount;

//         let amount = amountBeforeTax;
//         let gstValue = 0;

//         // Inclusive / Exclusive GST Logic
//         if (!isWithoutTaxPurchase && product.product?.gst_input) {
//           const gstPercent = Number(product.product.gst_input);

//           if (taxType === 'Inclusive') {
//             const baseAmount =
//               amountBeforeTax / (1 + gstPercent / 100);

//             gstValue = amountBeforeTax - baseAmount;
//             amount = baseAmount;
//           } else {
//             gstValue = (amountBeforeTax * gstPercent) / 100;
//           }
//         }

//         product.item_value = itemValue.toFixed(2);
//         product.discount_amount = discountAmount.toFixed(2);
//         product.amount = amount.toFixed(2);

//         if (amount > 0 && quantity > 0) {
//           totalRate += itemValue;
//           totalAmount += amount;
//           totalDiscount += discountAmount;

//           if (!isWithoutTaxPurchase && product.product?.gst_input) {
//             if (isLocalState) {
//               product.cgst = (gstValue / 2).toFixed(2);
//               product.sgst = (gstValue / 2).toFixed(2);
//               product.igst = 0.00;
//             } else {
//               product.igst = gstValue.toFixed(2);
//               product.cgst = 0.00;
//               product.sgst = 0.00;
//             }
//           } else {
//             product.cgst = 0.00;
//             product.sgst = 0.00;
//             product.igst = 0.00;
//           }
//         }
//       }
//     });

//     // --------------------------------
//     // Shipping Charges Tax Calculation (NEW)
//     // --------------------------------
//     const shippingCharges =
//       Number(data?.order_shipments?.shipping_charges ?? 0);

//     console.log("Shipping Charges : ", shippingCharges);

//     const shippingGstPercent =
//       Number(data[parentModel]?.shipping_gst ?? 0);

//     let shippingTaxAmount = 0;
//     let shippingCgst = 0;
//     let shippingSgst = 0;
//     let shippingIgst = 0;

//     if (shippingCharges > 0 && shippingGstPercent > 0) {
//       if (taxType === 'Inclusive') {
//         const baseShipping =
//           shippingCharges / (1 + shippingGstPercent / 100);

//         shippingTaxAmount = shippingCharges - baseShipping;
//       } else {
//         shippingTaxAmount =
//           (shippingCharges * shippingGstPercent) / 100;
//       }

//       if (isLocalState) {
//         shippingCgst = shippingTaxAmount / 2;
//         shippingSgst = shippingTaxAmount / 2;
//       } else {
//         shippingIgst = shippingTaxAmount;
//       }
//     }

//     taxAmount = isWithoutTaxPurchase
//       ? 0
//       : products.reduce((totalTax: number, product: any) => {
//           return (
//             totalTax +
//             Number(product.igst || 0) +
//             Number(product.sgst || 0) +
//             Number(product.cgst || 0)
//           );
//         }, 0);

//     // Add shipping tax
//     taxAmount += shippingTaxAmount;

//     products.forEach((product: any, index: number) => {
//       const itemControls = form?.controls?.[modelName]?.controls?.[index];

//       if (itemControls && itemControls instanceof FormGroup) {
//         const controls = itemControls.controls;

//         if (controls['cgst']) controls['cgst'].setValue(product.cgst || 0.00);
//         if (controls['sgst']) controls['sgst'].setValue(product.sgst || 0.00);
//         if (controls['igst']) controls['igst'].setValue(product.igst || 0.00);
//       }
//     });
//   }

//   if (form?.controls?.[parentModel]?.controls) {
//     const controls: any = form.controls[parentModel].controls;

//     if (controls.item_value) controls.item_value.setValue(totalRate.toFixed(2));
//     if (controls.tax_amount) controls.tax_amount.setValue(taxAmount.toFixed(2));
//     if (controls.discount) controls.discount.setValue(totalDiscount.toFixed(2));

//     const cessAmount = Number(data[parentModel]?.cess_amount ?? 0);
//     const advanceAmount = Number(data[parentModel]?.advance_amount ?? 0);
//     const saleOrderDiscount = Number(data[parentModel]?.dis_amt ?? 0);

//     const shippingCharges =
//       Number(data?.order_shipments?.shipping_charges ?? 0);
    
//     // Push to parent model so billing summary can read it
//     if (controls.shipping_charges) {
//       controls.shipping_charges.setValue(shippingCharges.toFixed(2));
//     }

//     console.log("Total Amount before final calculation : ", totalAmount);
//     console.log("shippingCharges -1 : ", shippingCharges)
    

//     const finalAmount =
//       totalAmount +
//       taxAmount +
//       shippingCharges +
//       cessAmount -
//       saleOrderDiscount -
//       advanceAmount;

//     controls.total_amount.setValue(finalAmount.toFixed(2));
//   } else {
//     console.error('Form controls not found for:', parentModel);
//   }
// }

// export function calculateTotalAmount(data: any, modelName: string, form: any) {
//   if (!data) return;

//   let parentModel = modelName.replace('_items', '');

//   const modelMapping: { [key: string]: string } = {
//     sale_invoice: 'sale_invoice_order',
//     purchase_order: 'purchase_order_data',
//     purchase_invoice: 'purchase_invoice_orders',
//     sale_return: 'sale_return_order',
//     purchase_return: 'purchase_return_orders'
//   };

//   parentModel = modelMapping[parentModel] || parentModel;

//   const products = data[modelName] || [];

//   let totalAmount = 0;
//   let totalDiscount = 0;
//   let totalRate = 0;
//   let taxAmount = 0;

//   const companyState = 'Andhra Pradesh';
//   const billingAddress = data[parentModel]?.billing_address || '';

//   const isLocalState =
//     !billingAddress || billingAddress.includes(companyState);

//   const taxType = data[parentModel]?.tax || 'Exclusive';

//   const isPurchaseInvoice = parentModel === 'purchase_invoice_orders';
//   const isWithoutTaxPurchase =
//     isPurchaseInvoice && data[parentModel]?.voucher === 'Purchase';

//   // -----------------------------
//   // PRODUCT CALCULATION
//   // -----------------------------
//   if (products.length) {
//     products.forEach((product: any) => {
//       const quantity = Number(product.quantity ?? 0);
//       const rate = Number(product.rate ?? 0);

//       const itemValue = quantity * rate;

//       let discountAmount = 0;

//       if (product.discount_amount && Number(product.discount_amount) > 0) {
//         discountAmount = Number(product.discount_amount);
//       } else {
//         const discountPercentage = Number(product.discount ?? 0);
//         discountAmount = (itemValue * discountPercentage) / 100;
//       }

//       const amountBeforeTax = itemValue - discountAmount;

//       let amount = amountBeforeTax;
//       let gstValue = 0;

//       if (!isWithoutTaxPurchase && product.product?.gst_input) {
//         const gstPercent = Number(product.product.gst_input);

//         if (taxType === 'Inclusive') {
//           const baseAmount =
//             amountBeforeTax / (1 + gstPercent / 100);

//           gstValue = amountBeforeTax - baseAmount;
//           amount = baseAmount;
//         } else {
//           gstValue = (amountBeforeTax * gstPercent) / 100;
//         }
//       }

//       product.item_value = itemValue.toFixed(2);
//       product.discount_amount = discountAmount.toFixed(2);
//       product.amount = amount.toFixed(2);

//       totalRate += itemValue;
//       totalAmount += amount;
//       totalDiscount += discountAmount;

//       if (!isWithoutTaxPurchase && product.product?.gst_input) {
//         if (isLocalState) {
//           product.cgst = (gstValue / 2).toFixed(2);
//           product.sgst = (gstValue / 2).toFixed(2);
//           product.igst = 0.00;
//         } else {
//           product.igst = gstValue.toFixed(2);
//           product.cgst = 0.00;
//           product.sgst = 0.00;
//         }
//       } else {
//         product.cgst = 0.00;
//         product.sgst = 0.00;
//         product.igst = 0.00;
//       }
//     });
//   }

//   // -----------------------------
//   // SHIPPING CALCULATION
//   // -----------------------------
//   const shippingCharges =
//     Number(data?.order_shipments?.shipping_charges ?? 0);

//   const shippingGstPercent =
//     Number(data?.order_shipments?.shipping_gst ?? 0);


//   let shippingTaxAmount = 0;

//   if (shippingCharges > 0 && shippingGstPercent > 0) {
//     if (taxType === 'Inclusive') {
//       const baseShipping =
//         shippingCharges / (1 + shippingGstPercent / 100);

//       shippingTaxAmount = shippingCharges - baseShipping;
//     } else {
//       shippingTaxAmount =
//         (shippingCharges * shippingGstPercent) / 100;
//     }
//   }

//   // -----------------------------
//   // TOTAL TAX CALCULATION
//   // -----------------------------
//   taxAmount = isWithoutTaxPurchase
//     ? 0
//     : products.reduce((totalTax: number, product: any) => {
//         return (
//           totalTax +
//           Number(product.igst || 0) +
//           Number(product.sgst || 0) +
//           Number(product.cgst || 0)
//         );
//       }, 0);

//   taxAmount += shippingTaxAmount;

//     products.forEach((product: any, index: number) => {
//       const itemControls = form?.controls?.[modelName]?.controls?.[index];

//       if (itemControls && itemControls instanceof FormGroup) {
//         const controls = itemControls.controls;

//         if (controls['cgst']) controls['cgst'].setValue(product.cgst || 0.00);
//         if (controls['sgst']) controls['sgst'].setValue(product.sgst || 0.00);
//         if (controls['igst']) controls['igst'].setValue(product.igst || 0.00);
//       }
//     });

//   // -----------------------------
//   // UPDATE FORM CONTROLS
//   // -----------------------------
//   if (form?.controls?.[parentModel]?.controls) {
//     const controls: any = form.controls[parentModel].controls;

//     if (controls.item_value)
//       controls.item_value.setValue(totalRate.toFixed(2));

//     if (controls.tax_amount)
//       controls.tax_amount.setValue(taxAmount.toFixed(2));

//     if (controls.discount)
//       controls.discount.setValue(totalDiscount.toFixed(2));

//     const cessAmount = Number(data[parentModel]?.cess_amount ?? 0);
//     const advanceAmount = Number(data[parentModel]?.advance_amount ?? 0);
//     const saleOrderDiscount = Number(data[parentModel]?.dis_amt ?? 0);
//     const shippingCharges =
//       Number(data?.order_shipments?.shipping_charges ?? 0);

//     if (controls.shipping_charges) {
//       const formattedShipping = Number(shippingCharges || 0).toFixed(2);

//       controls.shipping_charges.setValue(formattedShipping);

//       // Sync model
//       data[parentModel] = {
//         ...data[parentModel],
//         shipping_charges: Number(formattedShipping)
//       };
//     }


//     // Final Total
//     const finalAmount =
//       totalAmount +
//       taxAmount +
//       shippingCharges +
//       cessAmount -
//       saleOrderDiscount -
//       advanceAmount;

//     if (controls.total_amount)
//       controls.total_amount.setValue(finalAmount.toFixed(2));
//   }
// }


export function calculateTotalAmount(data: any, modelName: string, form: any) {
  // if (!data) return;

  // -----------------------------
  // MODEL MAPPING
  // -----------------------------
  let parentModel = modelName.replace('_items', '');

  const modelMapping: { [key: string]: string } = {
    sale_invoice: 'sale_invoice_order',
    purchase_order: 'purchase_order_data',
    purchase_invoice: 'purchase_invoice_orders',
    sale_return: 'sale_return_order',
    purchase_return: 'purchase_return_orders'
  };

  parentModel = modelMapping[parentModel] || parentModel;

  // -----------------------------
  // INITIALIZE VARIABLES
  // -----------------------------
  const products = data[modelName] || [];
  
  let totalBaseAmount = 0;        // Total of product base prices (tax exclusive)
  let totalDiscount = 0;          // Total discount amount
  let totalRate = 0;              // Total before discount (quantity * rate)
  let totalTaxAmount = 0;         // Total tax (products + shipping)
  
  let productTaxAmount = 0;        // Tax from products only
  let shippingTaxAmount = 0;       // Tax from shipping only

  // -----------------------------
  // COMPANY & CUSTOMER DETAILS
  // -----------------------------
  const companyState = 'Andhra Pradesh';
  const billingAddress = data[parentModel]?.billing_address || '';
  const isLocalState = !billingAddress || billingAddress.includes(companyState);

  // Tax types
  const productTaxType = data[parentModel]?.tax || 'Exclusive';
  const shippingTaxType = data?.order_shipments?.tax || productTaxType;

  const isPurchaseInvoice = parentModel === 'purchase_invoice_orders';
  const isWithoutTaxPurchase = isPurchaseInvoice && data[parentModel]?.voucher === 'Purchase';

  // -----------------------------
  // PRODUCT CALCULATION
  // -----------------------------
  if (products.length) {
    products.forEach((product: any) => {
      const quantity = Number(product.quantity ?? 0);
      const rate = Number(product.rate ?? 0);
      console.log("Quantity: ", quantity, " Rate: ", rate);

      const itemValue = quantity * rate; // Total before discount

      // Calculate discount
      let discountAmount = 0;
      if (product.discount_amount && Number(product.discount_amount) > 0) {
        discountAmount = Number(product.discount_amount);
      } else {
        const discountPercentage = Number(product.discount ?? 0);
        discountAmount = (itemValue * discountPercentage) / 100;
      }

      const amountBeforeTax = itemValue - discountAmount; // Value after discount, before tax
      
      let baseAmount = amountBeforeTax; // Tax-exclusive base price
      let gstValue = 0; // Tax amount

      // Calculate product tax
      if (!isWithoutTaxPurchase && product.product?.gst_input) {
        const gstPercent = Number(product.product.gst_input);

        if (productTaxType === 'Inclusive') {
          // Extract tax from inclusive price
          baseAmount = amountBeforeTax / (1 + gstPercent / 100);
          gstValue = amountBeforeTax - baseAmount;
        } else {
          // Add tax to exclusive price
          baseAmount = amountBeforeTax;
          gstValue = (amountBeforeTax * gstPercent) / 100;
        }
      }

      // Store calculated values
      product.item_value = itemValue.toFixed(2);
      product.discount_amount = discountAmount.toFixed(2);
      product.base_amount = baseAmount.toFixed(2); // Tax-exclusive amount
      product.tax_amount = gstValue.toFixed(2); // Tax on this product

      // Accumulate totals
      totalRate += itemValue;
      totalBaseAmount += baseAmount;
      totalDiscount += discountAmount;
      productTaxAmount += gstValue;

      // Split tax into CGST/SGST/IGST based on location
      if (!isWithoutTaxPurchase && product.product?.gst_input) {
        if (isLocalState) {
          product.cgst = (gstValue / 2).toFixed(2);
          product.sgst = (gstValue / 2).toFixed(2);
          product.igst = 0.00;
        } else {
          product.igst = gstValue.toFixed(2);
          product.cgst = 0.00;
          product.sgst = 0.00;
        }
      } else {
        product.cgst = 0.00;
        product.sgst = 0.00;
        product.igst = 0.00;
      }
    });
  }

  // -----------------------------
  // SHIPPING CALCULATION
  // -----------------------------
  const shippingCharges = Number(data?.order_shipments?.shipping_charges ?? 0);
  const shippingGstPercent = Number(data?.order_shipments?.shipping_gst ?? 0);
  
  let shippingBaseAmount = shippingCharges; // Tax-exclusive shipping amount

  if (shippingCharges > 0 && shippingGstPercent > 0) {
    if (shippingTaxType === 'Inclusive') {
      // Extract tax from inclusive shipping charge
      shippingBaseAmount = shippingCharges / (1 + shippingGstPercent / 100);
      shippingTaxAmount = shippingCharges - shippingBaseAmount;
    } else {
      // Add tax to exclusive shipping charge
      shippingBaseAmount = shippingCharges;
      shippingTaxAmount = (shippingCharges * shippingGstPercent) / 100;
    }

    // Store shipping details (optional - for reference)
    if (data.order_shipments) {
      data.order_shipments.base_amount = shippingBaseAmount.toFixed(2);
      data.order_shipments.tax_amount = shippingTaxAmount.toFixed(2);
      data.order_shipments.total_amount = (shippingBaseAmount + shippingTaxAmount).toFixed(2);
    }
  }

  // -----------------------------
  // TOTAL TAX CALCULATION
  // -----------------------------
  totalTaxAmount = productTaxAmount + shippingTaxAmount;

  // -----------------------------
  // UPDATE PRODUCT FORM CONTROLS
  // -----------------------------
  products.forEach((product: any, index: number) => {
    const itemControls = form?.controls?.[modelName]?.controls?.[index];

    if (itemControls && itemControls instanceof FormGroup) {
      const controls = itemControls.controls;

      if (controls['cgst']) controls['cgst'].setValue(product.cgst || 0.00);
      if (controls['sgst']) controls['sgst'].setValue(product.sgst || 0.00);
      if (controls['igst']) controls['igst'].setValue(product.igst || 0.00);
      if (controls['base_amount']) controls['base_amount'].setValue(product.base_amount || 0.00);
      if (controls['tax_amount']) controls['tax_amount'].setValue(product.tax_amount || 0.00);
    }
  });

  // -----------------------------
  // UPDATE MAIN FORM CONTROLS
  // -----------------------------
  if (form?.controls?.[parentModel]?.controls) {
    const controls: any = form.controls[parentModel].controls;

    // Sub-totals
    if (controls.item_value)
      controls.item_value.setValue(totalRate.toFixed(2));

    if (controls.taxable_amount)
      controls.taxable_amount.setValue(totalBaseAmount.toFixed(2));

    if (controls.discount)
      controls.discount.setValue(totalDiscount.toFixed(2));

    if (controls.tax_amount)
      controls.tax_amount.setValue(totalTaxAmount.toFixed(2));

    // Shipping
    if (controls.shipping_charges) {
      controls.shipping_charges.setValue(shippingCharges.toFixed(2));
      
      // Sync model
      data[parentModel] = {
        ...data[parentModel],
        shipping_charges: Number(shippingCharges.toFixed(2))
      };
    }

    // Other adjustments
    const cessAmount = Number(data[parentModel]?.cess_amount ?? 0);
    const advanceAmount = Number(data[parentModel]?.advance_amount ?? 0);
    const saleOrderDiscount = Number(data[parentModel]?.dis_amt ?? 0);
    const roundOff = Number(data[parentModel]?.round_off ?? 0);

    // -----------------------------
    // CALCULATE PRODUCT TOTAL BASED ON ITS TAX TYPE
    // -----------------------------
    let productTotalToAdd = totalBaseAmount; // Default to base
    
    if (productTaxType === 'Exclusive') {
      // For Exclusive: base + tax
      productTotalToAdd = totalBaseAmount + productTaxAmount;
    } else {
      // For Inclusive: base amount is what we add (tax already included in product display)
      // But wait - in Inclusive, the user sees amountBeforeTax as the total
      // We need to use the original amountBeforeTax from products
      productTotalToAdd = products.reduce((sum, product) => {
        return sum + (Number(product.item_value) - Number(product.discount_amount));
      }, 0);
    }

    // -----------------------------
    // CALCULATE SHIPPING TOTAL BASED ON ITS TAX TYPE
    // -----------------------------
    let shippingTotalToAdd = shippingCharges;
    
    if (shippingTaxType === 'Exclusive') {
      // For Exclusive: base + tax
      shippingTotalToAdd = shippingCharges + shippingTaxAmount;
    }
    // For Inclusive: shippingCharges already includes tax

    // -----------------------------
    // FINAL TOTAL CALCULATION - CORRECTED
    // -----------------------------
    const finalAmount = 
      productTotalToAdd +           // Product total based on its tax type
      shippingTotalToAdd +          // Shipping total based on its tax type
      cessAmount -                  // Cess
      saleOrderDiscount -           // Order-level discount
      advanceAmount +               // Advance payment
      roundOff;                     // Round off

    if (controls.total_amount) {
      controls.total_amount.setValue(finalAmount.toFixed(2));
      
      // Sync model
      data[parentModel] = {
        ...data[parentModel],
        total_amount: Number(finalAmount.toFixed(2))
      };
    }

    // Calculate amount in words (optional)
    if (controls.amount_in_words) {
      controls.amount_in_words.setValue(numberToWords(finalAmount));
    }
  }

  // -----------------------------
  // RETURN CALCULATED VALUES
  // -----------------------------
  return {
    totalBaseAmount,
    totalTaxAmount,
    productTaxAmount,
    shippingTaxAmount,
    totalDiscount,
    // finalAmount
  };
}

// -----------------------------
// HELPER FUNCTION: Number to Words
// -----------------------------
function numberToWords(num: number): string {
  return num.toFixed(2).toString() + ' Only';
}