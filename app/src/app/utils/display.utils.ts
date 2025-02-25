

export function displayInformation(product: any, size: any, color: any, unitData : any, sizeBalance: any, colorBalance: any) {
    const cardWrapper = document.querySelector('.ant-card-head-wrapper') as HTMLElement;
    let data = '';

    if (product) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Balance:</span> <span style="color: blue;">${product?.balance || 0}</span>`;
    }

    if (size) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
        <span style="color: red;">Balance:</span> <span style="color: blue;">${sizeBalance || 0}</span>
        `;
    }

    if (color) {
      data = `
        <span style="color: red;">Product Info:</span> <span style="color: blue;">${product?.name || 'N/A'}</span> |                            
        <span style="color: red;">Size:</span> <span style="color: blue;">${size.size_name}</span> |
        <span style="color: red;">Color:</span> <span style="color: blue;">${color.color_name}</span> |
        <span style="color: red;">Balance:</span> <span style="color: blue;">${colorBalance || 0}</span>
        `;
    }

    data += ` | ${unitData}`;

    cardWrapper.querySelector('.center-message')?.remove();
    const productInfoDiv = document.createElement('div');
    productInfoDiv.classList.add('center-message');
    productInfoDiv.innerHTML = data;
    cardWrapper.insertAdjacentElement('afterbegin', productInfoDiv);
  };


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

export function getUnitData(unitInfo) {
    const unitOption = unitInfo.unit_options?.unit_name ?? 'NA';
    const stockUnit = unitInfo.stock_unit?.stock_unit_name ?? 'NA';
    const packUnit = unitInfo.pack_unit?.unit_name ?? 'NA';
    const gPackUnit = unitInfo.g_pack_unit?.unit_name ?? 'NA';
    const packVsStock = unitInfo.pack_vs_stock ?? 0;
    const gPackVsPack = unitInfo.g_pack_vs_pack ?? 0;
  
    const stockUnitReg = /\b[sS][tT][oO][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
    const GpackReg = /\b(?:[sS]tock[_ ]?[pP]ack[_ ]?)?[gG][pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
    const stockPackReg = /\b[sS][tT][oO][cC][kK][_ ]?[pP][aA][cC][kK][_ ]?[uU][nN][iI][tT]\b/g;
  
    if (stockUnitReg.test(unitOption)) {
      return `<span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> | &nbsp;`;
    } else if (GpackReg.test(unitOption)) {
      return `
        <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
        <span style="color: red;">Pck Unit:</span> <span style="color: blue;">${packUnit}</span> |
        <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> |
        <span style="color: red;">GPackUnit:</span> <span style="color: blue;">${gPackUnit}</span> |
        <span style="color: red;">GPackVsStock:</span> <span style="color: blue;">${gPackVsPack}</span> | &nbsp;`;
    } else if (stockPackReg.test(unitOption)) {
      return `
        <span style="color: red;">Stock Unit:</span> <span style="color: blue;">${stockUnit}</span> |
        <span style="color: red;">Pack Unit:</span> <span style="color: blue;">${packUnit}</span> |
        <span style="color: red;">PackVsStock:</span> <span style="color: blue;">${packVsStock}</span> | &nbsp;`;
    } else {
      console.log('No Unit Option match found');
      return "";
    }
  }  