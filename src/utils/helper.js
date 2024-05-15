export const DECIMALS = 10 ** 18;

export const ether = (wei) => wei / DECIMALS;

export const formatPrice = (price) => {
  const precision = 100; 
  const priceNum = Number(price);
  const formattedPrice = ether(priceNum);
  const roundedPrice = Math.round(formattedPrice * precision) / precision;

  return roundedPrice;
};